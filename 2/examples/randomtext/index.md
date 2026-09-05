---
layout: version_2x
title: "Example: Random Flavor Text"
---

**Audience:** Beginner (no HTML/CSS/JS experience needed)

## What this shows

How to pick a random line of text from a list each time a passage is shown,
using the Underscore.js library that Snowman already includes.

## How it works

- `window.setup` is just a plain object used to store your own custom data
  and helper values so they don't clash with anything else. It's a common,
  informal convention in Twine/Snowman stories, not a special Snowman API.
- `window.setup.flavorTexts` is an array (list) of strings.
- `_.sample(array)` — from the Underscore.js library that's built into
  Snowman — returns one random item from that array. It's available as `_`
  anywhere inside `<% %>` / `<%= %>` template tags.
- Because `<%= _.sample(...) %>` runs every time the `Start` passage is shown,
  clicking "Listen again" (which just links back to `Start`) re-rolls the
  random text.

## Using this in your own story

1. Make a list of possible strings: `window.setup.myLines = ["A", "B", "C"];`
2. Show a random one with `<%= _.sample(window.setup.myLines) %>`.
3. Combine with `_.random(min, max)` if you want random numbers instead (see
   the `dicerolling` example in the main cookbook).

## Full source

```twee
:: StoryData
{
	"ifid":"66B5222B-5ED9-4148-8672-E793A6F90A61"
}

:: StoryTitle
Random Flavor Text in Snowman

:: UserScript[script]
window.setup = window.setup || {};
window.setup.flavorTexts = [
	"The wind howls through the trees.",
	"A distant bell tolls somewhere in the village.",
	"You hear footsteps behind you, but no one is there."
];

:: Start
<%= _.sample(window.setup.flavorTexts) %>

[[Listen again->Start]]
```

[Download the .twee file](snowman_randomtext.twee)

---

← Previous: [Simple Image Gallery](../imagegallery/) · [All examples](../) · Next: [Yes or No Quiz with Scoring](../quizscoring/) →
