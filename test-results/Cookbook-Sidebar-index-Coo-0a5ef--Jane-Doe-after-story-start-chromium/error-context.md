# Page snapshot

```yaml
- generic [ref=e2]:
  - paragraph [ref=e5]:
    - text: "Name: <%= s.name %>"
    - text: "Location: <%= s.location %>"
  - paragraph [ref=e7]:
    - text: <% s.name = "Jane Doe"; s.location = "Work" %>
    - link "Another passage" [ref=e8] [cursor=pointer]
```