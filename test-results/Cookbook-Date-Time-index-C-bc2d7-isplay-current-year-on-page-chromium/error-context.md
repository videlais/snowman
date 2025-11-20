# Page snapshot

```yaml
- generic [ref=e4]:
  - paragraph [ref=e5]: The current time (in milliseconds since January 1, 1970 00:00:00 UTC) is <%- Date.now() %>
  - paragraph [ref=e6]:
    - text: <%
    - text: s.newDate = new Date();
    - text: "%>"
  - paragraph [ref=e7]: The current month is <%- s.newDate.getMonth() %>.
  - paragraph [ref=e8]: The current day is <%- s.newDate.getDay() %>.
  - paragraph [ref=e9]: The current hour is <%- s.newDate.getHours() %>.
  - paragraph [ref=e10]: The current minute is <%- s.newDate.getMinutes() %>.
  - paragraph [ref=e11]: The current fullyear is <%- s.newDate.getFullYear() %>.
  - paragraph [ref=e12]:
    - text: <%
    - text: s.originalDate = new Date("October 20, 2018");
    - text: "%>"
  - paragraph [ref=e13]: It has been <%- Date.now() - s.originalDate %> milliseconds since October 20, 2018.
```