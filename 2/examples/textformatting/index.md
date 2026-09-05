---
layout: version_2x
title: "Example: Basic Text Formatting"
---

**Audience:** Beginner (no HTML/CSS/JS experience needed)

## What this shows

Two different ways to format text in a passage — Markdown shorthand and raw
HTML tags — plus a simple inline CSS style.

## How it works

- Snowman runs every passage's text through a Markdown renderer. Wrapping
  text in `**two asterisks**` makes it **bold**, and `*one asterisk*` makes
  it *italic*.
- You can also write the equivalent HTML tags directly: `<strong>bold</strong>`
  and `<em>italic</em>`. Both approaches produce the same kind of output.
- `<span style="color: blue;">...</span>` is a raw HTML element with an
  inline CSS `style` attribute, letting you style small pieces of text without
  a separate stylesheet.

## Using this in your own story

- Prefer Markdown (`**bold**`, `*italic*`, `# Heading`, `- list item`) for
  quick, readable formatting.
- Drop down to raw HTML (`<span>`, `<div>`, inline `style="..."`) when you
  need something Markdown doesn't support, like specific colors or custom
  attributes.

## Full source

```twee
:: StoryData
{
	"ifid":"F1D16045-587C-4664-B5A7-E3E56D876740"
}

:: StoryTitle
Basic Text Formatting in Snowman

:: Start
This is **bold** text and this is *italic* text, written using Markdown.

This is <strong>bold</strong> and this is <em>italic</em>, written using raw HTML tags instead.

<span style="color: blue;">This sentence is styled blue using an inline CSS style attribute.</span>
```

[Download the .twee file](snowman_textformatting.twee)

---

← Previous: [Basic Links & Multiple Endings](../basiclinks/) · [All examples](../) · Next: [Initializing Story Variables](../initializingvariables/) →
