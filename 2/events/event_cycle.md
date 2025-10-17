---
layout: version_2x
title: "Snowman 2.X Documentation"
---

## Event Cycle

As passages are loaded, different internal events are triggered.

These can be listened to using jQuery's [on()](https://api.jquery.com/on/) function on the `window` global object.

In 2.X, all events use the namespace "sm" and describe via verb tense the status of the event.

## Story Start

* `sm.story.started`

## Passage Progression

1. `sm.passage.hidden`
2. `sm.passage.showing`
3. `sm.checkpoint.added` OR `sm.checkpoint.failed`
4. `sm.passage.shown`

## Story Error

* `sm.story.error`
