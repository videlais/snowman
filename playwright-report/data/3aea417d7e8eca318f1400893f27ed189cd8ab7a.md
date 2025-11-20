# Page snapshot

```yaml
- generic [ref=e4]:
  - paragraph [ref=e5]:
    - text: <%
    - text: // An array of the strings "Bread", "Pan", "Book"
    - text: s.arrayInventory = ["Bread", "Pan", "Book"];
  - paragraph [ref=e6]:
    - text: // An example using JavaScript
    - text: "for (const item in s.arrayInventory){"
    - text: "%>You have <%- item %>."
    - text: <%
    - text: "}"
    - text: "%>"
  - separator [ref=e7]
  - text: "<% // An example using jQuery jQuery.each(s.arrayInventory, function( index, value ) { %>You have <%= value %>."
  - text: "<% }); %>"
```