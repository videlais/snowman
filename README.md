![Node.js CI](https://github.com/videlais/snowman/workflows/Node.js%20CI/badge.svg) [![codecov](https://codecov.io/gh/videlais/snowman/branch/master/graph/badge.svg)](https://codecov.io/gh/videlais/snowman)

# Snowman

Snowman is an advanced Twine 2 story format designed for people who already know JavaScript and CSS. It was originally created by Chris Klimas and is currently maintained by Dan Cox.

## What does Snowman offer?

Snowman does not use macros. Instead, it provides template tags, `<% ... %>`, and a JavaScript API for accessing and manipulating the current story and its passages.

It also includes the JavaScript library [jQuery](https://jquery.com/).

## Want to learn more?

The [official Snowman documentation](https://videlais.github.io/snowman/#/) has more details.

## Building

Run `npm install` to install dependencies.

`npm run build` will create a Twine 2-ready story format under `dist/`.

To check for style errors, run `npm run lint`.
To run unit tests, run `npm run test`.
