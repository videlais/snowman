# Passage Events

Passage events are triggered in the order of `hidden`, `showing`, and `shown`.

* `sm.passage.hidden` is triggered whenever a passage is about to be replaced on screen with another. The passage property of the event object contains the passage being replaced.

* `sm.passage.showing` is triggered when a passage is about to be shown on screen. The passage property of the event object contains the passage about to be shown.

* `sm.passage.shown` is triggered when a passage has been shown on screen and is now being displayed. The passage property of the event object contains the passage being shown.

## Example

To display on the console the name of passages are events are triggered, the `on()` function can be used on the global `window` object to listen for the event and the event object passed by the triggering function. The passage property of the event object will be the passage (hidden, showing, or shown).

```javascript
$(window).on('sm.passage.hidden', function(event, eventObject) {
    // No passage to hide when story starts
    if(eventObject.passage) {
        console.log(eventObject.passage.name);
    }
});

$(window).on('sm.passage.showing', function(event, eventObject) {
    // Current Passage object
    console.log(eventObject.passage.name);
});

$(window).on('sm.passage.shown', function(event, eventObject) {
    // Shown Passage object
    console.log(eventObject.passage.name);
});
```
