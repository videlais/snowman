---
layout: version_2x
title: "Example: Working with JSON Data"
---

**Audience:** Advanced (comfortable with JavaScript)

## What this shows

How to parse and work with structured JSON data inside a passage, and why
`fetch()` isn't a reliable way to load local files in a compiled Twine story.

## How it works

- `window.setup.charactersJSON` holds a JSON string — the same shape of text
  you'd get back from an API call or a `.json` file.
- `fetch()` cannot load files from disk when a story is opened directly via
  the `file://` protocol (browsers block this for security reasons), so
  compiled Twine stories can't reliably `fetch()` a local `.json` file unless
  the story is served over `http(s)` from a web server.
- `JSON.parse(text)` converts that JSON string into a real JavaScript array of
  objects, which is then looped over with Underscore's `_.each()` to build a
  list.

## Using this in your own story

- If your story will always be served over `http(s)` (e.g. published on a
  website), `fetch('data.json').then(r => r.json()).then(...)` works normally.
- If your story needs to also work when opened locally as a single HTML file
  (double-clicked from a folder), embed your data as a JSON string in
  `UserScript` and use `JSON.parse()` instead, as shown here.

## Full source

```twee
:: StoryData
{
	"ifid":"B5116666-1EC7-4B27-B48D-28E3F7DC26F1"
}

:: StoryTitle
Working with JSON Data in Snowman

:: UserScript[script]
window.setup = window.setup || {};

/*
	This simulates data that, in a real project served over http(s), you might
	load with fetch() from an external .json file. fetch() cannot load local
	files when a story is opened directly via the file:// protocol, so this
	example embeds the same kind of JSON text and parses it with JSON.parse()
	to demonstrate working with structured data either way.
*/
window.setup.charactersJSON = '[{"name":"Ari","class":"Ranger"},{"name":"Bex","class":"Mage"},{"name":"Cato","class":"Warrior"}]';

:: Start
<%
	var characters = JSON.parse(window.setup.charactersJSON);
%>
<ul id="character-list">
<% _.each(characters, function(c) { %>
<li><%= c.name %> the <%= c.class %></li>
<% }); %>
</ul>

There are <%= characters.length %> characters available.
```

[Download the .twee file](snowman_workingwithjsondata.twee)

---

← Previous: [Organizing Passages with Tags](../passagetagsorganizing/) · [All examples](../) · Next: [Finite-State Machine Branching](../statemachinebranching/) →
