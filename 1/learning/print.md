---
layout: version_1x
title: "Snowman 1.X Documentation"
---

## `print()`

Within the scope of any templated code section is the function print() provided by [Underscore](https://underscorejs.org/#template). This acts like the use of a value interpolation, but can be used within an arbitrary code section.

It can also be used to write any value, including HTML, within a template code section.

## Example

```twee
<%
   print("<div>Write this!</div>");
%>
```

**Note:** Because `print()` is based in Underscore, its contexts are not parsed directly by Snowman. All markdown or other Snowman-related syntax will be ignored.
