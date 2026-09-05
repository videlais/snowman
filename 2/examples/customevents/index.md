---
layout: version_2x
title: "Example: Custom Events for Notifications"
---

**Audience:** Advanced (comfortable with JavaScript/jQuery)

## What this shows

How to create your own custom events (separate from Snowman's built-in
`sm.*` events) to decouple "something happened" from "how the story reacts to
it" — here, showing an achievement toast notification.

## How it works

- `$(document).on('game.achievement', function(event, data) { ... })`,
  registered once in `UserScript`, listens for a custom event named
  `game.achievement` anywhere in the page.
- Any passage can fire that event with
  `$(document).trigger('game.achievement', { title: 'Sword Collector' });` —
  the object passed to `.trigger()` becomes the `data` argument in the
  listener.
- The listener builds a toast `<div>`, appends it to `<body>`, waits briefly
  with `.delay()`, then fades it out and removes it with `.fadeOut()`.

## Using this in your own story

1. Pick a namespaced event name for each kind of notification, e.g.
   `game.achievement`, `game.levelUp`, `game.lowHealth`.
2. Register one listener per event name in `UserScript` that knows how to
   display it.
3. Trigger the event from any passage where the achievement/event actually
   happens, passing whatever data the listener needs.

## Full source

```twee
:: StoryData
{
	"ifid":"8DE1B491-0BF8-49DF-94FA-85244B272BEB"
}

:: StoryTitle
Custom Events for Notifications in Snowman

:: UserScript[script]
/*
	Listen for a custom "game.achievement" event anywhere in the document and
	show a short-lived toast message in response. Any passage can trigger this
	event with $(document).trigger('game.achievement', { title: '...' }).
*/
$(document).on('game.achievement', function (event, data) {
	$('<div class="achievement-toast"></div>')
		.text('Achievement unlocked: ' + data.title)
		.appendTo('body')
		.delay(300)
		.fadeOut(200, function () {
			$(this).remove();
		});
});

:: UserStylesheet[stylesheet]
.achievement-toast {
	position: fixed;
	top: 1em;
	right: 1em;
	background: #222;
	color: #fff;
	padding: 0.75em 1em;
	border-radius: 4px;
	font-family: sans-serif;
}

:: Start
<a href="javascript:void(0)" id="unlock-btn">Pick up the ancient sword</a>

<%
$(function() {
	$('#unlock-btn').on('click', function() {
		$(document).trigger('game.achievement', { title: 'Sword Collector' });
	});
});
%>
```

[Download the .twee file](snowman_customevents.twee)

---

← Previous: [Finite-State Machine Branching](../statemachinebranching/) · [All examples](../) · Next: [Enhancing Markdown Output](../enhancingmarkdown/) →
