---
layout: version_2x
title: "Structure: Gauntlet"
---

**Category:** Linear (variant) · **Audience:** Beginner

## What this shows

A single path forward where survival at each step is contingent on the player's
choice or skill. Failure sends the player back to retry rather than to different
content. There is only one success path; the journey to it is nonlinear
(retries, partial progress).

## How it works

- Every trial offers a correct choice (advance) and a fatal one (`Fall`).
- `Fall` always routes back to `Start`, so failure loops you to the beginning
  instead of branching the story.
- A tiny bit of state — `s.attempts` — counts your tries and is shown on `Start`,
  making the retry loop visible. It is initialized once in `UserScript` and
  incremented inside the `Fall` passage with `<% s.attempts++; %>`.
- The feeling is agency (you can fail!), but the *content* is linear: agency
  lives in execution, not in story divergence.

## Using this in your own story

1. Give each step a pass/fail branch where failure returns to a checkpoint.
2. Keep one true success path — the drama is in surviving it.
3. Track attempts (or lives) in `window.story.state` if you want to surface
   progress or escalate difficulty.

## Full source

```twee
:: StoryData
{
	"ifid":"E555EE51-1B18-40FA-9A0E-2E52FE08F12A"
}

:: StoryTitle
Gauntlet Structure

:: UserScript[script]
window.story.state.attempts = window.story.state.attempts || 1;

:: Start
**Attempt #<%= s.attempts %>**

Three trials stand between you and the summit. Fail any one and you begin again.

[[Approach the first trial->Trial One]]

:: Trial One
A narrow ledge above a long drop. One wrong step is fatal.

[[Hug the wall->Trial Two]]
[[Leap across->Fall]]

:: Trial Two
A riddle gate bars the path. "What has roots as nobody sees?"

[[Answer: a mountain->Trial Three]]
[[Answer: a river->Fall]]

:: Trial Three
The final climb. Your grip is everything.

[[Climb steadily->Summit]]
[[Rush the top->Fall]]

:: Fall
You fail — and the mountain sends you back to the bottom.

<% s.attempts++; %>

[[Begin again->Start]]

:: Summit
You clear the last trial and stand atop the peak. There was only ever one way up; the challenge was surviving it.

**The End**

[[Climb again->Start]]
```

[▶ Play this example](snowman_gauntlet.html) · [Download the .twee file](snowman_gauntlet.twee)

---

← Prev: [Linear](../linear/) · [All examples](../) · Next: [Loop and Grow](../loopandgrow/) →
