---
layout: version_2x
title: "Example: Simple Image Gallery"
---

**Audience:** Beginner (no HTML/CSS/JS experience needed)

## What this shows

How to swap an image on the page when the player clicks a link, using plain
`<img>` tags — no drag-and-drop or file uploads involved.

## How it works

- `window.setup.galleryImages` stores two small built-in images as
  ["data URIs"](https://developer.mozilla.org/en-US/docs/Web/URI/Reference/Schemes/data)
  (`red` and `blue`), so the example doesn't depend on any external image
  files.
- The `<img>` tag starts out showing the red image, and also stores which one
  is currently showing in a `data-current="red"` attribute.
- Clicking "Click to swap the image" runs a small jQuery click handler that
  checks `data-current`, decides which image should show next, and updates
  both the `src` attribute (what's displayed) and `data-current` (so the next
  click knows to swap back).

## Using this in your own story

1. Give your `<img>` a unique `id` and a `data-*` attribute to track its
   current state.
2. Use `$('#your-id').on('click', function() { ... })` (or bind the handler
   to a separate link/button) to change its `src` attribute with jQuery.
3. Replace the built-in data-URI images with your own image file paths or
   URLs if you have real image assets.

## Full source

```twee
:: StoryData
{
	"ifid":"EDEDBB61-DA0B-4C03-8B73-B3422C31542C"
}

:: StoryTitle
Simple Image Gallery in Snowman

:: UserScript[script]
window.setup = window.setup || {};
window.setup.galleryImages = {
	red: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect width='60' height='60' fill='red'/%3E%3C/svg%3E",
	blue: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect width='60' height='60' fill='blue'/%3E%3C/svg%3E"
};

:: Start
<img id="gallery-image" src="<%= window.setup.galleryImages.red %>" data-current="red" width="60" height="60">

<p><a href="javascript:void(0)" id="swap-image-link">Click to swap the image</a></p>

<%
$(function() {
	$('#swap-image-link').on('click', function() {
		var img = $('#gallery-image');
		// Read and write the data-current attribute directly so the DOM stays in sync
		// (jQuery's .data() cache does not write back to the data-* attribute).
		var next = img.attr('data-current') === 'red' ? 'blue' : 'red';
		img.attr('src', window.setup.galleryImages[next]).attr('data-current', next);
	});
});
%>
```

[Download the .twee file](snowman_imagegallery.twee)

---

← Previous: [External Links](../externallinks/) · [All examples](../) · Next: [Random Flavor Text](../randomtext/) →
