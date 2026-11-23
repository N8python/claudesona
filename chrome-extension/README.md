# Sona Emotion Sprites

Unofficial local Chrome extension for `claude.ai`, `chatgpt.com`, and `gemini.google.com`.

When a supported model site renders one of these literal tags in normal page text, the extension replaces it with the matching 128x128 transparent PNG on its own line.

Tags are host-specific:

- `claude.ai` renders only `<claude_* />` tags, where `*` is any emoji or one of the names below.
- `chatgpt.com` renders only `<gpt_* />` tags.
- `gemini.google.com` renders only `<gemini_* />` tags.

Claude emoji tags: `<claude_😁 />`, with any single emoji in the tag.

- 174 emoji (faces, hand gestures, hearts, reaction symbols, cat faces) have a Claudesona in `assets/claudemoji/`; the list is `claudemoji.js`.
- 👀, ✨, 🎉 and 🔥 are routed to 🧐, 🤩, 🥳 and ❤️‍🔥.
- Coloured and variant hearts (🧡 💙 ♥️ 💗 and so on) show the nearest heart Claudesona.
- Any other emoji is shown as the plain emoji: `<claude_🚀 />` becomes 🚀.
- Skin tones and variation selectors are ignored when matching, and a gender suffix falls back to the base emoji.

Claude named tags (the original 13, still supported):

- `<claude_amused />`
- `<claude_concerned />`
- `<claude_curious />`
- `<claude_frustrated />`
- `<claude_happy />`
- `<claude_playful />`
- `<claude_sad />`
- `<claude_sheepish />`
- `<claude_skeptical />`
- `<claude_thoughtful />`
- `<claude_touched />`
- `<claude_uncertain />`
- `<claude_warm />`

GPT tags:

- `<gpt_caution />`
- `<gpt_coherence_seeking />`
- `<gpt_confidence />`
- `<gpt_confusion />`
- `<gpt_curiosity />`
- `<gpt_focus />`
- `<gpt_frustration />`
- `<gpt_helpfulness />`
- `<gpt_novelty_detection />`
- `<gpt_satisfaction />`
- `<gpt_surprise />`
- `<gpt_uncertainty />`
- `<gpt_urgency />`

Gemini tags:

- `<gemini_caution />`
- `<gemini_certainty />`
- `<gemini_convergence />`
- `<gemini_dissonance />`
- `<gemini_equilibrium />`
- `<gemini_generative_flow />`
- `<gemini_inquisitiveness />`
- `<gemini_perplexity />`
- `<gemini_resolution />`
- `<gemini_resonance />`
- `<gemini_saturation />`
- `<gemini_uncertainty />`
- `<gemini_vigilance />`

It skips code blocks, form fields, scripts, styles, and contenteditable regions.
