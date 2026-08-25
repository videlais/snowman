---
layout: version_2x
title: "Snowman 2.X Documentation"
---

## render()

`render()` is a function of the `window.passage` global JavaScript variable created by Snowman.

*Name*: render()

*Parameters*: {String} Source

*Return Type*: {String} HTML source

*Description*: Returns an HTML-rendered version of the passage's source. This first converts bracketed links to passage links, then runs the result through a Markdown renderer, and finally runs the source code through the Underscore template parser. Template code is protected from the Markdown step, so Markdown and template syntax can be freely combined in the same passage.
