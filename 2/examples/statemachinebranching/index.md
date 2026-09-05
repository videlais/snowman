---
layout: version_2x
title: "Example: Finite-State Machine Branching"
---

**Audience:** Advanced (comfortable with JavaScript, arrays/objects, data structures)

## What this shows

Managing branching logic with a lookup table (state machine) instead of long
chains of nested `if`/`else` statements — a pattern that scales much better as
a story's branching logic grows.

## How it works

- `window.setup.moodMachine` is a plain object describing every valid
  transition: for each current state (`calm`, `annoyed`, `angry`, `happy`),
  it lists what state each action (`provoke`, `compliment`) leads to.
- `window.setup.transition(state, action)` looks up the current state in the
  table, then the action within that state, and returns the resulting state
  (or the original state unchanged if that combination isn't defined).
- Passages don't contain any branching logic themselves — they just call
  `window.setup.transition(s.mood, 'provoke')` and store whatever comes back.
  All of the actual rules live in one place (the table), not scattered across
  passages.

## Using this in your own story

1. Model whatever "modes" your story has (an NPC's mood, a time of day, a
   relationship level, a quest stage...) as named states.
2. Write a single lookup table describing every valid transition between
   states.
3. Call a small `transition(state, action)` helper from your passages instead
   of duplicating branching conditionals everywhere.

## Full source

```twee
:: StoryData
{
	"ifid":"2A940332-85B5-4B68-A521-55E933F7A5D3"
}

:: StoryTitle
Finite-State Machine Branching in Snowman

:: UserScript[script]
window.setup = window.setup || {};

// A lookup table describing valid transitions: { currentState: { action: nextState } }
window.setup.moodMachine = {
	calm: { provoke: 'annoyed', compliment: 'happy' },
	annoyed: { provoke: 'angry', compliment: 'calm' },
	angry: { provoke: 'angry', compliment: 'annoyed' },
	happy: { provoke: 'annoyed', compliment: 'happy' }
};

window.setup.transition = function (state, action) {
	var transitions = window.setup.moodMachine[state];
	return (transitions && transitions[action]) || state;
};

:: Start
<% s.mood = s.mood || 'calm'; %>
The NPC's mood is: <%= s.mood %>

[[Provoke them->Provoke]]
[[Compliment them->Compliment]]

:: Provoke
<% s.mood = window.setup.transition(s.mood, 'provoke'); %>
[[Continue->Start]]

:: Compliment
<% s.mood = window.setup.transition(s.mood, 'compliment'); %>
[[Continue->Start]]
```

[Download the .twee file](snowman_statemachinebranching.twee)

---

← Previous: [Working with JSON Data](../workingwithjsondata/) · [All examples](../) · Next: [Custom Events for Notifications](../customevents/) →
