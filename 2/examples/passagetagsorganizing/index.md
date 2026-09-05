---
layout: version_2x
title: "Example: Organizing Passages with Tags"
---

**Audience:** Beginner (no HTML/CSS/JS experience needed)

## What this shows

What passage tags are for, and how to read them from your own code. (For
using tags to apply CSS styling automatically, see the `passagetags` example
in the main cookbook instead.)

## How it works

- In a `.twee` file, `:: Start [important journal]` gives the `Start` passage
  two tags: `important` and `journal`. In the Twine editor, you'd add these
  tags through the passage's tag menu instead.
- Tags are primarily an authoring/organizing tool inside the Twine editor —
  they let you filter the passage list, color-code passages, or group related
  passages together. Snowman itself doesn't do anything with tags unless your
  own code reads them.
- `window.story.passage("Start").tags` returns the array of tags for the
  passage named `"Start"` (here, `["important", "journal"]`), which you can
  display, check with `.includes(...)`, or use however you like.

## Using this in your own story

1. Add tags to passages for your own organizational purposes (e.g.
   `[act1]`, `[needs-review]`, `[combat]`).
2. If you want code to behave differently based on a tag, read it with
   `window.story.passage("Passage Name").tags`.

## Full source

```twee
:: StoryData
{
	"ifid":"5E3CD126-999E-4CDE-944D-8C222FAFBFAD"
}

:: StoryTitle
Organizing Passages with Tags in Snowman

:: Start [important journal]
This passage is tagged "important" and "journal" purely for organizational purposes. Twine's editor lets authors filter, color-code, or group passages by tag. Snowman itself does nothing with tags unless your own code reads them, as shown below.

This passage's tags are: <%= window.story.passage("Start").tags.join(', ') %>

[[See another tagged passage->Side Note]]

:: Side Note [aside]
This passage is tagged "aside". Its tags are: <%= window.story.passage("Side Note").tags.join(', ') %>

[[Back to start->Start]]
```

[Download the .twee file](snowman_passagetagsorganizing.twee)

---

← Previous: [Restarting the Story](../restartingstory/) · [All examples](../) · Next: [Working with JSON Data](../workingwithjsondata/) →
