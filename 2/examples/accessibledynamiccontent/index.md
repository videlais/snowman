---
layout: version_2x
title: "Example: Accessible Passage Announcements"
---

**Audience:** Advanced (comfortable with JavaScript/jQuery and basic ARIA concepts)

## What this shows

Two accessibility techniques layered on top of Snowman's built-in support,
so both screen reader users and keyboard users reliably notice passage
changes.

## How it works

- Snowman's `tw-passage` element already has `aria-live="polite"` built in,
  so screen readers automatically announce new passage content as it's
  rendered — no extra work is required for that part.
- This example adds a second, persistent `<div role="status" aria-live="polite">`
  element outside of `tw-passage` (appended straight to `<body>`, not inside
  the passage), so it isn't wiped out every time the passage content is
  replaced. Its text is updated on the `sm.passage.shown` event.
- It also moves keyboard focus into `tw-passage` after every passage change
  (`$('tw-passage').attr('tabindex', '-1').trigger('focus')`), which helps
  sighted keyboard users notice that the page changed, since focus otherwise
  stays wherever it was (often on the link that was just clicked).
- **Important timing note:** the `<div id="status-region">` element is
  created with a plain, synchronous jQuery call — not inside
  `$(function() { ... })`. By the time a `UserScript` passage runs, the
  document is already fully loaded, and wrapping DOM setup in
  `$(function(){})` can defer it by one tick, missing the very first
  `sm.passage.shown` event.

## Using this in your own story

1. Create a persistent, visually-hidden status element once, outside
   `tw-passage`, directly in `UserScript` (not wrapped in `$(function(){})`).
2. Update its text on `sm.passage.shown`.
3. Optionally move focus into the passage on the same event for keyboard
   users.

## Full source

```twee
:: StoryData
{
	"ifid":"C40A70F3-EBA8-41C6-8720-2249C9E232E2"
}

:: StoryTitle
Accessible Passage Announcements in Snowman

:: UserScript[script]
/*
	Snowman's own tw-passage element already has aria-live="polite" built in,
	so screen readers announce new passage content automatically. This example
	adds two more accessibility techniques on top of that:
	1) A persistent, visually-hidden status region (outside tw-passage, so it
	   survives passage changes) that announces which passage is now showing.
	2) Moving keyboard focus into the passage content after each transition,
	   which helps sighted keyboard users know the page changed.
*/
// The DOM is already ready by the time this script runs, so this can run
// synchronously instead of waiting on $(document).ready() -- otherwise the
// element wouldn't exist yet when the very first sm.passage.shown fires.
$('<div role="status" aria-live="polite" id="status-region" class="visually-hidden"></div>')
	.prependTo('body');

$(document).on('sm.passage.shown', function (event, data) {
	$('#status-region').text('Now showing: ' + data.passage.name);
	$('tw-passage').attr('tabindex', '-1').trigger('focus');
});

:: UserStylesheet[stylesheet]
.visually-hidden {
	position: absolute;
	width: 1px;
	height: 1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
}

:: Start
Welcome to the story.

[[Continue->Next]]

:: Next
You arrived at the next passage.

[[Back->Start]]
```

[Download the .twee file](snowman_accessibledynamiccontent.twee)

---

← Previous: [Enhancing Markdown Output](../enhancingmarkdown/) · [All examples](../) · Next: [Two-Column Layout with CSS Grid](../cssgridlayout/) →
