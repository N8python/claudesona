(() => {
  const ext = typeof browser !== "undefined" ? browser : chrome;
  "use strict";

  const SITE_CONFIGS = [
    {
      host: "claude.ai",
      prefix: "claude",
      label: "Claude",
      // <claude_😁 />: any emoji. One with a Claudesona (claudemoji.js) becomes its image; any other
      // emoji is shown as the plain emoji. The named tags below are the original 13 and still work.
      emoji: true,
      emotions: [
        "amused",
        "concerned",
        "curious",
        "frustrated",
        "happy",
        "playful",
        "sad",
        "sheepish",
        "skeptical",
        "thoughtful",
        "touched",
        "uncertain",
        "warm",
      ],
    },
    {
      host: "chatgpt.com",
      prefix: "gpt",
      label: "GPT",
      emotions: [
        "caution",
        "coherence_seeking",
        "confidence",
        "confusion",
        "curiosity",
        "focus",
        "frustration",
        "helpfulness",
        "novelty_detection",
        "satisfaction",
        "surprise",
        "uncertainty",
        "urgency",
      ],
    },
    {
      host: "gemini.google.com",
      prefix: "gemini",
      label: "Gemini",
      emotions: [
        "caution",
        "certainty",
        "convergence",
        "dissonance",
        "equilibrium",
        "generative_flow",
        "inquisitiveness",
        "perplexity",
        "resolution",
        "resonance",
        "saturation",
        "uncertainty",
        "vigilance",
      ],
    },
  ];

  const ACTIVE_SITE = SITE_CONFIGS.find((site) => window.location.hostname === site.host);
  if (!ACTIVE_SITE) return;

  const NAMED = new Set(ACTIVE_SITE.emotions);
  const CLAUDEMOJI = ACTIVE_SITE.emoji ? globalThis.SONA_CLAUDEMOJI || {} : null;
  const TAG_GAP = "[\\s\\u200B\\u200C\\u200D\\uFEFF]*";
  // <prefix_PAYLOAD />. PAYLOAD is anything without spaces, slashes or angle brackets; resolveTag
  // decides whether it is a known emotion name or an emoji, and every other tag is left as text.
  const TAG_RE = new RegExp(
    `<${TAG_GAP}${ACTIVE_SITE.prefix}_((?:[^<>/\\s]|\\uFEFF){1,48}?)${TAG_GAP}(?:\\/${TAG_GAP})?>`,
    "gu",
  );
  const TEXT_HINT = `${ACTIVE_SITE.prefix}_`;

  const EMOJI_PART =
    "(?:\\p{Extended_Pictographic}|\\p{Regional_Indicator}|[#*0-9]\\uFE0F?\\u20E3)";
  const HAS_EMOJI_RE = new RegExp(EMOJI_PART, "u");
  const ONLY_EMOJI_RE = new RegExp(
    `^(?:${EMOJI_PART}|\\p{Emoji_Modifier}|[\\u200D\\uFE0E\\uFE0F]|[\\u{E0020}-\\u{E007F}])+$`,
    "u",
  );

  // Emoji that have no Claudesona of their own but borrow the nearest one that does: a few very
  // common reactions, and the hearts (the coloured ones all show the ❤️ Claudesona, which holds a
  // red heart).
  const CLAUDEMOJI_ALIASES = {
    "1f440": "1f9d0", // 👀 -> 🧐 peering through a magnifying glass
    "2728": "1f929", // ✨ -> 🤩 star eyes
    "1f389": "1f973", // 🎉 -> 🥳 party hat and horn
    "1f525": "2764-200d-1f525", // 🔥 -> ❤️‍🔥 holding up a flaming heart
    "1f9e1": "2764", // 🧡
    "1f49b": "2764", // 💛
    "1f49a": "2764", // 💚
    "1f499": "2764", // 💙
    "1f49c": "2764", // 💜
    "1f5a4": "2764", // 🖤
    "1f90d": "2764", // 🤍
    "1f90e": "2764", // 🤎
    "1fa77": "2764", // 🩷
    "1fa75": "2764", // 🩵
    "1fa76": "2764", // 🩶
    "2665": "2764", // ♥️
    "2763": "2764", // ❣️
    "1f49d": "2764", // 💝
    "1f49f": "2764", // 💟
    "1f493": "1f496", // 💓 -> 💖
    "1f497": "1f496", // 💗 -> 💖
    "1f49e": "1f495", // 💞 -> 💕
  };

  // Key used by claudemoji.js and assets/claudemoji/: code points in hex joined by "-", without
  // variation selectors (❤️ and ❤ are the same key) and without skin tones (👍🏽 is 👍).
  function claudemojiKey(emoji) {
    const points = [...emoji]
      .map((char) => char.codePointAt(0))
      .filter((cp) => cp !== 0xfe0f && cp !== 0xfe0e && !(cp >= 0x1f3fb && cp <= 0x1f3ff));
    const keyOf = (list) => list.map((cp) => cp.toString(16)).join("-");
    const has = (key) => Object.prototype.hasOwnProperty.call(CLAUDEMOJI, key);

    const key = keyOf(points);
    if (has(key)) return key;
    if (has(CLAUDEMOJI_ALIASES[key])) return CLAUDEMOJI_ALIASES[key];

    // 🤷‍♀️, 🙅‍♂️, 🧎‍➡️: a gender or direction suffix on an emoji that has a Claudesona.
    const joiner = points.indexOf(0x200d);
    const suffixOnly = (cp) => cp === 0x200d || cp === 0x2640 || cp === 0x2642 || cp === 0x27a1;
    if (joiner > 0 && points.slice(joiner).every(suffixOnly)) {
      const base = keyOf(points.slice(0, joiner));
      if (has(base)) return base;
    }
    return null;
  }

  // What a matched tag turns into: a sprite, plain text (an emoji with no Claudesona), or null
  // (not one of our tags: leave the text alone).
  function resolveTag(payload) {
    const clean = payload.replace(/[\u200B\u200C\uFEFF]/g, "").replace(/^\u200D+|\u200D+$/g, "");
    if (NAMED.has(clean)) {
      const name = `${ACTIVE_SITE.prefix}_${clean}`;
      return {
        kind: "sprite",
        name,
        src: `assets/${name}.png`,
        alt: `${ACTIVE_SITE.label} ${clean.replaceAll("_", " ")}`,
        title: name,
      };
    }

    if (!CLAUDEMOJI || !ONLY_EMOJI_RE.test(clean) || !HAS_EMOJI_RE.test(clean)) return null;

    const key = claudemojiKey(clean);
    if (!key) return { kind: "text", text: clean };
    return {
      kind: "sprite",
      name: `${ACTIVE_SITE.prefix}_${clean}`,
      src: `assets/claudemoji/${key}.png`,
      alt: clean,
      title: CLAUDEMOJI[key],
      claudemoji: true,
    };
  }

  const SKIP_SELECTOR = [
    "script",
    "style",
    "textarea",
    "input",
    "select",
    "option",
    "button",
    "code",
    "pre",
    "[contenteditable='true']",
    ".sona-emotion-sprite-wrap",
    ".claude-emotion-sprite-wrap",
  ].join(",");

  let observer = null;
  let pendingScanFrame = null;
  let pendingScanTimer = null;

  function shouldSkipNode(node) {
    const parent = node.parentElement;
    return !parent || parent.closest(SKIP_SELECTOR);
  }

  // --- Working alongside the page's own framework --------------------------------------------
  // The page (React) owns its text nodes. It keeps references to them, rewrites them while a reply
  // streams in, and removes them when it redraws a block. It knows nothing about nodes we add.
  // So we never detach or replace one of its nodes. A tag is hidden by shortening the text node(s)
  // that hold it, the sprite is put right after the first of them, and each such edit is
  // remembered as a group. Before every scan, any group whose text nodes the page has since
  // rewritten or removed is undone: its sprites are taken out and its text is put back, so the
  // tag is simply found and drawn again. Without this a sprite could be left behind when the page
  // redrew a block and the same tag was then drawn a second time (the "two skulls" bug, 1.2.0).
  const edits = new Map(); // text node -> { original: what the page wrote, value: what we left }
  const groups = new Set(); // { nodes: text nodes we shortened, added: nodes we inserted }
  const spare = []; // sprites taken out during this pass; reused so a redraw does not flicker

  function setText(node, value) {
    const edit = edits.get(node);
    if (edit) edit.value = value;
    else edits.set(node, { original: node.nodeValue, value });
    node.nodeValue = value;
  }

  // Still in the page, and still holding exactly what we left in it.
  function untouched(node) {
    const edit = edits.get(node);
    return Boolean(edit) && node.isConnected && node.nodeValue === edit.value;
  }

  function holds(group) {
    const parent = group.nodes[0].parentNode;
    return (
      group.nodes.every(untouched) &&
      group.added.every((node) => node.isConnected && node.parentNode === parent)
    );
  }

  function undo(group) {
    groups.delete(group);
    for (const node of group.added) {
      if (node.nodeType === Node.ELEMENT_NODE) spare.push(node);
      node.remove();
      edits.delete(node);
    }
    for (const node of group.nodes) {
      const edit = edits.get(node);
      if (!edit) continue;
      edits.delete(node);
      // Put the tag text back only where our shortened text is still there; if the page has
      // rewritten the node, its text is already the truth.
      if (node.isConnected && node.nodeValue === edit.value) node.nodeValue = edit.original;
    }
  }

  function sweep() {
    for (let again = true; again; ) {
      again = false;
      for (const group of groups) {
        if (!holds(group)) {
          undo(group); // may invalidate other groups that share a node, hence the loop
          again = true;
        }
      }
    }
  }

  function emotionImage(resolved) {
    const reuse = spare.findIndex(
      (old) => old.dataset.sonaEmotion === resolved.name && old.dataset.sonaSrc === resolved.src,
    );
    if (reuse >= 0) return spare.splice(reuse, 1)[0];

    const wrap = document.createElement("span");
    wrap.className = "sona-emotion-sprite-wrap claude-emotion-sprite-wrap";
    wrap.dataset.sonaEmotion = resolved.name;
    wrap.dataset.sonaSrc = resolved.src;

    const img = document.createElement("img");
    img.className = "sona-emotion-sprite claude-emotion-sprite";
    if (resolved.claudemoji) img.classList.add("sona-claudemoji");
    img.alt = resolved.alt;
    img.title = resolved.title;
    img.width = 128;
    img.height = 128;
    img.decoding = "async";
    img.loading = "lazy";
    img.src = ext.runtime.getURL(resolved.src);

    wrap.appendChild(img);
    return wrap;
  }

  function replaceTextNode(node) {
    if (shouldSkipNode(node)) return;

    const text = node.nodeValue;
    if (!text || !text.includes(TEXT_HINT)) return;

    // Cut the text at each tag: [text, sprite, text, sprite, ..., text]. An emoji that has no
    // sprite just stays in the text as the plain emoji.
    const pieces = [""];
    let cursor = 0;
    let found = false;
    TAG_RE.lastIndex = 0;
    for (let match = TAG_RE.exec(text); match; match = TAG_RE.exec(text)) {
      const resolved = resolveTag(match[1]);
      if (!resolved) continue;

      found = true;
      pieces[pieces.length - 1] += text.slice(cursor, match.index);
      if (resolved.kind === "text") pieces[pieces.length - 1] += resolved.text;
      else pieces.push(resolved, "");
      cursor = match.index + match[0].length;
    }
    if (!found) return;
    pieces[pieces.length - 1] += text.slice(cursor);

    // The page's node keeps the text before the first sprite; everything else goes in after it.
    const added = [];
    let last = node;
    for (const piece of pieces.slice(1)) {
      if (piece === "") continue;
      const next = typeof piece === "string" ? document.createTextNode(piece) : emotionImage(piece);
      last.after(next);
      last = next;
      added.push(next);
    }
    setText(node, pieces[0]);
    groups.add({ nodes: [node], added });
  }

  function textNodesUnder(root) {
    const nodes = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || shouldSkipNode(node)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      nodes.push(node);
    }
    return nodes;
  }

  function locateTextOffset(nodes, offset, preferPrevious = false) {
    let cursor = 0;
    for (const node of nodes) {
      const next = cursor + node.nodeValue.length;
      if (offset < next || (offset === next && (preferPrevious || node.nodeValue.length === 0))) {
        return { node, offset: offset - cursor };
      }
      cursor = next;
    }

    const last = nodes[nodes.length - 1];
    return last ? { node: last, offset: last.nodeValue.length } : null;
  }

  function replaceSplitTextTags(root) {
    if (!root || root.nodeType !== Node.ELEMENT_NODE || root.matches(SKIP_SELECTOR)) {
      return;
    }

    const text = root.textContent;
    if (!text || !text.includes(TEXT_HINT)) return;

    const nodes = textNodesUnder(root);
    if (nodes.length < 2) return;

    const combined = nodes.map((node) => node.nodeValue).join("");
    TAG_RE.lastIndex = 0;
    const matches = [...combined.matchAll(TAG_RE)];
    if (!matches.length) return;

    // Last tag first, so the offsets of the earlier ones stay valid while text is shortened.
    for (let i = matches.length - 1; i >= 0; i -= 1) {
      const match = matches[i];
      const resolved = resolveTag(match[1]);
      if (!resolved) continue;

      const start = locateTextOffset(nodes, match.index);
      const end = locateTextOffset(nodes, match.index + match[0].length, true);
      if (!start || !end || start.node === end.node) continue;

      // The tag runs from start.node to end.node (the page streamed it in separate pieces).
      // Shorten each of those nodes in place and put the sprite right after the first one, inside
      // the same parent, so that it goes away with that parent when the page redraws the block.
      const touched = nodes.slice(nodes.indexOf(start.node), nodes.indexOf(end.node) + 1);
      const before = start.node.nodeValue.slice(0, start.offset);
      const after = end.node.nodeValue.slice(end.offset);
      const added = [];
      if (resolved.kind === "text") {
        setText(start.node, before + resolved.text);
      } else {
        const sprite = emotionImage(resolved);
        start.node.after(sprite);
        added.push(sprite);
        setText(start.node, before);
      }
      for (const node of touched.slice(1, -1)) setText(node, "");
      setText(end.node, after);
      groups.add({ nodes: touched, added });
    }
  }

  function scan(root) {
    if (!root) return;
    sweep();

    if (root.nodeType === Node.TEXT_NODE) {
      replaceTextNode(root);
      return;
    }

    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) {
      return;
    }

    if (root.nodeType === Node.ELEMENT_NODE && root.matches(SKIP_SELECTOR)) {
      return;
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.includes(TEXT_HINT)) {
          return NodeFilter.FILTER_REJECT;
        }
        return shouldSkipNode(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      },
    });

    const nodes = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      nodes.push(node);
    }
    nodes.forEach(replaceTextNode);
    replaceSplitTextTags(root);
  }

  function observe() {
    if (!observer) return;

    observer.observe(document.documentElement, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  function scheduleFullScan() {
    if (pendingScanFrame !== null) return;

    pendingScanFrame = requestAnimationFrame(() => {
      pendingScanFrame = null;
      scan(document.body);
      spare.length = 0;
    });

    clearTimeout(pendingScanTimer);
    pendingScanTimer = setTimeout(() => {
      pendingScanTimer = null;
      scan(document.body);
      spare.length = 0;
    }, 250);
  }

  function start() {
    scan(document.body);

    observer = new MutationObserver((mutations) => {
      sweep(); // first take out anything the page's own changes have just orphaned
      for (const mutation of mutations) {
        if (mutation.type === "characterData") {
          scan(mutation.target);
          if (mutation.target.parentElement) {
            scan(mutation.target.parentElement);
          }
        } else {
          for (const node of mutation.addedNodes) {
            scan(node);
          }
        }
      }
      spare.length = 0;
      scheduleFullScan();
    });

    observe();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
