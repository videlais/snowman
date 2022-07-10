# Event Cycle

As passages are loaded, different internal events are triggered.

These can be listened to using jQuery's [on()](https://api.jquery.com/on/) function on the `window` global object.

## Story Start

* `start.sm.story`

## Passage Progression

1. `hide.sm.passage`
2. `show.sm.passage`
3. `added.sm.checkpoint` OR `fail.sm.checkpoint`
4. `shown.sm.passage`
