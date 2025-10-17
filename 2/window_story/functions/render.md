---
layout: version_2x
title: "Snowman 2.X Documentation"
---

## render()

`render()` is a function of the `window.story` global JavaScript variable created by Snowman.

*Name*: render()

*Parameters*: {String or Number} ID or name of the passage

*Return Type*: {String} HTML source code

*Description*: Returns the HTML source for a passage. This is most often used when embedding one passage inside another. In this instance, make sure to use `<%= ... %>` instead of `<%- ... %>` to avoid incorrectly encoding HTML entities.
