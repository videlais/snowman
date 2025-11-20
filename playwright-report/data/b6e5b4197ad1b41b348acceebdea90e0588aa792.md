# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]: ↶
  - generic [ref=e4]:
    - paragraph [ref=e5]:
      - text: <% s.inventory = s.inventory.concat(s.chest) %>
      - text: <% s.chestOpen = true %>
      - text: <%- Story.include("Header") %>
    - separator [ref=e6]
    - paragraph
    - paragraph [ref=e7]: You open the chest and find <%= s.chest.join(' and ') %>.
    - paragraph [ref=e8]:
      - link "Okay." [ref=e9] [cursor=pointer]
```