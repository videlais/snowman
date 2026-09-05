---
layout: version_2x
title: "Example: Restarting the Story"
---

**Audience:** Beginner (no HTML/CSS/JS experience needed)

## What this shows

How to add a "restart" link that clears all story variables and takes the
player back to the very first passage. Snowman has no built-in `restart()`
function, so this shows the two-line pattern that replaces it.

## How it works

- `window.story.state = {};` throws away every variable the story has set so
  far, resetting it to a blank object.
- `window.story.show(window.story.startPassage);` immediately displays the
  very first passage again (`window.story.startPassage` is the ID Snowman
  recorded for whichever passage is marked as the start passage).
- The click handler is bound once, in `UserScript`, using
  `$(document).on('click', '#restart-link', ...)`. Binding it on `document`
  (instead of directly on the link) means it keeps working even though the
  restart link's HTML is re-created every time the `Start` passage is shown.

## Using this in your own story

1. Add a link/button with a unique `id`, e.g.
   `<a href="javascript:void(0)" id="restart-link">Restart</a>`.
2. In `UserScript`, bind a click handler on `document` for that id that resets
   `window.story.state` and calls `window.story.show(window.story.startPassage)`.

## Full source

```twee
:: StoryData
{
	"ifid":"A698AA1C-4344-4C23-9001-E14E4A12742F"
}

:: StoryTitle
Restarting the Story in Snowman

:: UserScript[script]
window.story.state.visits = 0;

// Bound once, on the document, so it keeps working no matter which passage is showing.
$(document).on('click', '#restart-link', function () {
	window.story.state = {};
	window.story.show(window.story.startPassage);
});

:: Start
<% s.visits = (s.visits || 0) + 1; %>

You have visited this passage <%= s.visits %> time(s).

[[Visit again->Start]]

<a href="javascript:void(0)" id="restart-link">Restart the story</a>
```

[Download the .twee file](snowman_restartingstory.twee)

---

← Previous: [Yes or No Quiz with Scoring](../quizscoring/) · [All examples](../) · Next: [Organizing Passages with Tags](../passagetagsorganizing/) →
