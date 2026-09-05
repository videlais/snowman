---
layout: version_2x
title: "Structure: Systemic / Emergent"
---

**Category:** Self-contained · **Audience:** Advanced (state + rules)

## What this shows

There is no authored plot graph at all; story emerges from interacting systems
and the player's actions. The author designs rules and a possibility space, not
scenes.

## How it works

- Three resources live in state — `s.day`, `s.food`, `s.warmth` — initialized
  once in `UserScript`.
- Each action passage applies a *rule* rather than telling a scripted beat:
  hunting is `<% s.food += 2; s.warmth -= 1; s.day += 1; %>`, and so on. Then it
  returns to `Start`.
- `Start` is a systems dashboard: it reads the current numbers and decides the
  outcome purely from them — you lose if any resource hits zero, you win if you
  survive past day five, otherwise it offers the actions again.
- The result is near-infinite, player-specific play, at the cost of authored
  dramatic shape. No two runs are guaranteed to look alike.

## Using this in your own story

1. Model your world as a few numbers in `window.story.state`.
2. Make each action a small, honest rule that changes those numbers.
3. Let one "dashboard" passage read the state and derive outcomes — instead of
   authoring branches, author the rules and let the story fall out of them.

## Full source

```twee
:: StoryData
{
	"ifid":"717DE0F1-8336-461F-8E14-4359987F8554"
}

:: StoryTitle
Systemic / Emergent Structure

:: UserScript[script]
var st = window.story.state;
if (st.day === undefined) {
	st.day = 1;
	st.food = 3;
	st.warmth = 3;
}

:: Start
**Day <%= s.day %>** — Food: <%= s.food %> · Warmth: <%= s.warmth %>

<% if (s.food <= 0 || s.warmth <= 0) { %>
Your supplies run out and the wilderness wins. You did not survive.

[[Try again->Restart]]
<% } else if (s.day > 5) { %>
Five days survived — a search plane spots your fire. Rescue arrives.

**The End**

[[Play again->Restart]]
<% } else { %>
No script decides what happens next. Interacting systems — and your choices — do.

Hunt (food +2, warmth −1), gather firewood (warmth +2, food −1), or rest to recover (but food −1 and warmth −1). Every action costs a day.

[[Hunt->Hunt]]
[[Gather firewood->Firewood]]
[[Rest->Rest]]
<% } %>

:: Hunt
<% s.food += 2; s.warmth -= 1; s.day += 1; %>
[[See what the day brings->Start]]

:: Firewood
<% s.warmth += 2; s.food -= 1; s.day += 1; %>
[[See what the day brings->Start]]

:: Rest
<% s.day += 1; s.food -= 1; s.warmth -= 1; %>
[[See what the day brings->Start]]

:: Restart
<% s.day = 1; s.food = 3; s.warmth = 3; %>
[[Begin again->Start]]
```

[▶ Play this example](snowman_systemicemergent.html) · [Download the .twee file](snowman_systemicemergent.twee)

---

← Prev: [Modular / Threaded](../modularthreaded/) · [All examples](../)
