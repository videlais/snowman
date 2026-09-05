---
layout: version_2x
title: "Structure: Gate / Quest"
---

**Category:** Branching (variant) · **Audience:** Intermediate (uses story state)

## What this shows

A specialization of Branch and Bottleneck common to RPGs: branches converge not
at a story *beat* but at a *gate* — a checkpoint the player must clear (an item,
a stat threshold, a completed sub-quest) regardless of the route taken to it.

## How it works

- Three locations can be searched in any order. Each pushes a distinct key into
  the `s.keys` array (guarded so re-visiting doesn't duplicate it).
- The gate is a **systemic** condition, not a scene: `Start` shows the
  "Open the gate" link only when `<% if (s.keys.length >= 2) { %>`.
- Because the convergence tests a *count* rather than a specific authored path,
  the player has freedom over order and completeness of optional content while
  the author still gets a known world-state at the gate.

This differs from a plain bottleneck: a bottleneck converges at a single authored
scene, whereas a gate converges on a flag or count.

## Using this in your own story

1. Let the player collect progress (items, flags, a counter) in any order.
2. Gate the next beat behind a condition on `window.story.state`, not behind one
   specific passage.
3. Show the requirement so the player understands what the gate wants.

## Full source

```twee
:: StoryData
{
	"ifid":"45830947-8992-4F18-9F1F-92A1848C94DB"
}

:: StoryTitle
Gate / Quest Structure

:: UserScript[script]
window.story.state.keys = window.story.state.keys || [];

:: Start
A sealed gate blocks the road. It needs **two keys** to open — and you may find them in any order.

Keys found: <%= s.keys.length %> / 2

<% if (s.keys.length >= 2) { %>
[[Open the gate->Gate]]
<% } %>

[[Search the forest->Forest]]
[[Search the ruins->Ruins]]
[[Search the shore->Shore]]

:: Forest
<% if (!_.contains(s.keys, 'iron')) { s.keys.push('iron'); } %>
Among the tree roots you dig out the **iron key**.

[[Return to the gate->Start]]

:: Ruins
<% if (!_.contains(s.keys, 'bone')) { s.keys.push('bone'); } %>
In the rubble you uncover the **bone key**.

[[Return to the gate->Start]]

:: Shore
<% if (!_.contains(s.keys, 'glass')) { s.keys.push('glass'); } %>
Half-buried in the sand lies the **glass key**.

[[Return to the gate->Start]]

:: Gate
Two keys turn in the ancient locks and the gate grinds open. It never mattered *which* two you brought — only that the count was met.

**The End**

[[Play again->Restart]]

:: Restart
<% s.keys = []; %>
[[Begin again->Start]]
```

[▶ Play this example](snowman_gatequest.html) · [Download the .twee file](snowman_gatequest.twee)

---

← Prev: [Branch and Bottleneck](../branchandbottleneck/) · [All examples](../) · Next: [Sorting Hat / Diamond](../sortinghatdiamond/) →
