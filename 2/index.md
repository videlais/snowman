---
layout: version_2x
title: "Snowman 2.X Documentation"
---

Snowman is a minimal Twine 2 story format designed for people who already know JavaScript and CSS originally created by Chris Klimas. It is currently being maintained by Dan Cox.

## What is the difference between 1.X and 2.X?

While working on 1.4.0, it was decided that the codebase should also move from ES5 to more JavaScript ES6 functionality. This was branched into what is now 2.X and more functionality was added from there.

The main difference for most users is that 2.X uses different event names than 1.X and also adds some new global functions.

## What does Snowman offer?

Snowman does not use macros like Harlowe, SugarCube, and other story formats. Instead, it has two global objects, `window.story` and `window.passage`, that expose functionality for working with the overall story and current passage respectively through JavaScript.

The libraries [jQuery](https://jquery.com/) and [Underscore](https://underscorejs.org/) are also included and available globally as `window.$` and `window._`.

Snowman uses the [Marked](https://github.com/markedjs/marked) library internally to parse Markdown, but does not expose it as a global. To parse Markdown directly, call `processMarkdown()` on a `Passage` instance, which uses the same Markdown engine and configuration as passage rendering and has no dependency on the DOM or `window.story`:

```javascript
new Passage().processMarkdown('*Emphasis*'); // "<em>Emphasis</em>"
```

Alternatively, `window.passage.render(source)` runs arbitrary source through the full rendering pipeline (see [render()](window_passage/functions/render.md)).

## License

This work is licensed under a Creative Commons Attribution-ShareAlike 4.0 International License.

Documentation Version 2.1.5 (Current)
