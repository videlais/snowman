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

## Development

### Prerequisites

Install dependencies:

```bash
npm install
```

### Available Scripts

- `npm run clean` - Remove build artifacts from `build/` and `dist/` directories
- `npm run build` - Build the story format (creates `dist/format.js`)
- `npm run lint` - Check code for style errors using ESLint
- `npm run lint:fix` - Automatically fix linting errors where possible
- `npm run test` - Run unit tests with coverage (89 tests, ~88% coverage)
- `npm run all` - Run complete build pipeline: clean, lint, test, and build

### Build Output

The compiled Twine 2-ready story format will be created as `dist/format.js`.
