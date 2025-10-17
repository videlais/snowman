const fs = require('fs');
const ejs = require('ejs');

// Read and parse story.json file.
const storyFile = fs.readFileSync('story.json', { encoding: 'utf8' });
const story = JSON.parse(storyFile);

// Read story format HTML template.
const srcIndex = fs.readFileSync('src/story.ejs', { encoding: 'utf8' });
// Read bundled format.
const formatSource = fs.readFileSync('build/format.bundle.js', { encoding: 'utf8' });
// Read bundled CSS.
const storyCSS = fs.readFileSync('build/format.css', { encoding: 'utf8' });
// Replace the bundles in the format HTML template.
const indexSource = ejs.render(srcIndex, {
  format: `<script>${formatSource}</script>`,
  story_css: `<style>${storyCSS}</style>`
});

// Write the resulting file.
// fs.writeFileSync('build/index.html', indexSource);

// Read the bundled editor code.
// const editorSource = fs.readFileSync("build/editor.bundle.js", {'encoding': 'utf8'});

// Read the bundled twine extensions if they exist.
let twineExtensionsSource = '';
try {
  twineExtensionsSource = fs.readFileSync('build/twine-extensions.bundle.js', { encoding: 'utf8' });
} catch (error) {
  console.log('No twine extensions found, skipping...');
}

// Add the HTML template code to the story object.
story.source = indexSource;

// Generate format.js with extensions if available.
let format = 'window.storyFormat(' + JSON.stringify(story) + ');';
if (twineExtensionsSource) {
  format += '\n' + twineExtensionsSource;
}
fs.writeFileSync('dist/format.js', format);

// Re-read format.js, replacing the editor code to create a malformed JSON.
// let compiledFormat = fs.readFileSync(`dist/format.js`, {'encoding': 'utf8'});
// compiledFormat = compiledFormat.replace("\"setup\":\"\"", `\"setup\": function(){${editorSource}}`);

// Re-write the format.js with editor code additions.
// fs.writeFileSync(`dist/format.js`, compiledFormat);
