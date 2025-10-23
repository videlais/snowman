import { render } from 'ejs';
import { readFileSync, writeFileSync } from 'node:fs';
import pkg from 'shelljs';
const { cp } = pkg;

// Step 1: Read the built file main.js from the dist directory.
const bundledJS = readFileSync('dist/main.js', { encoding: 'utf8' });

// Read the EJS file.
const ejsTemplate = readFileSync('lib/src/index.ejs', { encoding: 'utf8' });

// Step 2: Read the HTML template and inject the minified JavaScript.
const htmlTemplate = render(ejsTemplate, {script: bundledJS});

// Step 2: Create the format data object with metadata from `format.json` and the generated source.
const formatData = JSON.parse(readFileSync('format.json', { encoding: 'utf8' }));

// Step 2.1: Read the version from package.json and update format data
const packageData = JSON.parse(readFileSync('package.json', { encoding: 'utf8' }));
formatData.version = packageData.version;

// Add the generated HTML as the source property.
formatData.source = htmlTemplate;

// Step 5: Write the final format JavaScript file to the `dist` directory.
writeFileSync('dist/format.js', `window.storyFormat(${JSON.stringify(formatData, null, 2)});`, { encoding: 'utf8' });
// Also copy the icon file to the dist directory
cp('lib/src/icon.svg', 'dist/icon.svg');