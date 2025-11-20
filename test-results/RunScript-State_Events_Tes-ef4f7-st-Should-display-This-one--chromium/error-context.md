# Page snapshot

```yaml
- generic [ref=e4]:
  - paragraph [ref=e5]:
    - link "Click me" [ref=e6] [cursor=pointer]
    - text: <%
    - text: "$('a').on('click', () => {"
    - text: Story.events.emit('test-click');
    - text: "});"
  - code [ref=e8]: "Story.events.on('test-click', () =&gt; { Story.show('Another'); });"
  - paragraph [ref=e9]: "%>"
```