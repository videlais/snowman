---
layout: version_2x
title: "Example: Drag-and-Drop Inventory"
---

**Audience:** Advanced (comfortable with JavaScript/jQuery and the HTML5 Drag and Drop API)

## What this shows

Using the browser's native HTML5 drag-and-drop API to let players drag
inventory items into an equipment slot.

## How it works

- Each item has `draggable="true"`, which tells the browser it can be
  dragged. A `dragstart` handler stores the item's `id` in the drag
  operation's `DataTransfer` object with `e.originalEvent.dataTransfer.setData(...)`.
- The drop target (`#equip-slot`) needs `dragover` to call
  `e.preventDefault()` — without this, the browser won't allow a drop there
  at all. A `.drag-over` class is toggled on `dragover`/`dragleave` purely for
  visual feedback.
- On `drop`, `e.originalEvent.dataTransfer.getData('text/plain')` retrieves
  the dragged item's `id`, which is used to look up its text and update the
  slot's content.

## Using this in your own story

1. Mark draggable elements with `draggable="true"` and store an identifier in
   `dataTransfer` on `dragstart`.
2. Always call `e.preventDefault()` in the `dragover` handler on any valid
   drop target, or the `drop` event will never fire.
3. Read the identifier back out of `dataTransfer` in the `drop` handler and
   update your story state / DOM accordingly.

## Full source

```twee
:: StoryData
{
	"ifid":"723A714A-03AA-4E02-85F7-C3E900384342"
}

:: StoryTitle
Drag-and-Drop Inventory in Snowman

:: UserStylesheet[stylesheet]
.item {
	display: inline-block;
	padding: 0.5em 1em;
	margin: 0.25em;
	background: #ddd;
	cursor: grab;
}

#equip-slot {
	display: inline-block;
	min-width: 150px;
	height: 50px;
	border: 2px dashed #888;
	vertical-align: top;
	padding: 0.5em;
}

#equip-slot.drag-over {
	border-color: #333;
	background: #eef;
}

:: Start
Drag an item into the equipment slot below.

<div class="item" draggable="true" id="item-sword">Sword</div>
<div class="item" draggable="true" id="item-shield">Shield</div>

<div id="equip-slot">Drop an item here</div>

<%
$(function() {
	$('.item').on('dragstart', function(e) {
		e.originalEvent.dataTransfer.setData('text/plain', e.target.id);
	});

	$('#equip-slot')
		.on('dragover', function(e) {
			e.preventDefault();
			$(this).addClass('drag-over');
		})
		.on('dragleave', function() {
			$(this).removeClass('drag-over');
		})
		.on('drop', function(e) {
			e.preventDefault();
			$(this).removeClass('drag-over');
			var id = e.originalEvent.dataTransfer.getData('text/plain');
			var label = document.getElementById(id).textContent;
			$(this).text('Equipped: ' + label);
		});
});
%>
```

[Download the .twee file](snowman_draganddropinventory.twee)

---

← Previous: [Multiple Save Slots](../multiplesaveslots/) · [All examples](../)
