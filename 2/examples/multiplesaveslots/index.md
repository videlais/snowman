---
layout: version_2x
title: "Example: Multiple Save Slots"
---

**Audience:** Advanced (comfortable with JavaScript and `localStorage`)

## What this shows

A pattern for supporting several independent, named save slots with
`localStorage`, rather than just a single save.

## How it works

- `window.saveSlots.save(slot)` serializes the entire story state with
  `JSON.stringify(window.story.state)` and stores it under a slot-specific
  key, e.g. `snowman-demo-slot-1`.
- `window.saveSlots.load(slot)` reads that key back, parses it with
  `JSON.parse()`, and replaces `window.story.state` with the restored data,
  then re-shows the start passage so the story reflects the loaded state.
- Because each slot uses its own `localStorage` key
  (`'snowman-demo-slot-' + slot`), slots don't overwrite each other — you can
  keep several independent save points.

## Using this in your own story

1. Add a "Save" and "Load" link/button per slot, each passing its own slot
   number/name to `window.saveSlots.save()` / `.load()`.
2. Consider also storing a timestamp or short description alongside the save
   data so players can tell slots apart (e.g. save an object like
   `{ savedAt: Date.now(), state: window.story.state }` instead of the raw
   state).

## Full source

```twee
:: StoryData
{
	"ifid":"DA2AD291-48C8-4B4C-B0E8-DB11BF51698C"
}

:: StoryTitle
Multiple Save Slots in Snowman

:: UserScript[script]
window.saveSlots = {
	save: function (slot) {
		window.localStorage.setItem('snowman-demo-slot-' + slot, JSON.stringify(window.story.state));
	},
	load: function (slot) {
		var raw = window.localStorage.getItem('snowman-demo-slot-' + slot);
		if (raw === null) {
			return false;
		}
		window.story.state = JSON.parse(raw);
		return true;
	}
};

:: Start
<% s.progress = s.progress || 0; %>
Progress: <%= s.progress %>

[[Increase progress->Increase]]

<p>Save your progress:
<a href="javascript:void(0)" id="save-slot-1">Save to Slot 1</a> |
<a href="javascript:void(0)" id="save-slot-2">Save to Slot 2</a></p>

<p>Load a save:
<a href="javascript:void(0)" id="load-slot-1">Load Slot 1</a> |
<a href="javascript:void(0)" id="load-slot-2">Load Slot 2</a></p>

<%
$(function() {
	$('#save-slot-1').on('click', function() { window.saveSlots.save(1); });
	$('#save-slot-2').on('click', function() { window.saveSlots.save(2); });
	$('#load-slot-1').on('click', function() {
		if (window.saveSlots.load(1)) {
			window.story.show(window.story.startPassage);
		}
	});
	$('#load-slot-2').on('click', function() {
		if (window.saveSlots.load(2)) {
			window.story.show(window.story.startPassage);
		}
	});
});
%>

:: Increase
<% s.progress = (s.progress || 0) + 1; %>
[[Back to start->Start]]
```

[Download the .twee file](snowman_multiplesaveslots.twee)

---

← Previous: [Debug State Inspector Panel](../debuginspector/) · [All examples](../) · Next: [Drag-and-Drop Inventory](../draganddropinventory/) →
