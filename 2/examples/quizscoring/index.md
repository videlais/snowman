---
layout: version_2x
title: "Example: Yes or No Quiz with Scoring"
---

**Audience:** Beginner (no HTML/CSS/JS experience needed)

## What this shows

Combining links, conditionals, and a running variable to build a simple quiz
that tallies a final score.

## How it works

- `window.story.state.correctAnswers = 0;` sets up the running total once, in
  `UserScript`.
- Each question is its own passage with two links, one for each answer
  (`Yes` / `No`). Each answer links to a different passage (e.g.
  `Question1Yes` or `Question1No`).
- The "correct" answer passages increment the counter with
  `<% s.correctAnswers++; %>`; the "incorrect" ones don't.
- The final `Results` passage displays the running total with
  `<%= s.correctAnswers %>`.

## Using this in your own story

1. Give every question its own passage with one link per answer choice.
2. Route each answer to a different destination passage depending on whether
   it's correct.
3. Track anything you need (score, flags, inventory) in `window.story.state`
   and display or branch on it later.

## Full source

```twee
:: StoryData
{
	"ifid":"05BC25BA-547E-456F-9E57-89582F206B94"
}

:: StoryTitle
Yes or No Quiz in Snowman

:: UserScript[script]
window.story.state.correctAnswers = 0;

:: Start
Is the sky blue?

[[Yes->Question1Yes]]
[[No->Question1No]]

:: Question1Yes
<% s.correctAnswers++; %>
Correct!

[[Next question->Question2]]

:: Question1No
That's incorrect.

[[Next question->Question2]]

:: Question2
Is fire cold?

[[Yes->Question2Yes]]
[[No->Question2No]]

:: Question2Yes
That's incorrect.

[[See results->Results]]

:: Question2No
<% s.correctAnswers++; %>
Correct!

[[See results->Results]]

:: Results
You answered <%= s.correctAnswers %> out of 2 questions correctly.

[[Try again->Start]]
```

[Download the .twee file](snowman_quizscoring.twee)

---

← Previous: [Random Flavor Text](../randomtext/) · [All examples](../) · Next: [Restarting the Story](../restartingstory/) →
