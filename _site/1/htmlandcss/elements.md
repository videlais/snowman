# HTML Elements

Snowman follows the Twine 2 standard of using `<tw-storydata>` and `<tw-passagedata>` elements to store information about the story and individual passages. Beyond this, Snowman 1.X also uses a `<div>` element with the class `main` as the story rendering area.

During a passage transition, the contents of an element with the class `passage` is replaced. The element with the class `passage` will always be a child of an element with the class "main". However, it may not be the only child.

## Example Snowman 1.X HTML Structure

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
        <div id="main">
            <div class="passage" aria-live="polite">
                    <p>Double-click this passage to edit it.</p>
            </div>
        </div>

        <tw-storydata
               <!-- Twine 2 data -->
        </tw-storydata>

        <script>
            /* Snowman code */
        </script>
    </body>
</html>
```
