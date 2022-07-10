# Story Events

The event `sm.story.started` is triggered when the story is finished loading and right before the first passage is displayed.

The story property of the event object contains the `window.story` object of the current story.

```javascript
$(window).on('sm.story.started', function(event, eventObject) {
  // window.story
    console.log(eventObject.story);
});
```

## Error

The event `sm.story.error` is triggered whenever a JavaScript error occurs on the page. Many internal functions trigger this event and send information about the specific error encountered.

Information about the error is saved to `window.story.errorMessage`.

If `window.story.ignoreErrors` is `true`, Snowman will attempt to continue processing the story and will silently update `window.story.errorMessage`. Otherwise, the story will "stop" as the current passage is overwritten with the error.
