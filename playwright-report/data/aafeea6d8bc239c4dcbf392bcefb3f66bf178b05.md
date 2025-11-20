# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]: ↶
  - generic [ref=e4]:
    - paragraph [ref=e5]:
      - text: "<% if (!s.key) { %>"
      - text: "Items:"
    - list [ref=e6]:
      - listitem [ref=e7]:
        - link "Pick up key" [ref=e8] [cursor=pointer]:
          - /url: javascript:void(0)
        - text: "<% } else { %>"
        - text: There is nothing here.
        - text: "<% } %>"
    - paragraph [ref=e9]:
      - text: <%
      - text: "$(function() {"
      - text: "$('.key-item').click(function() {"
      - text: s.key = true;
      - text: $(this).replaceWith('You have a key.');
      - text: "});"
      - text: "});"
      - text: "%>"
    - paragraph [ref=e10]: "Rooms:"
    - list [ref=e11]:
      - listitem [ref=e12]:
        - link "Front Room" [ref=e13] [cursor=pointer]
```