# Page snapshot

```yaml
- generic [ref=e4]:
  - paragraph [ref=e5]: "Choose direction:"
  - combobox [ref=e6]:
    - option "up" [selected]
    - option "down"
    - option "left"
    - option "right"
  - paragraph [ref=e7]:
    - text: <%
    - text: // Set a default global value in case reader does not pick any value.
    - text: s.chosenDirection = "none";
  - code [ref=e9]: "// Use jQuery to wait for content to be loaded. $(() =&gt; { // Listen for the 'change' event on element with id of \"directions\". $('#directions').on('change', () =&gt; { // Look for the child element just selected. const selectedElement = $('#directions option:selected'); // Update with selected direction. s.chosenDirection = selectedElement.text(); }); });"
  - paragraph [ref=e10]: "%>"
  - paragraph [ref=e11]:
    - link "Show Direction" [ref=e12] [cursor=pointer]
```