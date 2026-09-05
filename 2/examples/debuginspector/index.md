---
layout: version_2x
title: "Example: Debug State Inspector Panel"
---

**Audience:** Advanced (comfortable with JavaScript/jQuery)

## What this shows

A small, toggleable panel that displays the entire story state (`window.story.state`)
as formatted JSON, useful while writing and testing a story.

## How it works

- `UserScript` appends a fixed-position panel with a toggle button and a
  `<pre>` element to `<body>`, once, when the story starts (created
  synchronously, not inside `$(function(){})`, for the same timing reason
  described in the "Accessible Passage Announcements" example).
- Clicking the toggle button runs `$('#debug-panel-content').toggleClass('hidden')`,
  where `.hidden { display: none; }` is defined in the stylesheet. Using a CSS
  class (rather than jQuery's `.toggle()`/`.show()`/`.hide()` helpers) keeps
  the visibility state simple and predictable to test.
- On every `sm.passage.shown` event, the panel's content is refreshed with
  `JSON.stringify(window.story.state, null, 2)`, so it always reflects the
  current variables.

## Using this in your own story

1. Add this panel while you're actively writing/debugging a story to see
   exactly what's in `window.story.state` after each passage change.
2. Remove it (or hide it behind a query-string/flag check) before publishing
   the finished story, since it exposes all of your story's variables.

## Full source

```twee
:: StoryData
{
	"ifid":"EF6A2057-4534-4180-9896-D762B8F2F0B8"
}

:: StoryTitle
Debug State Inspector Panel in Snowman

:: UserScript[script]
// The DOM is already ready by the time this script runs, so this can run
// synchronously instead of waiting on $(document).ready() -- otherwise the
// panel wouldn't exist yet when the very first sm.passage.shown fires.
$('<div id="debug-panel"><button id="debug-toggle" type="button">Toggle Debug Panel</button><pre id="debug-panel-content" class="hidden"></pre></div>')
	.appendTo('body');

$(document).on('click', '#debug-toggle', function() {
	$('#debug-panel-content').toggleClass('hidden');
});

$(document).on('sm.passage.shown', function() {
	$('#debug-panel-content').text(JSON.stringify(window.story.state, null, 2));
});

:: UserStylesheet[stylesheet]
#debug-panel {
	position: fixed;
	bottom: 0;
	right: 0;
	background: #222;
	color: #0f0;
	font-family: monospace;
	padding: 0.5em;
	z-index: 9999;
}

#debug-panel-content.hidden {
	display: none;
}

:: Start
<% s.health = 100; s.gold = 20; %>
Health: <%= s.health %>, Gold: <%= s.gold %>

[[Take damage->Damaged]]

:: Damaged
<% s.health -= 10; %>
Health: <%= s.health %>

[[Back->Start]]
```

[Download the .twee file](snowman_debuginspector.twee)

---

← Previous: [Custom CSS Keyframe Animations](../csskeyframeanimations/) · [All examples](../) · Next: [Multiple Save Slots](../multiplesaveslots/) →
