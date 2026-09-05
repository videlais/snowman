---
layout: version_2x
title: "Examples"
---

These examples are small, self-contained Snowman stories that each demonstrate
one idea. Every example includes a full `.twee` source file you can download
and open directly in Twine, plus a short guide explaining how it works and how
to adapt it for your own story.

## Beginner examples

No prior HTML, CSS, or JavaScript experience is assumed.

1. [Basic Links & Multiple Endings](basiclinks/) — connecting passages with `[[ ]]` links and branching to different endings.
2. [Basic Text Formatting](textformatting/) — Markdown shorthand vs. raw HTML tags.
3. [Initializing Story Variables](initializingvariables/) — setting up starting variables in `UserScript`.
4. [Simple Score Counter](scorecounter/) — tracking and displaying a running number in story state.
5. [External Links](externallinks/) — linking safely to outside websites.
6. [Simple Image Gallery](imagegallery/) — swapping an image on click with jQuery.
7. [Random Flavor Text](randomtext/) — picking random text with Underscore's `_.sample()`.
8. [Yes or No Quiz with Scoring](quizscoring/) — combining links, conditionals, and a score variable.
9. [Restarting the Story](restartingstory/) — clearing state and returning to the start passage.
10. [Organizing Passages with Tags](passagetagsorganizing/) — reading a passage's own tags in code.

## Advanced examples

Comfort with JavaScript, CSS, and jQuery is assumed.

11. [Working with JSON Data](workingwithjsondata/) — parsing and looping over structured JSON data.
12. [Finite-State Machine Branching](statemachinebranching/) — managing branching logic with a lookup table.
13. [Custom Events for Notifications](customevents/) — firing and listening for your own custom events.
14. [Enhancing Markdown Output](enhancingmarkdown/) — post-processing rendered Markdown after a passage is shown.
15. [Accessible Passage Announcements](accessibledynamiccontent/) — ARIA live regions and keyboard focus management.
16. [Two-Column Layout with CSS Grid](cssgridlayout/) — a persistent sidebar laid out with CSS Grid.
17. [Custom CSS Keyframe Animations](csskeyframeanimations/) — defining and triggering a `@keyframes` animation.
18. [Debug State Inspector Panel](debuginspector/) — a toggleable panel showing live story state as JSON.
19. [Multiple Save Slots](multiplesaveslots/) — supporting several independent `localStorage` save slots.
20. [Drag-and-Drop Inventory](draganddropinventory/) — the native HTML5 drag-and-drop API.

## Narrative Structures

These examples each demonstrate one classic narrative structure — the shapes a
branching story can take. Every example ships a full `.twee` source plus a
pre-compiled, playable HTML file (built with [Extwee](https://videlais.github.io/extwee/)
and the Snowman 2.X story format).

### Linear

The baseline every other structure departs from, plus two variants where
repetition, not divergence, carries the experience.

21. [Linear](linear/) — one track, one order; the only choice is pacing.
22. [Gauntlet](gauntlet/) — a single success path where failure sends you back to retry.
23. [Loop and Grow](loopandgrow/) — the same loop repeats, but accumulated knowledge unlocks new options.

### Branching

Choices that lead to different content — from pure divergence to the foldback and
gating patterns that make branching affordable.

24. [Branching](branching/) — a pure "Time Cave" tree that splits and never rejoins.
25. [Branch and Bottleneck](branchandbottleneck/) — branches re-converge at authored checkpoint beats, then branch again.
26. [Gate / Quest](gatequest/) — branches converge on a systemic condition (a count or flag), not a scene.
27. [Sorting Hat / Diamond](sortinghatdiamond/) — distinct openings reconverge into one shared main path.
28. [Hub and Spoke](hubandspoke/) — a central hub with order-independent, self-contained spokes.

### Self-contained

Structures with little or no forced sequence, where the player assembles meaning
or the story emerges from rules.

29. [Modular / Threaded](modularthreaded/) — self-contained modules read in any order; the player assembles the story.
30. [Systemic / Emergent](systemicemergent/) — no authored plot graph; the story emerges from interacting systems.
