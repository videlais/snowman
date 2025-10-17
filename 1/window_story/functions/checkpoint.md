---
layout: version_1x
title: "Snowman 1.X Documentation"
---

## `checkpoint()`

`checkpoint()` is a function of the `window.story` global JavaScript variable created by Snowman.

*Name:* checkpoint()

*Parameters*: {String} Checkpoint name, appears in history, optional

*Return Type*: (None.)

*Description*: Tries to add an entry in the browser history for the current story state. Remember, only variables set on this story's state variable are stored in the browser history.
