---
layout: version_2x
title: "Snowman 2.X Documentation"
---

## getStyles()

The global function `window.getStyles()` accepts one or more URLs of remote CSS stylesheets and attempts to load them. The function returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

If loading is successful, all remote CSS rules are applied as new `<style>` elements to the `<head>` section of the story.

## Example

```javascript
window.getStyles("https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css");
```
