---
layout: version_2x
title: "Structure: Modular / Threaded"
---

**Category:** Self-contained · **Audience:** Intermediate (uses story state)

## What this shows

Story delivered as discrete, mostly self-contained modules (vignettes, case
files, logs) that the player can encounter in almost any order. There is little
or no forced sequence; meaning is assembled by the player from the collection
rather than handed to them in a fixed order.

## How it works

- Four evidence passages can be read in any order. Each marks itself read with a
  flag like `<% s.read.letter = true; %>` and returns to `Start`.
- Each module stands alone — no module assumes you have seen another, so they
  "degrade gracefully" out of order.
- The solution unlocks only once every module has been seen, tested with
  `<% if (_.size(s.read) >= 4) { %>`. The player assembles the meaning; the story
  never dictates the sequence.

This resembles Gate / Quest mechanically, but the intent differs: here the
modules are the *narrative*, and reading order is the player's authorship.

## Using this in your own story

1. Write each module so it makes sense on its own.
2. Track which modules have been seen in `window.story.state`.
3. If you need a payoff, gate it behind having encountered enough modules — but
   let the order stay free.

## Full source

```twee
:: StoryData
{
	"ifid":"7F4845FA-ECFC-4D3C-A9D2-5931850E5033"
}

:: StoryTitle
Modular / Threaded Structure

:: UserScript[script]
window.story.state.read = window.story.state.read || {};

:: Start
**The Cold Case.** Four pieces of evidence sit on the desk. Read them in any order — the story is yours to assemble.

Evidence examined: <%= _.size(s.read) %> / 4

[[The half-burned letter->Letter]]
[[The bank ledger->Ledger]]
[[The witness statement->Witness]]
[[The photograph->Photo]]

<% if (_.size(s.read) >= 4) { %>
[[Name the culprit->Solve]]
<% } %>

:: Letter
<% s.read.letter = true; %>
A letter, half-burned: *"Meet me at the pier at midnight. Bring the money."*

[[Back to the desk->Start]]

:: Ledger
<% s.read.ledger = true; %>
The ledger shows a large, secret withdrawal on the night of the crime.

[[Back to the desk->Start]]

:: Witness
<% s.read.witness = true; %>
A witness recalls a tall figure limping away from the pier, leaning on a cane.

[[Back to the desk->Start]]

:: Photo
<% s.read.photo = true; %>
A photograph from the gala: the banker — tall, and carrying a silver-topped cane.

[[Back to the desk->Start]]

:: Solve
No single file told the story. Read together — in any order — they point to the banker. You assembled the meaning yourself.

**The End**

[[Open a new case->Restart]]

:: Restart
<% s.read = {}; %>
[[Open the case file->Start]]
```

[▶ Play this example](snowman_modularthreaded.html) · [Download the .twee file](snowman_modularthreaded.twee)

---

← Prev: [Hub and Spoke](../hubandspoke/) · [All examples](../) · Next: [Systemic / Emergent](../systemicemergent/) →
