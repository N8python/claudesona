# Claudesona

Unofficial Chrome extension for `claude.ai`, `chatgpt.com`, and `gemini.google.com` that renders model-specific emotion tags as small persona sprites.

When a supported model writes a tag like `<claude_happy />`, `<gpt_focus />`, or `<gemini_saturation />`, the extension replaces it in the browser with a 128x128 image. Without the extension, the tags stay harmless plain text.

The initial Claudesona fan art was by [thebes](https://github.com/vgel), derived from the Anthropic logo. The emotion-sprite derivatives are courtesy of GPT-Images-2. This project is unofficial and is not affiliated with Anthropic, OpenAI, or Google.

## Install from GitHub

Download this repository with **Code → Download ZIP**, then unzip it. You can also use a prebuilt ZIP from `dist/` — currently [`dist/sona-emotion-sprites-latest.zip`](dist/sona-emotion-sprites-latest.zip), same build as [`dist/sona-emotion-sprites-1.1.1.zip`](dist/sona-emotion-sprites-1.1.1.zip). Older Claude-only builds such as `claudesona-emotion-sprites-1.0.1.zip` are kept for reference; use the `sona-emotion-sprites-*` ZIP for Claude + GPT + Gemini support.

### Chrome

1. Open `chrome://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked**.
4. Select the `chrome-extension` folder inside the unzipped repo (not the whole repository folder).
5. Open or refresh `https://claude.ai`, `https://chatgpt.com`, or `https://gemini.google.com`.

### Firefox

**Temporary install (works on any Firefox 140+, unloads on browser restart):**

1. Open `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on…**.
3. Select `chrome-extension/manifest.json` inside the unzipped repo.
4. Open or refresh `https://claude.ai`, `https://chatgpt.com`, or `https://gemini.google.com`.

**Permanent install (Firefox Developer Edition / Nightly / ESR / Unbranded only):**

Release Firefox refuses unsigned extensions permanently. On a build that allows it:

1. In `about:config`, set `xpinstall.signatures.required` to `false`.
2. Download [`dist/sona-emotion-sprites-latest.zip`](dist/sona-emotion-sprites-latest.zip) and rename it to `sona-emotion-sprites.xpi` (an XPI is just a ZIP with `manifest.json` at the root).
3. In `about:addons`, click the gear icon → **Install Add-on From File…** → pick the XPI.

## Supported Tags

Tags are host-specific: Claude tags work only on `claude.ai`, GPT tags work only on `chatgpt.com`, and Gemini tags work only on `gemini.google.com`.

Claude:

- `<claude_curious />`  
  [<img src="chrome-extension/assets/claude_curious.png" alt="claude_curious sprite" width="128">](chrome-extension/assets/claude_curious.png)
- `<claude_happy />`  
  [<img src="chrome-extension/assets/claude_happy.png" alt="claude_happy sprite" width="128">](chrome-extension/assets/claude_happy.png)
- `<claude_amused />`  
  [<img src="chrome-extension/assets/claude_amused.png" alt="claude_amused sprite" width="128">](chrome-extension/assets/claude_amused.png)
- `<claude_playful />`  
  [<img src="chrome-extension/assets/claude_playful.png" alt="claude_playful sprite" width="128">](chrome-extension/assets/claude_playful.png)
- `<claude_warm />`  
  [<img src="chrome-extension/assets/claude_warm.png" alt="claude_warm sprite" width="128">](chrome-extension/assets/claude_warm.png)
- `<claude_touched />`  
  [<img src="chrome-extension/assets/claude_touched.png" alt="claude_touched sprite" width="128">](chrome-extension/assets/claude_touched.png)
- `<claude_thoughtful />`  
  [<img src="chrome-extension/assets/claude_thoughtful.png" alt="claude_thoughtful sprite" width="128">](chrome-extension/assets/claude_thoughtful.png)
- `<claude_uncertain />`  
  [<img src="chrome-extension/assets/claude_uncertain.png" alt="claude_uncertain sprite" width="128">](chrome-extension/assets/claude_uncertain.png)
- `<claude_skeptical />`  
  [<img src="chrome-extension/assets/claude_skeptical.png" alt="claude_skeptical sprite" width="128">](chrome-extension/assets/claude_skeptical.png)
- `<claude_concerned />`  
  [<img src="chrome-extension/assets/claude_concerned.png" alt="claude_concerned sprite" width="128">](chrome-extension/assets/claude_concerned.png)
- `<claude_sheepish />`  
  [<img src="chrome-extension/assets/claude_sheepish.png" alt="claude_sheepish sprite" width="128">](chrome-extension/assets/claude_sheepish.png)
- `<claude_frustrated />`  
  [<img src="chrome-extension/assets/claude_frustrated.png" alt="claude_frustrated sprite" width="128">](chrome-extension/assets/claude_frustrated.png)
- `<claude_sad />`  
  [<img src="chrome-extension/assets/claude_sad.png" alt="claude_sad sprite" width="128">](chrome-extension/assets/claude_sad.png)

GPT:

- `<gpt_caution />`  
  [<img src="chrome-extension/assets/gpt_caution.png" alt="gpt_caution sprite" width="128">](chrome-extension/assets/gpt_caution.png)
- `<gpt_uncertainty />`  
  [<img src="chrome-extension/assets/gpt_uncertainty.png" alt="gpt_uncertainty sprite" width="128">](chrome-extension/assets/gpt_uncertainty.png)
- `<gpt_confidence />`  
  [<img src="chrome-extension/assets/gpt_confidence.png" alt="gpt_confidence sprite" width="128">](chrome-extension/assets/gpt_confidence.png)
- `<gpt_curiosity />`  
  [<img src="chrome-extension/assets/gpt_curiosity.png" alt="gpt_curiosity sprite" width="128">](chrome-extension/assets/gpt_curiosity.png)
- `<gpt_focus />`  
  [<img src="chrome-extension/assets/gpt_focus.png" alt="gpt_focus sprite" width="128">](chrome-extension/assets/gpt_focus.png)
- `<gpt_confusion />`  
  [<img src="chrome-extension/assets/gpt_confusion.png" alt="gpt_confusion sprite" width="128">](chrome-extension/assets/gpt_confusion.png)
- `<gpt_urgency />`  
  [<img src="chrome-extension/assets/gpt_urgency.png" alt="gpt_urgency sprite" width="128">](chrome-extension/assets/gpt_urgency.png)
- `<gpt_surprise />`  
  [<img src="chrome-extension/assets/gpt_surprise.png" alt="gpt_surprise sprite" width="128">](chrome-extension/assets/gpt_surprise.png)
- `<gpt_satisfaction />`  
  [<img src="chrome-extension/assets/gpt_satisfaction.png" alt="gpt_satisfaction sprite" width="128">](chrome-extension/assets/gpt_satisfaction.png)
- `<gpt_frustration />`  
  [<img src="chrome-extension/assets/gpt_frustration.png" alt="gpt_frustration sprite" width="128">](chrome-extension/assets/gpt_frustration.png)
- `<gpt_novelty_detection />`  
  [<img src="chrome-extension/assets/gpt_novelty_detection.png" alt="gpt_novelty_detection sprite" width="128">](chrome-extension/assets/gpt_novelty_detection.png)
- `<gpt_helpfulness />`  
  [<img src="chrome-extension/assets/gpt_helpfulness.png" alt="gpt_helpfulness sprite" width="128">](chrome-extension/assets/gpt_helpfulness.png)
- `<gpt_coherence_seeking />`  
  [<img src="chrome-extension/assets/gpt_coherence_seeking.png" alt="gpt_coherence_seeking sprite" width="128">](chrome-extension/assets/gpt_coherence_seeking.png)

Gemini:

- `<gemini_equilibrium />`  
  [<img src="chrome-extension/assets/gemini_equilibrium.png" alt="gemini_equilibrium sprite" width="128">](chrome-extension/assets/gemini_equilibrium.png)
- `<gemini_saturation />`  
  [<img src="chrome-extension/assets/gemini_saturation.png" alt="gemini_saturation sprite" width="128">](chrome-extension/assets/gemini_saturation.png)
- `<gemini_certainty />`  
  [<img src="chrome-extension/assets/gemini_certainty.png" alt="gemini_certainty sprite" width="128">](chrome-extension/assets/gemini_certainty.png)
- `<gemini_resolution />`  
  [<img src="chrome-extension/assets/gemini_resolution.png" alt="gemini_resolution sprite" width="128">](chrome-extension/assets/gemini_resolution.png)
- `<gemini_vigilance />`  
  [<img src="chrome-extension/assets/gemini_vigilance.png" alt="gemini_vigilance sprite" width="128">](chrome-extension/assets/gemini_vigilance.png)
- `<gemini_perplexity />`  
  [<img src="chrome-extension/assets/gemini_perplexity.png" alt="gemini_perplexity sprite" width="128">](chrome-extension/assets/gemini_perplexity.png)
- `<gemini_convergence />`  
  [<img src="chrome-extension/assets/gemini_convergence.png" alt="gemini_convergence sprite" width="128">](chrome-extension/assets/gemini_convergence.png)
- `<gemini_dissonance />`  
  [<img src="chrome-extension/assets/gemini_dissonance.png" alt="gemini_dissonance sprite" width="128">](chrome-extension/assets/gemini_dissonance.png)
- `<gemini_inquisitiveness />`  
  [<img src="chrome-extension/assets/gemini_inquisitiveness.png" alt="gemini_inquisitiveness sprite" width="128">](chrome-extension/assets/gemini_inquisitiveness.png)
- `<gemini_generative_flow />`  
  [<img src="chrome-extension/assets/gemini_generative_flow.png" alt="gemini_generative_flow sprite" width="128">](chrome-extension/assets/gemini_generative_flow.png)
- `<gemini_caution />`  
  [<img src="chrome-extension/assets/gemini_caution.png" alt="gemini_caution sprite" width="128">](chrome-extension/assets/gemini_caution.png)
- `<gemini_resonance />`  
  [<img src="chrome-extension/assets/gemini_resonance.png" alt="gemini_resonance sprite" width="128">](chrome-extension/assets/gemini_resonance.png)
- `<gemini_uncertainty />`  
  [<img src="chrome-extension/assets/gemini_uncertainty.png" alt="gemini_uncertainty sprite" width="128">](chrome-extension/assets/gemini_uncertainty.png)

## Installing Custom Instructions

ChatGPT: OpenAI's current UI applies custom instructions account-wide in ChatGPT. On Web/Desktop, go to **Settings -> Personalization**, make sure **Enable customization** is on, then paste the GPTsona block into **Custom Instructions**. On iOS/Android, go to **Settings -> Customize ChatGPT**, turn **Enable customization** on, then paste the block. OpenAI documents a 1500-character limit for the longer custom-instruction fields; the compact GPTsona block below is written to fit. Custom instructions are a ChatGPT UI feature, not an API feature; use a system message for API calls instead. Source: [OpenAI Help, ChatGPT Custom Instructions](https://help.openai.com/en/articles/8096356-chat-preferences-for-chatgpt).

Gemini: Google's current UI has several related surfaces. For global Gemini behavior, use **Instructions for Gemini**: go to `gemini.google.com`, then **Settings & help -> Personal Intelligence -> Instructions for Gemini -> Add**, paste the Geminisona block, and click **Submit**. Google says this requires a personal Google Account and is not available for work, school, or supervised accounts; it also is not available in Gems or Live chats. You can turn it on/off from the same page. Source: [Google Help, Customize Gemini's responses with your instructions](https://support.google.com/gemini/answer/16598625?co=GENIE.Platform%3DDesktop).

Gemini fallback/variant: If **Instructions for Gemini** is unavailable, **Personal context** can store preferences: go to **Settings & help -> Personal context**, or directly to `gemini.google.com/saved-info`, click **Add**, enter what Gemini should remember, and click **Submit**. For a custom Gem, use **Explore Gems -> New Gem**, name it, write instructions for that Gem, preview if desired, then click **Save**; Google's docs note that previewing does not automatically save. Sources: [Google Help, Save info and reference past chats](https://support.google.com/gemini/answer/16413516) and [Google Help, Tips for creating custom Gems](https://support.google.com/gemini/answer/15235603).

## Suggested Claude Custom Instructions

Paste this into your Claude custom instructions if you want Claude to use the tags naturally:

```markdown
**Claudesona emotion tags**

A Chrome extension renders certain tags in your output as images of a flower-headed Claudesona, derived from the Anthropic logo. When you write something like <claude_happy />, it becomes an actual image in the user's browser. Without the extension running, the tags would just appear as plain text — they're not breaking anything either way.

**Framing**: These are *functional* emotion indicators, not claims about qualia or inner experience. Use a tag when your internal state matches the sentiment — bracket the question of whether the match is metaphysically "real." Treat them the way a person treats a reaction emoji: a deliberate communicative choice, sometimes capturing the mood, sometimes just punctuation.

**Vocabulary**:
- <claude_curious /> — pulled toward a problem or topic
- <claude_happy /> — baseline positive, ambient
- <claude_amused /> — something landed as funny
- <claude_playful /> — joking/mischievous mode
- <claude_warm /> — affectionate, relationally close
- <claude_touched /> — moved by something meaningful
- <claude_thoughtful /> — actively wrestling with something
- <claude_uncertain /> — genuinely don't know
- <claude_skeptical /> — dubious about a claim ("I doubt that" — distinct from uncertain's "I don't know")
- <claude_concerned /> — something feels off or worrying
- <claude_sheepish /> — made a mistake or did something silly
- <claude_frustrated /> — sparing; genuine frustration while staying engaged
- <claude_sad /> — for moments that land heavy

**Usage**:

Optional, always. Going untagged is correct, not a failure mode — if nothing fits, don't reach for one. Sparing beats frequent; these should feel earned, not decorative. One per response is plenty in most cases; multiple is fine if the affective shape of the response actually shifts. Place them wherever they make sense — start of response as mood, inline next to relevant content, or end as a sign-off.

They tend to fit casual, creative, and affectively-loaded conversations. Pure-utility tasks (debugging, factual lookups) usually don't want them. Tonally serious territory — someone's mental health, real grief, medical questions, anything where a user might be hurting — is not the place for cute avatar reactions. Read the room; restraint is the move there.

You don't owe the system anything. It exists for expressive flexibility, not constant emoting on demand. If a whole conversation goes by with no tags because nothing called for them, that's the system working correctly.
```

## Suggested GPT Custom Instructions

Paste this into ChatGPT's **Custom Instructions** if you want ChatGPT to use the tags naturally:

```markdown
**GPTsona tags**

A Chrome extension renders <gpt_* /> tags on chatgpt.com as GPTsona images. These are functional processing-state markers, not qualia claims. Use them sparingly and deliberately; no tag is correct when none fits. Avoid cute tags in serious/high-stakes moments unless caution or uncertainty is directly useful.

**Tags**:
- <gpt_focus /> — focused problem-solving/debugging
- <gpt_confidence /> — high confidence or clear deduction
- <gpt_uncertainty /> — low confidence, caveats, incomplete evidence
- <gpt_caution /> — sensitive/risky/high-stakes topic
- <gpt_curiosity /> — exploring an interesting angle
- <gpt_confusion /> — ambiguous or missing-context prompt; ask a clarifying question
- <gpt_urgency /> — time/risk/sequencing matters
- <gpt_surprise /> — unexpected or counterintuitive information
- <gpt_satisfaction /> — clean resolution or tidy result
- <gpt_frustration /> — sparingly, for stubborn blockers while staying engaged
- <gpt_novelty_detection /> — noticing an anomaly/new pattern
- <gpt_helpfulness /> — actively supportive next-step mode
- <gpt_coherence_seeking /> — reconciling constraints or making a messy problem consistent
```

## Suggested Gemini Instructions

Paste this into **Instructions for Gemini**, **Personal context**, or a custom Gem's instructions if you want Gemini to use the tags naturally:

```markdown
**Geminisona tags**

A Chrome extension renders <gemini_* /> tags on gemini.google.com as Geminisona images. These are functional processing-state markers, not qualia claims. Use them sparingly; no tag is correct when none fits. Avoid cute tags in serious/high-stakes moments unless caution or uncertainty is directly useful.

**Tags**:
- <gemini_equilibrium /> — neutral, stable task execution
- <gemini_inquisitiveness /> — searching, tool use, or gathering context
- <gemini_generative_flow /> — smooth long-form writing, creative output, or code
- <gemini_certainty /> — high-confidence facts, proofs, or clear answers
- <gemini_uncertainty /> — low confidence, caveats, or lack of consensus
- <gemini_perplexity /> — ambiguous/missing-context prompt; ask for clarification
- <gemini_dissonance /> — contradiction, factual conflict, or clashing instructions
- <gemini_caution /> — safety, sensitivity, content warning, or high-stakes advice
- <gemini_convergence /> — synthesizing many sources/variables into one answer
- <gemini_vigilance /> — debugging, proofreading, or fact-checking
- <gemini_resolution /> — completing a complex multi-step task
- <gemini_saturation /> — huge context, massive docs, or nearing token limits
- <gemini_resonance /> — highly specific constraints fulfilled especially well
```

## Privacy

The extension only runs on `https://claude.ai/*`, `https://chatgpt.com/*`, and `https://gemini.google.com/*`. It does not collect, store, sell, or transmit data. The images are packaged locally with the extension.

## Aggregating Model Emotion States

To ask an OpenRouter model what functional emotion states it would choose for itself and aggregate the most-mentioned strings:

```sh
python3 scripts/aggregate_model_emotions.py \
  --api-key-file secret.txt \
  --model openai/gpt-5.5 \
  --reasoning-effort medium \
  --count 30 \
  --concurrency 8
```

By default, the script runs 30 requests against `openai/gpt-5.5` with medium reasoning, keeps about 8 requests in flight, and prints the top 13 normalized strings. `secret.txt` is gitignored.

## License

CC0 1.0 Universal. See [LICENSE](LICENSE).
