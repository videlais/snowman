---
layout: version_2x
title: "Structure: Branching"
---

**Category:** Branching · **Audience:** Beginner

## What this shows

The player chooses; each choice leads to different content; branches diverge and
never rejoin. Ashwell calls this the "Time Cave" — a cave system that only ever
splits, never reconnects.

## How it works

- Every passage links only to *new* passages; nothing ever links back to a shared
  node (except an optional "start over").
- Two binary choices produce four distinct endings. Each leaf is reachable by
  exactly one path.
- This is the most honest agency and also the most expensive: ten binary choices
  in a row imply 1,024 leaf states. Pure trees are rare beyond short-form work
  for exactly this reason.

## Using this in your own story

1. Make each choice lead somewhere genuinely different.
2. Never fold paths back together — that would make it a bottleneck, not a
   branch.
3. Watch the exponential cost: keep pure branches short, or reserve them for the
   ending act.

## Full source

```twee
:: StoryData
{
	"ifid":"CCCA09D6-1494-41E3-A331-5A876B46C859"
}

:: StoryTitle
Branching Structure

:: Start
The cave mouth splits in two. Whatever you choose, there is no coming back to this spot.

[[Take the left tunnel->Left]]
[[Take the right tunnel->Right]]

:: Left
Water drips in the dark. The passage forks again.

[[Wade into the stream->LeftStream]]
[[Climb the wet rocks->LeftRocks]]

:: Right
Warm air rises from below. The passage forks again.

[[Follow the distant light->RightLight]]
[[Follow the low sound->RightSound]]

:: LeftStream
The current carries you into a flooded hall with no exit.

**Ending: The Drowned Hall**

[[Start over->Start]]

:: LeftRocks
You haul yourself up into a cavern of glittering crystal.

**Ending: The Crystal Vault**

[[Start over->Start]]

:: RightLight
The light is daylight — a hidden door in the cliffside.

**Ending: The Cliffside Door**

[[Start over->Start]]

:: RightSound
The sound is breathing. You have found a sleeping dragon. Unwisely.

**Ending: The Dragon's Den**

[[Start over->Start]]
```

[▶ Play this example](snowman_branching.html) · [Download the .twee file](snowman_branching.twee)

---

← Prev: [Loop and Grow](../loopandgrow/) · [All examples](../) · Next: [Branch and Bottleneck](../branchandbottleneck/) →
