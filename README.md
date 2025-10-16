# Snowman

![Node.js CI](https://github.com/videlais/snowman/workflows/Node.js%20CI/badge.svg) [![codecov](https://codecov.io/gh/videlais/snowman/branch/master/graph/badge.svg)](https://codecov.io/gh/videlais/snowman)

Snowman is an advanced Twine 2 story format designed for people who already know JavaScript and CSS. It was originally created by Chris Klimas and is currently maintained by Dan Cox.

## Want to learn more?

The [official Snowman documentation](https://videlais.github.io/snowman/#/) has more details.

## What does Snowman offer?

Snowman does not use macros as found in sister story formats Harlowe and SugarCube. Instead, it provides template tags, `<% ... %>`, and a JavaScript API for accessing and manipulating the current story and its passages.

It also includes the JavaScript library [jQuery](https://jquery.com/).

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

## Building Snowman

To create a new build of Snowman from this repository:

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the build process:

   ```bash
   npm run build
   ```

3. Compile the story format:

   ```bash
   npm run compile
   ```

The compiled story format will be available in the `dist/` directory as `format.js`.

For a complete build including linting and testing, use:

```bash
npm run all
```
