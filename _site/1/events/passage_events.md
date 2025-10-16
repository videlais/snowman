# Passage Events

Passage events are triggered in the order of `hide`, `show`, and `shown`.

* `hide.sm.passage` is triggered whenever a passage is about to be replaced on screen with another. The passage property of the event object contains the passage being replaced.

* `show.sm.passage` is triggered when a passage is about to be shown on screen. The passage property of the event object contains the passage about to be shown.

* `shown.sm.passage` is triggered when a passage has been shown on screen and is now being displayed. The passage property of the event object contains the passage being shown.

## Example

To display on the console the name of passages are events are triggered, the `on()` function can be used on the global `window` object to listen for the event and the event object passed by the triggering function. The passage property of the event object will be the passage (about to be replaced, about to be shown, or currently shown).

```javascript
$(window).on('hide.sm.passage', function(event, eventObject) {
    // HTML Element on Start
    // Passage object otherwise
    if( !(eventObject.passage instanceof Element) ) {
        console.log(eventObject.passage.name);
    }
});

$(window).on('show.sm.passage', function(event, eventObject) {
    // Current Passage object
    console.log(eventObject.passage.name);
});

$(window).on('shown.sm.passage', function(event, eventObject) {
    // Shown Passage object
    console.log(eventObject.passage.name);
});
```
