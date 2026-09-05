---
layout: version_2x
title: "Example: Custom CSS Keyframe Animations"
---

**Audience:** Advanced (comfortable with CSS)

## What this shows

How to define and trigger a custom `@keyframes` CSS animation, as an
alternative to jQuery's built-in `.fadeIn()` / `.fadeOut()` effects.

## How it works

- `@keyframes shake { ... }` in `UserStylesheet` defines an animation named
  `shake` that nudges an element left and right.
- `.shake { animation: shake 0.4s ease-in-out; }` is a CSS class that, when
  applied to an element, plays that animation once over 0.4 seconds.
- Clicking the link adds the `shake` class to `tw-passage`, then removes it
  again after 400ms with `setTimeout`, so the class is ready to be re-added
  (and replay the animation) the next time it's needed.

## Using this in your own story

1. Define any `@keyframes` animation you like in `UserStylesheet`.
2. Create a CSS class that applies it via the `animation` property.
3. Toggle that class on/off with jQuery (`.addClass()` / `.removeClass()`) in
   response to whatever event should trigger it — a click, a passage change,
   a game event, etc.

## Full source

```twee
:: StoryData
{
	"ifid":"27CEDDC2-49D2-4601-9D8E-5F375F37C08A"
}

:: StoryTitle
Custom CSS Keyframe Animations in Snowman

:: UserStylesheet[stylesheet]
@keyframes shake {
	0%, 100% { transform: translateX(0); }
	25% { transform: translateX(-8px); }
	75% { transform: translateX(8px); }
}

.shake {
	animation: shake 0.4s ease-in-out;
}

:: Start
<a href="javascript:void(0)" id="danger-link">Touch the cursed idol</a>

<%
$(function() {
	$('#danger-link').on('click', function() {
		$('tw-passage').addClass('shake');
		setTimeout(function() {
			$('tw-passage').removeClass('shake');
		}, 400);
	});
});
%>
```

[Download the .twee file](snowman_csskeyframeanimations.twee)

---

← Previous: [Two-Column Layout with CSS Grid](../cssgridlayout/) · [All examples](../) · Next: [Debug State Inspector Panel](../debuginspector/) →
