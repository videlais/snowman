import { render } from 'ejs';
import { readFileSync, writeFileSync } from 'node:fs';
import pkg from 'shelljs';
const { cp } = pkg;

const inputFile = 'dist/main.js';
const outputFile = 'dist/format.js';

console.log(`Building PRODUCTION format...`);
console.log(`Input: ${inputFile}`);
console.log(`Output: ${outputFile}`);

// Read the bundled JavaScript from webpack
const bundledJS = readFileSync(inputFile, { encoding: 'utf8' });

// Read the EJS template
const ejsTemplate = readFileSync('lib/src/index.ejs', { encoding: 'utf8' });

// Render the template with a unique placeholder to avoid conflicts
// This prevents EJS from interpreting JavaScript code patterns like <%, etc.
const PLACEHOLDER = '__SNOWMAN_INJECT_SCRIPT_b8f3e2a1c4d6__';
const htmlTemplate = render(ejsTemplate, { script: PLACEHOLDER });

// Escape dollar signs in the bundled JavaScript to prevent replacement pattern interpretation
// In JavaScript replace/replaceAll, $& $` $' $n are special patterns - we need $$ to get literal $
const escapedBundledJS = bundledJS.replace(/\$/g, '$$$$');

// Replace the placeholder with the actual JavaScript
const finalHTML = htmlTemplate.replaceAll(PLACEHOLDER, escapedBundledJS);

// Create the format data object with metadata from format.json
const formatData = JSON.parse(readFileSync('format.json', { encoding: 'utf8' }));

// Read version from package.json
const packageData = JSON.parse(readFileSync('package.json', { encoding: 'utf8' }));
formatData.version = packageData.version;

// Add the generated HTML as the source property
formatData.source = finalHTML;

// Write the final format JavaScript file
const formatJSON = JSON.stringify(formatData, null, 2);
writeFileSync(outputFile, `window.storyFormat(${formatJSON});`, { encoding: 'utf8' });

console.log(`✓ Format written to ${outputFile}`);

// Copy the icon file to the dist directory
cp('lib/src/icon.svg', 'dist/icon.svg');