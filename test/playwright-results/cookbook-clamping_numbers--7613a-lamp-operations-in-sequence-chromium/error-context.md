# Page snapshot

```yaml
- generic [ref=e3]:
  - text: Initialize the numeric variable to a value with the range you want.
  - text: eg. between 1 and 10 inclusive.
  - text: "(note: You don't need to use the Math.clamp() function at this point.)"
  - text: "&lt;% s.valueToClamp = 5 %&gt; Current value: &lt;%= s.valueToClamp %&gt; Increase the number to a value that is within the desired range."
  - text: "eg. Add 1 to the current value. &lt;% s.valueToClamp = Math.clamp(s.valueToClamp + 1, 1, 10) %&gt; New value: &lt;%= s.valueToClamp %&gt; Try to increase the number to a value that is outside the desired range."
  - text: "eg. Add 100 to the current value. &lt;% s.valueToClamp = Math.clamp(s.valueToClamp + 100, 1, 10) %&gt; New value: &lt;%= s.valueToClamp %&gt; Decrease the number to a value that is within the desired range."
  - text: "eg. Minus 5 from the current value. &lt;% s.valueToClamp = Math.clamp(s.valueToClamp - 5, 1, 10) %&gt; New value: &lt;%= s.valueToClamp %&gt; Try to decrease the number to a value that is outside the desired range."
  - text: "eg. Minus 100 from the current value. &lt;% s.valueToClamp = Math.clamp(s.valueToClamp - 100, 1, 10) %&gt; New value: &lt;%= s.valueToClamp %&gt;"
```