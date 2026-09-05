---
layout: version_2x
title: "Example: External Links"
---

**Audience:** Beginner (no HTML/CSS/JS experience needed)

## What this shows

How to link out to a real website (instead of another passage) safely, using
plain HTML rather than Twine's `[[ ]]` link syntax.

## How it works

- Twine's `[[ ]]` link syntax is only for linking between passages inside
  your own story. To link to an external website, write a normal HTML
  `<a href="...">` tag instead.
- `target="_blank"` tells the browser to open the link in a new tab, so the
  player doesn't lose their place in the story.
- `rel="noopener noreferrer"` is a security best practice for any link that
  opens in a new tab: it stops the new page from being able to access or
  redirect the original page (`noopener`) and from receiving your story's URL
  as a referrer (`noreferrer`).

## Using this in your own story

Whenever you link to an outside site, write:

```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">Link text</a>
```

## Full source

```twee
:: StoryData
{
	"ifid":"D2177F39-E48B-4D6F-92E0-9BFA9BB0948A"
}

:: StoryTitle
External Links in Snowman

:: Start
Visit the <a href="https://github.com/videlais/snowman" target="_blank" rel="noopener noreferrer">Snowman GitHub repository</a> to learn more about this story format.

Notice two things about that link's HTML: `target="_blank"` opens it in a new tab, and `rel="noopener noreferrer"` keeps the new tab from being able to access or control this page.
```

[Download the .twee file](snowman_externallinks.twee)

---

← Previous: [Simple Score Counter](../scorecounter/) · [All examples](../) · Next: [Simple Image Gallery](../imagegallery/) →
