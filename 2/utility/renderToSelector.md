# renderToSelector()

The global function `window.renderToSelector()` accepts a valid [jQuery selector](https://api.jquery.com/category/selectors/) and the ID or name of a passage. If both exist in the story, it will render the contents of the passage and overwrite the HTML of any elements matching the selector provided.

## Example

```html
<div id="playerUI"></div>
<%
  renderToSelector("#playerUI", "UI");
%>
```
