---
layout: version_2x
title: "Example: Initializing Story Variables"
---

**Audience:** Beginner (no HTML/CSS/JS experience needed)

## What this shows

Where to set up the starting values of your story's variables so they're
ready before the player sees the first passage.

## How it works

- A passage named `UserScript` and tagged `script` (written as
  `:: UserScript[script]` in a `.twee` file, or tagged "script" in the Twine
  editor) runs its JavaScript exactly once, when the story loads — before the
  first passage is shown.
- `window.story.state` is the same object as the shorthand `s` you use inside
  `<% %>` template tags in passages, so anything you set on it here (like
  `window.story.state.gold = 10;`) is immediately available as `s.gold`
  everywhere else in the story.

## Using this in your own story

1. Create a passage named `UserScript` and tag it `script`.
2. Set your starting variables there: `window.story.state.someVariable = ...;`
3. Reference them anywhere else with `s.someVariable` inside `<% %>` /
   `<%= %>` tags.

## Full source

```twee
:: StoryData
{
	"ifid":"A610836B-1798-438B-8042-5631E4D323D3"
}

:: StoryTitle
Initializing Story Variables in Snowman

:: UserScript[script]
/*
	Code in a passage tagged "script" only runs once, when the story starts.
	This makes it a good place to set up the starting values of your story variables.
*/
window.story.state.playerName = "Adventurer";
window.story.state.gold = 10;
window.story.state.hasMap = false;

:: Start
Welcome, <%= s.playerName %>! You start with <%= s.gold %> gold.

<% if (s.hasMap) { %>
You already have a map.
<% } else { %>
You do not have a map yet.
<% } %>
```

[Download the .twee file](snowman_initializingvariables.twee)

---

← Previous: [Basic Text Formatting](../textformatting/) · [All examples](../) · Next: [Simple Score Counter](../scorecounter/) →
