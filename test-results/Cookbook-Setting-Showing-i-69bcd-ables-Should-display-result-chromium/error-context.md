# Page snapshot

```yaml
- generic [ref=e4]:
  - paragraph [ref=e5]:
    - text: <%
    - text: s.numberVariable = 5;
    - text: s.wordVariable = "five";
    - text: s.phraseVariable = "The value";
    - text: "%>"
  - paragraph [ref=e6]: <%= s.phraseVariable %> is <%= s.numberVariable %> and <%= s.wordVariable %>.
  - paragraph [ref=e7]:
    - text: <%
    - text: s.numberVariable++;
    - text: "%>"
  - paragraph [ref=e8]: <%= s.phraseVariable %> is <%= s.numberVariable %> and <%= s.wordVariable%>.
```