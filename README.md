# Snowman 2.0.0

Snowman 2.0.0 is a minimal Twine 2 story format designed for people who already know
JavaScript and CSS originally created by Chris Klimas. It is current maintained by Dan Cox.

## What does Snowman offer?

Snowman does not use macros like Harlowe, SugarCube, and other story formats. Instead, it has two global objects, `window.story` and `window.passage`, that expose functionality for working with the overall story and the current passage, respectively.

It also includes the JavaScript libraries [jQuery](https://jquery.com/) and [Underscore](https://underscorejs.org/).

Additional styling options are supplied through the inclusion of the [Marked](https://github.com/markedjs/marked) library.

## Want to learn more?

The [official Snowman documentation](https://videlais.github.io/snowman/2/) has more details about Snowman including multiple examples of how to do various tasks.

## Building

Run `npm install` to install dependencies.

`npm run build` will create a Twine 2-ready story format under `dist/`.

To check for style errors, run `npm run lint`.
To run unit tests, run `npm run test`.
