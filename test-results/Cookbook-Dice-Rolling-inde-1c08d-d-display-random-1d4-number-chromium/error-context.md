# Page snapshot

```yaml
- generic [ref=e4]:
  - paragraph [ref=e5]: "Rolling a 1d4: <%- Utils.randomInt(1,4) %>"
  - paragraph [ref=e6]: "Rolling a 1d6: <%- Utils.randomInt(1,6) %>"
  - paragraph [ref=e7]: "Rolling a 1d8: <%- Utils.randomInt(1,8) %>"
  - paragraph [ref=e8]: "Rolling a 1d10: <%- Utils.randomInt(1, 10) %>"
  - paragraph [ref=e9]: "Rolling a 1d12: <%- Utils.randomInt(1, 12) %>"
  - paragraph [ref=e10]: "Rolling a 1d20: <%- Utils.randomInt(1, 20) %>"
  - paragraph [ref=e11]: "Rolling a 1d100: <%- Utils.randomInt(1, 100) %>"
  - paragraph [ref=e12]: "Rolling a 1d4 + 4: <%- Utils.randomInt(1, 4) + 4 %>"
  - paragraph [ref=e13]: "Rolling a 1d6 - 2: <%- Utils.randomInt(1, 6) - 2 %>"
  - paragraph [ref=e14]: "Rolling a 2d6 + 10: <%- Utils.randomInt(1, 6) + Utils.randomInt(1, 6) + 10 %>"
```