# Page snapshot

```yaml
- generic [ref=e3]:
  - text: "&lt;% // An array of the strings &quot;Bread&quot;, &quot;Pan&quot;, &quot;Book&quot; s.arrayInventory = [&quot;Bread&quot;, &quot;Pan&quot;, &quot;Book&quot;]; // An example using JavaScript for (var i = 0; i &lt; s.arrayInventory.length; i++){ %&gt;You have &lt;%= s.arrayInventory[i] %&gt;."
  - text: "&lt;% } %&gt;"
  - separator [ref=e4]
  - text: "&lt;% // An example using Underscore.js _.each(s.arrayInventory, function(item) { %&gt;You have &lt;%= item %&gt;."
  - text: "&lt;% }); %&gt;"
  - separator [ref=e5]
  - text: "&lt;% // An example using jQuery jQuery.each(s.arrayInventory, function( index, value ) { %&gt;You have &lt;%= value %&gt;."
  - text: "&lt;% }); %&gt;"
```