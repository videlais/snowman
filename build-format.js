const fs = require('node:fs');
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

// Add the HTML template code to the story object.
story.source = indexSource;

// Generate format.js as proper JSONP following Twine specification
let format = '';

// Read the bundled twine extensions and add them first
try {
  const extensionsBundle = fs.readFileSync('./build/twine-extensions.bundle.js', 'utf8');
  format += extensionsBundle + '\n';
  
  // Create the JSONP callback with dynamic editorExtensions assignment
  format += `(function() {
  var storyFormat = ${JSON.stringify(story, null, 2)};
  
  // Add editorExtensions following Chapbook's pattern
  storyFormat.editorExtensions = {
    twine: {
      "^2.4.0-beta2": {
        codeMirror: {
          commands: typeof SnowmanExtensions !== 'undefined' && SnowmanExtensions.commands ? SnowmanExtensions.commands : {},
          mode: typeof SnowmanExtensions !== 'undefined' && SnowmanExtensions.mode ? SnowmanExtensions.mode : function() { return null; },
          toolbar: typeof SnowmanExtensions !== 'undefined' && SnowmanExtensions.toolbar ? SnowmanExtensions.toolbar : function() { return []; }
        },
        references: {
          parsePassageText: typeof SnowmanExtensions !== 'undefined' && SnowmanExtensions.parsePassageText ? SnowmanExtensions.parsePassageText : function() { return []; }
        }
      }
    }
  };
  
  window.storyFormat(storyFormat);
})();`;
} catch (error) {
  console.log('No twine extensions found, using basic JSONP format...', error.message);
  // Generate basic JSONP format without extensions
  format += `window.storyFormat(${JSON.stringify(story, null, 2)});`;
}
fs.writeFileSync('dist/format.js', format);

// Re-read format.js, replacing the editor code to create a malformed JSON.
// let compiledFormat = fs.readFileSync(`dist/format.js`, {'encoding': 'utf8'});
// compiledFormat = compiledFormat.replace("\"setup\":\"\"", `\"setup\": function(){${editorSource}}`);

// Re-write the format.js with editor code additions.
// fs.writeFileSync(`dist/format.js`, compiledFormat);
