---
layout: version_2x
title: "Snowman 2.X Documentation"
---

## HTML Elements

Snowman follows the Twine 2 standard of using `<tw-storydata>` and `<tw-passagedata>` elements to store information about the story and individual passages. Beyond this, Snowman 2.X also uses a `<tw-story>` element as the story rendering area.

During a passage transition, the contents of the `<tw-passge>` element is replaced. The element with the class `passage` will always be a child of the `<tw-story>` element with the class "main". However, it may not be the only child.

## Example Snowman 2.X HTML Structure

```html
<html>
    <head>
        <title>Test File</title>
        <meta charset="utf-8">
        <style>
                  <!-- Snowman Styles -->
    </style>
    </head>

    <body>
        <tw-story>
            <tw-passage class="passage" aria-live="polite">
                    <p>Double-click this passage to edit it.</p>
            </tw-passage>
        </tw-story>

        <tw-storydata
               <!-- Twine 2 data -->
        </tw-storydata>

        <script>
            /* Snowman code */
        </script>
    </body>
</html>
```
