---
layout: version_2x
title: "Example: Simple Score Counter"
---

**Audience:** Beginner (no HTML/CSS/JS experience needed)

## What this shows

How to keep a single running number (like a score) in your story's state and
update it as the player makes choices.

## How it works

- `window.story.state.score = 0;` in the `UserScript` passage sets the
  starting score to `0` once, when the story begins.
- `<%= s.score %>` displays the current value anywhere in a passage.
- `<% s.score++; %>` increases the value by 1 each time the `Earn` passage is
  shown. Because `s` (short for `window.story.state`) is shared across the
  whole story, the updated score is remembered when the player navigates to
  other passages.

## Using this in your own story

1. Initialize any counter in `UserScript`: `window.story.state.myCounter = 0;`
2. Change it inside a passage with plain JavaScript: `<% s.myCounter += 1; %>`
3. Display it anywhere with `<%= s.myCounter %>`.

## Full source

```twee
:: StoryData
{
	"ifid":"3566FCD7-4DB8-41E1-AE00-3BF56517B813"
}

:: StoryTitle
Simple Score Counter in Snowman

:: UserScript[script]
window.story.state.score = 0;

:: Start
Your score: <%= s.score %>

[[Earn a point->Earn]]

:: Earn
<% s.score++; %>
Your score is now <%= s.score %>.

[[Earn another point->Earn]]
[[Back to start->Start]]
```

[Download the .twee file](snowman_scorecounter.twee)

---

← Previous: [Initializing Story Variables](../initializingvariables/) · [All examples](../) · Next: [External Links](../externallinks/) →
