---
layout: version_1x
title: "Snowman 1.X Documentation"
---

## `render()`

`render()` is a function of the `window.passage` global JavaScript variable created by Snowman.

*Name*: render()

*Parameters*: {String} Source

*Return Type*: {String} HTML source

*Description*: Returns an HTML-rendered version of the passage's source. This first runs the source code through the Underscore template parser, then runs the result through a Markdown renderer, and then finally converts bracketed links to passage links.
