---
layout: version_2x
title: "Structure: Loop and Grow"
---

**Category:** Linear (variant) · **Audience:** Intermediate (uses story state)

## What this shows

The player repeats the same base loop — here, a single morning — but each
iteration adds knowledge that changes what is possible next time. The structure
is technically a loop, yet it is *experienced* as forward progress.

## How it works

- `Reset` increments `s.loop` and sends the player back to `Start`, replaying the
  same dawn.
- Knowledge persists across loops in `s.knows`. Learning about the bridge (from
  the old woman or by watching it fall) sets `s.knows.bridge = true`.
- `Start` checks that flag with `<% if (s.knows.bridge) { %>` and only then offers
  the loop-breaking action, "Warn the merchant."
- Repetition *is* the content, not a grind around it. The craft is making the
  nth loop feel different enough to justify itself — which here means new options
  unlocking as you learn.

## Using this in your own story

1. Route the end of each loop back to the start and bump a loop counter.
2. Store durable knowledge in `window.story.state` so it survives the reset.
3. Gate new choices behind what the player has learned, so later loops open up.

## Full source

```twee
:: StoryData
{
	"ifid":"94A2D645-1745-47B0-AC96-C51EAEE6DA85"
}

:: StoryTitle
Loop and Grow Structure

:: UserScript[script]
window.story.state.loop = window.story.state.loop || 1;
window.story.state.knows = window.story.state.knows || {};

:: Start
**Loop <%= s.loop %>**

The village square at dawn — the same morning, again.

<% if (s.knows.bridge) { %>
You remember what happens at noon. This time you can act on it.

[[Warn the merchant before noon->Merchant]]
<% } %>

[[Ask the old woman about the bridge->OldWoman]]
[[Wait by the bridge until noon->Bridge]]

:: OldWoman
"The bridge?" she says. "It always falls at noon. Always has."

<% s.knows.bridge = true; %>

[[Let the day reset->Reset]]

:: Bridge
At noon the old bridge groans and collapses. You learn its timing the hard way.

<% s.knows.bridge = true; %>

[[Let the day reset->Reset]]

:: Merchant
Because you knew, you warn the merchant in time. Her cart crosses early and safely — something that never happened in any loop before.

[[The loop finally breaks->Ending]]

:: Reset
<% s.loop++; %>

Night falls and you wake to the same dawn — but you carry what you learned into the next loop.

[[Live the day again->Start]]

:: Ending
One piece of knowledge, carried across loops, changed the only thing that mattered. The morning lets you go.

**The End**

[[Loop again->Start]]
```

[▶ Play this example](snowman_loopandgrow.html) · [Download the .twee file](snowman_loopandgrow.twee)

---

← Prev: [Gauntlet](../gauntlet/) · [All examples](../) · Next: [Branching](../branching/) →
