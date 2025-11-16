# Page snapshot

```yaml
- generic [ref=e3]:
  - text: "&lt;%= window.story.render(&quot;Header&quot;) %&gt;"
  - separator [ref=e4]
  - text: "You see a chest here in the hallway. &lt;% if (!s.chestOpen) { %&gt; Do you want to open it?"
  - link "chest" [ref=e5] [cursor=pointer]:
    - /url: javascript:void(0)
  - text: "&lt;% } else { %&gt; It's open, and there's nothing inside. &lt;% } %&gt;"
  - link "dart trap" [ref=e6] [cursor=pointer]:
    - /url: javascript:void(0)
```