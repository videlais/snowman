---
layout: version_2x
title: "Structure: Linear"
---

**Category:** Linear · **Audience:** Beginner (no HTML/CSS/JS experience needed)

## What this shows

The baseline every other structure departs from: every player experiences the
same sequence of events in the same order. The only "choice" is pacing — when to
proceed — not content.

## How it works

- Each passage ends with a single `[[Continue->Next]]` link, so there is exactly
  one path from `Start` to the ending.
- There are no conditionals and no state. Linearity is simply a chain of
  passages with one exit each.
- This is not a failure state: linear structure protects pacing and authored
  dramatic shape completely. It is the right choice when meaning depends on exact
  sequencing.

## Using this in your own story

1. Give each beat its own passage.
2. Link each passage to exactly one next passage.
3. Reach for a linear spine whenever the order of events *is* the point.

## Full source

```twee
:: StoryData
{
	"ifid":"9B031864-42CC-4023-84F1-CFA1BD81EADF"
}

:: StoryTitle
Linear Structure

:: Start
The train pulls out of the station. There is one track, and one way this journey ends.

[[Continue->Morning]]

:: Morning
Fields blur past the window. You read, you doze, you wait.

[[Continue->Afternoon]]

:: Afternoon
The conductor calls the next stop. Yours.

[[Continue->Arrival]]

:: Arrival
You step onto the platform. The journey was always going to bring you here — and that is the point.

**The End**

[[Ride again->Start]]
```

[▶ Play this example](snowman_linear.html) · [Download the .twee file](snowman_linear.twee)

---

[All examples](../) · Next: [Gauntlet](../gauntlet/) →
