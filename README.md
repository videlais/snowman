# Snowman 1.3

Snowman 1.3 is a minimal Twine 2 story format designed for people who already know
JavaScript and CSS originally created by Chris Klimas. It is current maintained by Dan Cox.

## What does Snowman offer?

Snowman does not use macros like Harlowe, SugarCube, and other story formats. Instead, it has two global objects, `window.story` and `window.passage`, that expose functionality for working with the overall story and current passage respectively.

It also includes the JavaScript libraries [jQuery](https://jquery.com/) and [Underscore](https://underscorejs.org/).

Additional styling options are supplied through the inclusion of the [Marked](https://github.com/markedjs/marked) library.

## Want to learn more?

The [official Snowman documentation](https://videlais.github.io/snowman/) has more details about Snowman including multiple examples of how to do various tasks.

## Building

Run `npm install` to install dependencies. `npm run build` will create a Twine 2-ready story format under dist/, as well as a guide to Snowman features at `dist/guide.html`. `npm start` will start a file watching process that updates the story format as changes are made under `src/`.

To check for style errors, run `npm run lint`. To run unit tests, run `npm test`. Please ensure that both run cleanly before submitting a pull request.
