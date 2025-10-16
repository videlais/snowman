# Snowman 2.1.0

[![CI](https://github.com/videlais/snowman/actions/workflows/ci.yml/badge.svg?branch=2.X)](https://github.com/videlais/snowman/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/videlais/snowman/branch/2.X/graph/badge.svg)](https://codecov.io/gh/videlais/snowman)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Snowman is a minimal Twine 2 story format designed for people who already know JavaScript and CSS originally created by Chris Klimas. It is currently maintained by Dan Cox.

## What does Snowman offer?

Snowman does not use macros like Harlowe, SugarCube, and other story formats. Instead, it has two global objects, `window.story` and `window.passage`, that expose functionality for working with the overall story and the current passage, respectively.

It also includes the JavaScript libraries [jQuery](https://jquery.com/) and [Underscore](https://underscorejs.org/).

Additional styling options are supplied through the inclusion of the [Marked](https://github.com/markedjs/marked) library.

## Want to learn more?

The [official Snowman documentation](https://videlais.github.io/snowman/2/) has more details about Snowman including multiple examples of how to do various tasks.

## Installing Snowman in Twine

To use Snowman as a story format in Twine 2:

1. Open Twine 2.
2. Go to **Twine** in the top-level menu.
3. Click on **Story Formats**.
4. In the sidebar, click on **Add**.
5. Enter the JSONP URL for the version you want to use from the [builds page](https://videlais.github.io/snowman/builds/)

For example, to install the latest 2.X version, use:

```url
https://videlais.github.io/snowman/builds/2.X/format.js
```

## Major Branches

Snowman development is organized into major version branches:

- **[1.X Branch](https://github.com/videlais/snowman/tree/1.X)** - Legacy version
- **[2.X Branch](https://github.com/videlais/snowman/tree/2.X)** - Current stable version
- **[Main Branch](https://github.com/videlais/snowman)** - Development version

## Building

To build a new version of Snowman locally:

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Run the complete build pipeline:**

   ```bash
   npm run all
   ```

   This will run linting, all tests, webpack build, and story format compilation.

3. **Individual build steps (optional):**

   ```bash
   npm run lint          # Check code quality
   npm run test:all      # Run core and extended tests  
   npm run build         # Build webpack bundles
   npm run compile       # Compile story format
   ```

4. **Quick development build:**

   ```bash
   npm run dev           # Lint, test, build, and compile
   ```

The compiled story format will be available in the `dist/` directory as `format.js`.
