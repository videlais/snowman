---
layout: version_2x
title: "Structure: Hub and Spoke"
---

**Category:** Branching (variant) · **Audience:** Intermediate (uses story state)

## What this shows

A central "hub" from which the player accesses several independent "spokes"
(missions, chapters, characters). After each spoke, the player returns to the hub
before choosing the next. Spokes are order-independent and largely self-contained.

## How it works

- `Hub` is the return point. Each spoke passage sets a flag such as
  `<% s.done.engine = true; %>` and then links back to `Hub`.
- The hub rebuilds its menu on every visit: it offers a link for each unfinished
  spoke and shows completed ones as plain text using
  `<% if (!s.done.engine) { %>...<% } else { %>Engine Room — done<% } %>`.
- A finale link appears only when every spoke is done, tested with
  `<% if (_.size(s.done) >= 3) { %>`.
- This shines for anthology-style content — each spoke can carry its own tone and
  stakes — and for player-controlled pacing. The risk is a hub that feels like a
  menu rather than a place.

## Using this in your own story

1. Make one passage the hub and always return spokes to it.
2. Track completion in `window.story.state` so the hub can update its options.
3. Gate the finale behind having visited enough spokes.

## Full source

```twee
:: StoryData
{
	"ifid":"DEC80C5F-99E7-4AC7-8662-1571183EB84D"
}

:: StoryTitle
Hub and Spoke Structure

:: UserScript[script]
window.story.state.done = window.story.state.done || {};

:: Start
You board the ship as its new commander.

[[Go to the bridge->Hub]]

:: Hub
**The bridge.** Choose where to go next. You return here after each visit, in whatever order you like.

Tasks complete: <%= _.size(s.done) %> / 3

<% if (!s.done.engine) { %>[[Visit the Engine Room->Engine]]<% } else { %>Engine Room — done<% } %>

<% if (!s.done.medbay) { %>[[Visit the Med Bay->MedBay]]<% } else { %>Med Bay — done<% } %>

<% if (!s.done.deck) { %>[[Visit the Gun Deck->Deck]]<% } else { %>Gun Deck — done<% } %>

<% if (_.size(s.done) >= 3) { %>
[[Set course for the finale->Finale]]
<% } %>

:: Engine
<% s.done.engine = true; %>
The engineer needs a coolant line rerouted. You handle it together.

[[Return to the bridge->Hub]]

:: MedBay
<% s.done.medbay = true; %>
The doctor is stumped by a stubborn diagnosis. Your fresh eyes help.

[[Return to the bridge->Hub]]

:: Deck
<% s.done.deck = true; %>
The gunner wants the targeting array recalibrated. Done.

[[Return to the bridge->Hub]]

:: Finale
With the crew's trust earned — in whatever order you chose — the ship is ready for what comes next.

**The End**

[[Play again->Restart]]

:: Restart
<% s.done = {}; %>
[[Board the ship->Hub]]
```

[▶ Play this example](snowman_hubandspoke.html) · [Download the .twee file](snowman_hubandspoke.twee)

---

← Prev: [Sorting Hat / Diamond](../sortinghatdiamond/) · [All examples](../) · Next: [Modular / Threaded](../modularthreaded/) →
