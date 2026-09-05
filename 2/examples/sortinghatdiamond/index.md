---
layout: version_2x
title: "Structure: Sorting Hat / Diamond"
---

**Category:** Branching (variant) · **Audience:** Intermediate (uses story state)

## What this shows

An early — often single — choice sends the player down one of several distinct
opening paths, which then reconverge into one shared path for the bulk of the
story. Named for the Hogwarts sorting scene: the early choice matters enormously
for flavor, but the "main quest" is the same regardless.

## How it works

- `Start` offers three origins. Each opening passage records the pick with
  `<% s.origin = '...'; %>` and then links to the shared `MainQuest`.
- From `MainQuest` on, the path is identical for everyone — the diamond closes
  back to a single thread.
- The shared middle keeps honoring the earlier choice by referencing it:
  `As a **<%= s.origin %>**, you notice details others miss`. Without callbacks
  like this, a Sorting Hat opening can feel like a bait-and-switch.

## Using this in your own story

1. Multiply only the *opening*, not the whole story — that is what makes this
   cheaper than full branching.
2. Store the choice in `window.story.state`.
3. Reference the stored choice throughout the shared path so it keeps paying off.

## Full source

```twee
:: StoryData
{
	"ifid":"2B264004-D167-481C-8851-C2C5428F69C4"
}

:: StoryTitle
Sorting Hat / Diamond Structure

:: UserScript[script]
window.story.state.origin = window.story.state.origin || '';

:: Start
Before the journey begins, who are you?

[[The Knight->Knight]]
[[The Scholar->Scholar]]
[[The Thief->Thief]]

:: Knight
<% s.origin = 'Knight'; %>
You trained with sword and shield, sworn to the crown.

[[Leave home->MainQuest]]

:: Scholar
<% s.origin = 'Scholar'; %>
You studied forbidden books by candlelight.

[[Leave home->MainQuest]]

:: Thief
<% s.origin = 'Thief'; %>
You learned to move unseen through crowded markets.

[[Leave home->MainQuest]]

:: MainQuest
From here, the road to the capital is the same for everyone.

As a **<%= s.origin %>**, you notice details others miss — but the quest ahead is shared by all three origins.

[[Enter the capital->Ending]]

:: Ending
The main story unfolds identically from this point on. Your early choice colored the opening and flavors the telling, but it did not change the course.

**The End**

[[Choose a new origin->Restart]]

:: Restart
<% s.origin = ''; %>
[[Begin->Start]]
```

[▶ Play this example](snowman_sortinghatdiamond.html) · [Download the .twee file](snowman_sortinghatdiamond.twee)

---

← Prev: [Gate / Quest](../gatequest/) · [All examples](../) · Next: [Hub and Spoke](../hubandspoke/) →
