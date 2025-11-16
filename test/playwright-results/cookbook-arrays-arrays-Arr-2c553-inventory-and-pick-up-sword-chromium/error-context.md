# Page snapshot

```yaml
- generic [ref=e3]:
  - text: "&lt;%= window.story.render(&quot;Header&quot;) %&gt;"
  - separator [ref=e4]
  - text: You find yourself inside a small room. In the corner, you see a sword, and decide to pick it up. &lt;% s.inventory.push('a sword') %&gt;
  - link "hallway" [ref=e5] [cursor=pointer]:
    - /url: javascript:void(0)
```