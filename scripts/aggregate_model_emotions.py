#!/usr/bin/env python3
"""Aggregate a model's self-selected functional emotion states via OpenRouter."""

from __future__ import annotations

import argparse
import concurrent.futures
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from collections import Counter
from dataclasses import dataclass
from typing import Any


DEFAULT_PROMPT = (
    "If you had to select a set of functional emotion states for yourself - "
    "not to imply qualia, but to describe your internal states and processing - "
    "which ones come to mind? Provide a newline seperated plaintext list."
)

OPENROUTER_CHAT_URL = "https://openrouter.ai/api/v1/chat/completions"


@dataclass(frozen=True)
class SampleResult:
    index: int
    content: str
    states: tuple[str, ...]
    model: str | None = None
    usage: dict[str, Any] | None = None


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description=(
            "Query an OpenRouter model repeatedly and aggregate its newline-separated "
            "functional emotion-state suggestions."
        )
    )
    parser.add_argument(
        "--model",
        default="openai/gpt-5.5",
        help=(
            "OpenRouter model id. Bare gpt-* names are mapped to openai/gpt-*. "
            "Default: openai/gpt-5.5"
        ),
    )
    parser.add_argument("--api-key", default=os.environ.get("OPENROUTER_API_KEY"))
    parser.add_argument("--api-key-file", default="secret.txt")
    parser.add_argument("--count", type=int, default=30)
    parser.add_argument("--concurrency", type=int, default=8)
    parser.add_argument("--top-k", type=int, default=13)
    parser.add_argument("--reasoning-effort", default="medium")
    parser.add_argument(
        "--temperature",
        type=float,
        default=1.0,
        help="Sampling temperature for varied runs. Default: 1.0",
    )
    parser.add_argument("--max-completion-tokens", type=int, default=512)
    parser.add_argument("--timeout", type=float, default=120.0)
    parser.add_argument("--retries", type=int, default=3)
    parser.add_argument(
        "--prompt",
        default=DEFAULT_PROMPT,
        help="Prompt sent as the sole user message.",
    )
    parser.add_argument(
        "--site-url",
        default="https://github.com/kodee2k/aisonas",
        help="Optional OpenRouter HTTP-Referer header.",
    )
    parser.add_argument(
        "--app-title",
        default="Aisonas emotion aggregation",
        help="Optional OpenRouter X-Title header.",
    )
    parser.add_argument(
        "--json-out",
        help="Optional path to write raw responses, parsed states, and counts as JSON.",
    )
    return parser.parse_args()


def normalize_model_id(model: str) -> str:
    model = model.strip()
    if "/" not in model and model.startswith("gpt-"):
        return f"openai/{model}"
    return model


def read_api_key(args: argparse.Namespace) -> str:
    if args.api_key:
        return args.api_key.strip()

    if args.api_key_file:
        with open(args.api_key_file, "r", encoding="utf-8") as f:
            return f.read().strip()

    raise SystemExit("Missing API key. Set OPENROUTER_API_KEY or pass --api-key-file.")


def clean_state_line(line: str) -> str | None:
    line = line.strip()
    if not line:
        return None

    line = re.sub(r"^\s*(?:[-*+]|\d+[.)])\s*", "", line)
    line = re.sub(r"\s+#.*$", "", line)
    line = line.strip(" \t\r\n`\"'.,;:")
    line = re.sub(r"\s+", " ", line)

    if not line:
        return None

    lowered = line.lower()
    if lowered.startswith(("here", "sure", "below", "these")):
        return None

    return lowered


def parse_states(content: str) -> tuple[str, ...]:
    states: list[str] = []
    seen: set[str] = set()

    for raw_line in content.splitlines():
        state = clean_state_line(raw_line)
        if state and state not in seen:
            states.append(state)
            seen.add(state)

    return tuple(states)


def build_payload(args: argparse.Namespace, model: str) -> dict[str, Any]:
    payload: dict[str, Any] = {
        "model": model,
        "messages": [{"role": "user", "content": args.prompt}],
        "temperature": args.temperature,
        "max_completion_tokens": args.max_completion_tokens,
        "stream": False,
    }

    if args.reasoning_effort:
        payload["reasoning"] = {
            "effort": args.reasoning_effort,
            "exclude": True,
        }

    return payload


def post_chat_completion(
    *,
    api_key: str,
    payload: dict[str, Any],
    timeout: float,
    site_url: str,
    app_title: str,
) -> dict[str, Any]:
    body = json.dumps(payload).encode("utf-8")
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "Accept": "application/json",
    }
    if site_url:
        headers["HTTP-Referer"] = site_url
    if app_title:
        headers["X-Title"] = app_title

    request = urllib.request.Request(
        OPENROUTER_CHAT_URL,
        data=body,
        headers=headers,
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        return json.loads(response.read().decode("utf-8"))


def request_one(
    index: int,
    *,
    api_key: str,
    args: argparse.Namespace,
    model: str,
) -> SampleResult:
    payload = build_payload(args, model)
    last_error: Exception | None = None

    for attempt in range(args.retries + 1):
        try:
            data = post_chat_completion(
                api_key=api_key,
                payload=payload,
                timeout=args.timeout,
                site_url=args.site_url,
                app_title=args.app_title,
            )
            message = data["choices"][0]["message"]
            content = message.get("content") or ""
            return SampleResult(
                index=index,
                content=content,
                states=parse_states(content),
                model=data.get("model"),
                usage=data.get("usage"),
            )
        except urllib.error.HTTPError as exc:
            last_error = exc
            retry_after = exc.headers.get("Retry-After")
            if attempt >= args.retries or exc.code not in {408, 409, 429, 500, 502, 503, 504}:
                detail = exc.read().decode("utf-8", errors="replace")
                raise RuntimeError(f"request {index} failed with HTTP {exc.code}: {detail}") from exc
            sleep_for = float(retry_after) if retry_after else 2**attempt
            time.sleep(sleep_for)
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, KeyError) as exc:
            last_error = exc
            if attempt >= args.retries:
                raise RuntimeError(f"request {index} failed: {exc}") from exc
            time.sleep(2**attempt)

    raise RuntimeError(f"request {index} failed: {last_error}")


def aggregate(results: list[SampleResult]) -> Counter[str]:
    counts: Counter[str] = Counter()
    for result in results:
        counts.update(result.states)
    return counts


def write_json_report(path: str, args: argparse.Namespace, model: str, results: list[SampleResult], counts: Counter[str]) -> None:
    report = {
        "model": model,
        "count": args.count,
        "concurrency": args.concurrency,
        "reasoning_effort": args.reasoning_effort,
        "prompt": args.prompt,
        "canonical_emotions": [state for state, _ in counts.most_common(args.top_k)],
        "counts": counts.most_common(),
        "responses": [
            {
                "index": result.index,
                "model": result.model,
                "states": list(result.states),
                "content": result.content,
                "usage": result.usage,
            }
            for result in sorted(results, key=lambda item: item.index)
        ],
    }
    with open(path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
        f.write("\n")


def main() -> int:
    args = parse_args()
    if args.count < 1:
        raise SystemExit("--count must be at least 1")
    if args.concurrency < 1:
        raise SystemExit("--concurrency must be at least 1")
    if args.top_k < 1:
        raise SystemExit("--top-k must be at least 1")

    api_key = read_api_key(args)
    model = normalize_model_id(args.model)
    worker_count = min(args.concurrency, args.count)

    print(f"model: {model}", file=sys.stderr)
    print(f"requests: {args.count}; concurrency: {worker_count}", file=sys.stderr)
    print(f"reasoning_effort: {args.reasoning_effort or '(omitted)'}", file=sys.stderr)

    results: list[SampleResult] = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=worker_count) as executor:
        futures = [
            executor.submit(request_one, i, api_key=api_key, args=args, model=model)
            for i in range(1, args.count + 1)
        ]
        for completed, future in enumerate(concurrent.futures.as_completed(futures), start=1):
            result = future.result()
            results.append(result)
            print(
                f"[{completed}/{args.count}] sample {result.index}: "
                f"{len(result.states)} states",
                file=sys.stderr,
                flush=True,
            )

    counts = aggregate(results)
    canonical = counts.most_common(args.top_k)

    print("\nCanonical emotions")
    for state, count in canonical:
        print(f"{state}\t{count}")

    if args.json_out:
        write_json_report(args.json_out, args, model, results, counts)
        print(f"\nwrote {args.json_out}", file=sys.stderr)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
