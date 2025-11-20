# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]: ↶
  - generic [ref=e4]:
    - paragraph [ref=e5]:
      - link "You are not ready! Go back!" [ref=e6] [cursor=pointer]
    - paragraph [ref=e7]:
      - text: <%
      - text: "$('#return').on('click', () => {"
      - text: Story.sidebar.undo();
      - text: "});"
      - text: "%>"
```