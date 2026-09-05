---
layout: version_2x
title: "Example: Two-Column Layout with CSS Grid"
---

**Audience:** Advanced (comfortable with CSS layout)

## What this shows

Building a persistent two-column layout (main story + sidebar) with modern
CSS Grid, instead of the older `position: fixed` technique.

## How it works

- `UserScript` appends an `<aside id="sidebar">` element directly inside
  `tw-story`, as a sibling of `tw-passage`. Since it lives outside
  `tw-passage`, it isn't erased every time a new passage is rendered.
- The stylesheet sets `tw-story { display: grid; grid-template-columns: 3fr 1fr; }`,
  turning `tw-story`'s two children (`tw-passage` and `#sidebar`) into two
  grid columns automatically — no manual widths, margins, or `position: fixed`
  offsets required.
- `gap: 1em;` adds spacing between the columns.

## Using this in your own story

1. Append any persistent layout elements (sidebars, headers, footers) as
   direct children of `tw-story` in `UserScript`.
2. Set `tw-story { display: grid; grid-template-columns: ...; }` in your
   stylesheet to arrange them.
3. Compare this to a fixed-position sidebar, which achieves a similar layout
   with `position: fixed` — CSS Grid tends to be easier to reason about and
   extend to more columns.

## Full source

```twee
:: StoryData
{
	"ifid":"651BD45A-183B-4778-BEA4-B0CFF706A2F9"
}

:: StoryTitle
Two-Column Layout with CSS Grid in Snowman

:: UserScript[script]
/*
	Add a persistent sidebar as a sibling of tw-passage inside tw-story, then
	lay both of them out with CSS Grid instead of fixed positioning.
*/
$('<aside id="sidebar"><h2>Quick Facts</h2><p>This sidebar is a CSS Grid column, not a fixed-position element.</p></aside>')
	.appendTo('tw-story');

:: UserStylesheet[stylesheet]
tw-story {
	display: grid;
	grid-template-columns: 3fr 1fr;
	gap: 1em;
}

#sidebar {
	background: #eee;
	padding: 1em;
}

:: Start
Welcome to the main story column. The sidebar to the right is laid out using CSS Grid.

[[Continue->Next]]

:: Next
The layout stays in place as you move between passages, since the sidebar lives outside tw-passage.

[[Back->Start]]
```

[Download the .twee file](snowman_cssgridlayout.twee)

---

← Previous: [Accessible Passage Announcements](../accessibledynamiccontent/) · [All examples](../) · Next: [Custom CSS Keyframe Animations](../csskeyframeanimations/) →
