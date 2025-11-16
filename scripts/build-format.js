import { render } from 'ejs';
import { readFileSync, writeFileSync } from 'node:fs';
import pkg from 'shelljs';
const { cp } = pkg;

// Check if --dev flag is passed
const isDev = process.argv.includes('--dev');
const inputFile = isDev ? 'dist/main.dev.js' : 'dist/main.js';
const outputFile = isDev ? 'dist/format.dev.js' : 'dist/format.js';

console.log(`Building ${isDev ? 'DEVELOPMENT' : 'PRODUCTION'} format...`);
console.log(`Input: ${inputFile}`);
console.log(`Output: ${outputFile}`);

// Step 1: Read the built file main.js from the dist directory.
const bundledJS = readFileSync(inputFile, { encoding: 'utf8' });

// Read the EJS file.
const ejsTemplate = readFileSync('lib/src/index.ejs', { encoding: 'utf8' });

// Step 2: Read the HTML template and inject the minified JavaScript.
// IMPORTANT: Use a UNIQUE placeholder that won't appear in any JavaScript code
// Using a UUID-like string to avoid collisions with common JavaScript patterns
const PLACEHOLDER = '__SNOWMAN_INJECT_SCRIPT_b8f3e2a1c4d6__';
const htmlTemplate = render(ejsTemplate, {script: PLACEHOLDER});

// Step 3: Replace the placeholder with the actual JavaScript
// This prevents EJS from interpreting JavaScript code that contains <%, etc.
//
// IMPORTANT: In JavaScript's replace/replaceAll, the replacement string can contain
// special patterns like $&, $`, $', $n. We need to escape $ characters to prevent
// them from being interpreted. For example, if bundledJS contains "\\$&" (a regex
// replacement pattern), it would be interpreted as "insert the matched text" and
// would insert our PLACEHOLDER back into the output!
const escapedBundledJS = bundledJS.replace(/\$/g, '$$$$'); // Replace $ with $$

// CRITICAL FIX for GitHub issue #1112:
// Escape HTML entities that would be decoded by the browser's HTML parser.
// When JavaScript is embedded in <script> tags, the browser's HTML parser runs FIRST  
// and decodes entities like &amp; to &, breaking JavaScript string literals.
// For example, the Underscore.js code: {"&":"&amp;"} would become {"&":"&"}
// causing a syntax error (duplicate key).
//
// Solution: Only escape HTML entity patterns (like &amp;, &lt;, etc.) by replacing
// them with their HTML numeric entity equivalents, which browsers decode correctly
// but don't conflict with JavaScript syntax.
const htmlSafeJS = escapedBundledJS
  .replace(/&amp;/g, '&#38;amp;')   // &amp; -> &#38;amp; (&#38; = &)
  .replace(/&lt;/g, '&#38;lt;')      // &lt; -> &#38;lt;
  .replace(/&gt;/g, '&#38;gt;')      // &gt; -> &#38;gt;
  .replace(/&quot;/g, '&#38;quot;')  // &quot; -> &#38;quot;
  .replace(/&#x27;/g, '&#38;#x27;'); // &#x27; -> &#38;#x27;

// Use replaceAll with the escaped bundledJS
const finalHTML = htmlTemplate.replaceAll(PLACEHOLDER, htmlSafeJS);

// Step 2: Create the format data object with metadata from `format.json` and the generated source.
const formatData = JSON.parse(readFileSync('format.json', { encoding: 'utf8' }));

// Step 2.1: Read the version from package.json and update format data
const packageData = JSON.parse(readFileSync('package.json', { encoding: 'utf8' }));
formatData.version = packageData.version;

// Add the generated HTML as the source property.
formatData.source = finalHTML;

// Step 5: Write the final format JavaScript file to the `dist` directory.
const formatJSON = JSON.stringify(formatData, null, 2);
writeFileSync(outputFile, `window.storyFormat(${formatJSON});`, { encoding: 'utf8' });

console.log(`✓ Format written to ${outputFile}`);

// Also copy the icon file to the dist directory
cp('lib/src/icon.svg', 'dist/icon.svg');