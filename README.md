# Snowman 1.4

[![CI](https://github.com/videlais/snowman/actions/workflows/ci.yml/badge.svg?branch=1.X)](https://github.com/videlais/snowman/actions/workflows/ci.yml)
[![Security Analysis](https://github.com/videlais/snowman/actions/workflows/security.yml/badge.svg?branch=1.X)](https://github.com/videlais/snowman/actions/workflows/security.yml)
[![Code Quality](https://github.com/videlais/snowman/actions/workflows/quality.yml/badge.svg?branch=1.X)](https://github.com/videlais/snowman/actions/workflows/quality.yml)

Snowman 1.4 is a minimal Twine 2 story format designed for people who already know
JavaScript and CSS originally created by [Chris Klimas](https://github.com/klembot).

It is currently maintained by [Dan Cox](https://github.com/videlais).

## What does Snowman offer?

Snowman does not use macros like Harlowe, SugarCube, and other story formats. Instead, it has two global objects, `window.story` and `window.passage`, that expose functionality for working with the overall story and current passage respectively.

It also includes the JavaScript libraries [jQuery](https://jquery.com/) and [Underscore](https://underscorejs.org/).

Additional styling options are supplied through the inclusion of the [Marked](https://github.com/markedjs/marked) library.

## Want to learn more?

The [Snowman 1.X documentation](https://videlais.github.io/snowman/1/) has more details including examples of how to do various tasks.

## Scripts

* `npm install` to install dependencies.
* `npm run build` will create a Twine 2-ready story format under `dist/`.
* `npm run lint` to check for style errors.
* `npm test` to run unit tests
