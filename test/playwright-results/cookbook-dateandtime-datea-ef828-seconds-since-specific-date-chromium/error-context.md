# Page snapshot

```yaml
- generic [ref=e3]: "The current time (in milliseconds since January 1, 1970 00:00:00 UTC) is &lt;%= Date.now() %&gt; &lt;% window.setup = {}; window.setup.newDate = new Date(); %&gt; The current month is &lt;%= setup.newDate.getMonth() %&gt;. The current day is &lt;%= setup.newDate.getDay() %&gt;. The current hour is &lt;%= setup.newDate.getHours() %&gt;. The current minute is &lt;%= setup.newDate.getMinutes() %&gt;. The current fullyear is &lt;%= setup.newDate.getFullYear() %&gt;. &lt;% window.setup.originalDate = new Date(&quot;October 20, 2018&quot;) %&gt; It has been &lt;%= Date.now() - setup.originalDate%&gt; milliseconds since October 20, 2018."
```