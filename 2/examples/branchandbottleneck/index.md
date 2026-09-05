---
layout: version_2x
title: "Structure: Branch and Bottleneck"
---

**Category:** Branching (variant) · **Audience:** Beginner

## What this shows

The workhorse structure of commercial narrative games, also called *Foldback*.
The story branches locally, then re-converges at authored checkpoint beats — the
"bottlenecks" (or "pearls" on a string) — then branches again.

## How it works

- Two entrances (`LockRoute`, `BribeRoute`) both link to the same `Vault`
  passage: the first bottleneck.
- From the vault, two methods (`DrillRoute`, `CodeRoute`) both converge on
  `Escape`: the second bottleneck.
- No state is required — convergence is simply multiple passages pointing at one
  shared next passage.
- Players feel choice moment-to-moment while the author guarantees the
  load-bearing beats occur. The craft is hiding the re-convergence, and being
  honest about which edges are true divergence versus foldback.

## Using this in your own story

1. Let choices branch locally for texture.
2. Point those branches back at a shared "pearl" passage for each guaranteed
   beat.
3. Repeat: branch, bottleneck, branch, bottleneck.

## Full source

```twee
:: StoryData
{
	"ifid":"23E75994-D259-44AF-AF5F-E35D1A1CC310"
}

:: StoryTitle
Branch and Bottleneck Structure

:: Start
The heist begins. How do you get inside?

[[Pick the side-door lock->LockRoute]]
[[Bribe the front guard->BribeRoute]]

:: LockRoute
You slip in silently through the side door.

[[Continue->Vault]]

:: BribeRoute
A few coins later, the guard waves you through the front.

[[Continue->Vault]]

:: Vault
**Bottleneck.** However you got in, you now stand before the vault. The story guarantees this beat happens for every player.

How do you crack it?

[[Drill the lock->DrillRoute]]
[[Guess the code->CodeRoute]]

:: DrillRoute
Sparks fly, the bit screams — and the vault swings open.

[[Continue->Escape]]

:: CodeRoute
The code was the founder's birthday. Of course it was.

[[Continue->Escape]]

:: Escape
**Bottleneck.** The vault is open and the alarm is ringing. Every path converges here for the finale.

**The End: The score is yours**

[[Run it again->Start]]
```

[▶ Play this example](snowman_branchandbottleneck.html) · [Download the .twee file](snowman_branchandbottleneck.twee)

---

← Prev: [Branching](../branching/) · [All examples](../) · Next: [Gate / Quest](../gatequest/) →
