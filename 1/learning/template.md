---
layout: version_1x
title: "Snowman 1.X Documentation"
---

## Templates

Through Underscore's [_template()](https://underscorejs.org/#template) method, Snowman has a template system that allows the use of JavaScript code to be included in passages. This comes in three main forms.

## Arbitrary JavaScript

Any JavaScript can be run within a scoped context that immediately executes the code found within it using the Arbitrary JavaScript syntax of an opening, `<%`, and closing tag, `%>`.

```twee
<%
let someValue = 5;
runFunction();
%>
```

## Interpolation

To write a value to the passage in the current position, the interpolation syntax of an equal sign (`=`) following the opening tag, `<%`, can be used. This is most useful to write a variable, the result of some calculation, or the return value of a function or other related process.

`<%= showReturnValue() %>`

## Interpolate and HTML-Escaped

In those cases where a value should be both interpolated (written to the passage in the current position) and HTML-escaped, the minus symbol (`-`) can be used after the opening tag, `<%`. This is most useful in working with functions or with values that may contain HTML.

`<%- escapeReturnValue() %>`
