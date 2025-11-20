# Page snapshot

```yaml
- generic [ref=e4]:
  - paragraph [ref=e5]:
    - text: <%
    - text: s.health = 80;
    - text: "%>"
  - paragraph [ref=e6]:
    - text: "Show a healthbar using a Progress element:"
    - text: <%- '
    - progressbar [ref=e7]
    - text: "' %>"
  - paragraph [ref=e8]:
    - text: "Show a healthbar using a Meter element:"
    - text: <%- '
    - meter [ref=e9]
    - text: "' %>"
```