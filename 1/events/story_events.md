---
layout: version_1x
title: "Snowman 1.X Documentation"
---

## Story Events

The event `start.sm.story` is triggered when the story is finished loading and right before the first passage is displayed.

The story property of the event object contains the `window.story` object of the current story.

```javascript
$(window).on('start.sm.story', function(event, eventObject) {
  // window.story
    console.log(eventObject.story);
});
```
