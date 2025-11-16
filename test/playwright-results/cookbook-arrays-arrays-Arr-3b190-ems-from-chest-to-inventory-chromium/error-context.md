# Page snapshot

```yaml
- generic [ref=e3]:
  - text: "&lt;% s.inventory = s.inventory.concat(s.chest) %&gt; &lt;% s.chestOpen = true %&gt; &lt;%= window.story.render(&quot;Header&quot;) %&gt;"
  - separator [ref=e4]
  - text: You open the chest and find &lt;%= s.chest.join(' and ') %&gt;.
  - link "hallway" [ref=e5] [cursor=pointer]:
    - /url: javascript:void(0)
```