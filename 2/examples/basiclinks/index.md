---
layout: version_2x
title: "Example: Basic Links & Multiple Endings"
---

**Audience:** Beginner (no HTML/CSS/JS experience needed)

## What this shows

How to link passages together with Twine's double-bracket link syntax, and how
following different choices can lead to different ending passages.

## How it works

- `[[Take the left path->Left Path]]` creates a clickable link. The text
  before `->` is what the player sees; the text after `->` is the name of the
  passage to go to.
- You can also write links as `[[Left Path]]` (passage name is both the link
  text and the destination), or `[[Left Path<-Take the left path]]`.
- Each ending passage (`Good Ending`, `Bad Ending`) links back to `Start`,
  letting the player replay the story.

## Using this in your own story

1. Give each passage a unique name.
2. Use `[[Link text->Passage Name]]` anywhere in a passage's text to send the
   player to another passage when they click it.
3. Branching stories are just passages linking to different passages based on
   the player's choice — no extra JavaScript required for simple branching.

## Full source

```twee
:: StoryData
{
	"ifid":"C860097C-8F04-4476-91CB-6ABBB26A5598"
}

:: StoryTitle
Basic Links in Snowman

:: Start
You stand at a fork in the road.

[[Take the left path->Left Path]]
[[Take the right path->Right Path]]

:: Left Path
You found a treasure chest!

[[Continue->Good Ending]]

:: Right Path
You fall into a pit trap.

[[Continue->Bad Ending]]

:: Good Ending
**The End: Treasure Found**

[[Play again->Start]]

:: Bad Ending
**The End: You Lost**

[[Play again->Start]]
```

[Download the .twee file](snowman_basiclinks.twee)

---

[All examples](../) · Next: [Basic Text Formatting](../textformatting/) →
