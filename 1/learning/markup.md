# HTML Shorthand

Snowman supports a HTML shorthand for quickly creating elements with different properties. This shorthand is broken into two parts: prefixes and suffixes.

## Prefixes

After the name of the element, two different symbols can be used.

* `0`: Sets the href property to javascript:void(0)
* `-`: Sets the style property to display:none

### Prefix Examples

An empty link:

`<a0>This will be empty!</a>`

A hidden DIV:

`<div->Empty link and hidden</div>`

## Suffixes

After the name of the element and any prefixes are two other groups: ID and any classes. To set the ID of an element, its name must start with the hash (`#`) and run to the end of the opening tag or until a class name is encountered. A class name starts with a period (`.`) and is either after any ID or the name of an element.

* `#id`: Sets the ID of the element
* `.class`: Sets the class. Can be used multiple times for additional classes.

### Suffix Examples

A DIV with the ID of "banner":

`<div#banner>This is a banner!</div>`

A SPAN with multiple classes:

`<span.large.green>This is large and green</span>`
