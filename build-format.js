const fs = require('node:fs');
const ejs = require('ejs');

const files = [
  'format.js',
  'icon.svg',
  'LICENSE'
];

console.log(`Cleaning dist/`);

files.forEach(file => {
  const path = `dist/${file}`;

  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
    console.log(`\t 🗑️ Deleted ${path}`);
  }
});

console.log(`Building format.js file...`);

// Read and parse story.json file.
const storyFile = fs.readFileSync('story.json', { encoding: 'utf8' });
const story = JSON.parse(storyFile);

// Read story format HTML template.
const srcIndex = fs.readFileSync('src/story.ejs', { encoding: 'utf8' });

console.log(`\t ✅Reading story source EJS`);

// Read bundled format.
const formatSource = fs.readFileSync('build/format.bundle.js', { encoding: 'utf8' });

console.log(`\t ✅Reading format bundle`);

// Neutralize HTML-significant sequences before embedding the bundle in an inline
// `<script>`. Bundled dependencies (e.g. markdown-it) contain literal `<!--` and
// `<script` strings; when `<!--` precedes `<script` inside an inline script, the
// HTML parser enters the "script data double escaped" state and the real
// `</script>` no longer closes the tag, so the entire bundle fails to execute.
// Inserting a backslash is a no-op inside JS string and regex literals
// (`\!` === `!`, `\/` === `/`), so the executed code is unchanged.
const safeFormatSource = formatSource
  .replace(/<!--/g, '<\\!--')
  .replace(/<\/script/gi, '<\\/script');

// Read bundled CSS.
const storyCSS = fs.readFileSync('build/format.css', { encoding: 'utf8' });

console.log(`\t ✅Reading story CSS bundle`);

// Replace the bundles in the format HTML template.
const indexSource = ejs.render(srcIndex, {
  format: `<script>${safeFormatSource}</script>`,
  story_css: `<style>${storyCSS}</style>`
});

// Write the resulting file.
// fs.writeFileSync('build/index.html', indexSource);

// Read the bundled editor code.
const editorSource = fs.readFileSync("build/editor.bundle.js", {'encoding': 'utf8'});

// Add the HTML template code to the story object.
story.source = indexSource;

// Add editor extensions for Twine 2 CodeMirror integration
story.editorExtensions = {
  twine: {
    "^2.4.0-beta2": {
      codeMirror: {
        mode: "javascript", // Use JavaScript mode for Snowman's JS-heavy syntax
        theme: "default"
      }
    }
  }
};

// Generate format.js as proper JSONP following Twine specification
let format = `window.storyFormat(${JSON.stringify(story, null, 2)});`;

fs.writeFileSync('dist/format.js', format);

console.log(`\t ✅Writing dist/format.js`);

// Copy LICENSE file
fs.copyFileSync('LICENSE', 'dist/LICENSE');
console.log(`\t ✅Copying LICENSE file`);

// Copy icon.svg file
fs.copyFileSync('icon.svg', 'dist/icon.svg');
console.log(`\t ✅Copying icon.svg file`);

console.log(`Build complete!`);