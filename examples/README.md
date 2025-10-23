# 🎮 Snowman Interactive Examples

A complete browser-based live editor for Snowman story format development, featuring real-time Twee compilation and interactive examples.

## ✨ Features

### 🚀 Live Editor
- **Real-time compilation**: Write Twee code and see results instantly
- **Syntax highlighting**: Custom CodeMirror mode for Twee notation
- **Auto-compile mode**: Automatic compilation as you type (with debouncing)
- **Error validation**: Comprehensive error checking with helpful suggestions
- **Multiple formats**: Switch between Snowman 1.X, 2.X, and 3.X

### 📚 Example Library
- **Basic examples**: Story navigation, template tags, styling
- **Advanced examples**: Interactive fiction, data persistence, story events
- **Version-specific**: Showcase 2.X utility functions and enhanced features
- **One-click loading**: Load examples directly into the editor

### 🛠️ Technical Features
- **Browser-compatible Extwee**: Client-side Twee compilation using actual format.js files
- **No server required**: Runs entirely in the browser on GitHub Pages
- **Mobile responsive**: Works on desktop, tablet, and mobile devices
- **Progress tracking**: Shows passage count, word count, and compilation status

## 🗂️ File Structure

```
/examples/
├── index.html                    # Main examples gallery  
├── interactive-plan.html         # Implementation overview
├── live-editor.html              # 🚀 Main live editor application
├── lib/
│   ├── snowman-twee-compiler.js  # Browser-compatible Extwee implementation
│   ├── codemirror-twee-mode.js   # Custom Twee syntax highlighting
│   └── extended-examples.js      # Advanced example templates
└── 1x/
    ├── basic-story.html          # Pre-compiled example
    └── basic-story.twee          # Example source code
```

## 🚀 Quick Start

1. **Open the live editor**: Navigate to `/examples/live-editor.html`
2. **Choose a format**: Select Snowman 1.X, 2.X, or 3.X from the dropdown
3. **Load an example**: Click "📚 Load Example" to try pre-built templates
4. **Start coding**: Write Twee code in the left panel
5. **Compile & run**: Click "▶️ Compile & Run" or enable auto-compile mode

## 📖 Example Categories

### Basic Examples (All Versions)
- **Basic Story**: Simple navigation between passages
- **Template Tags**: JavaScript execution with `<% %>`, `<%= %>`, `<%- %>`
- **window.story Functions**: Core API usage and story manipulation
- **CSS Styling**: Custom styling and visual design

### Advanced Examples (All Versions)
- **Story Events**: Handling start.sm.story, show.sm.passage events
- **Data Persistence**: Saving/loading game state with localStorage
- **Interactive Fiction**: Complete game with player stats and choices

### Snowman 2.X Specific
- **Utility Functions**: either(), hasVisited(), visited(), getStyles(), renderToSelector()
- **Enhanced API**: Advanced features available only in 2.X

## 🔧 Technical Implementation

### Browser-Compatible Twee Compiler

The system includes a complete browser-compatible implementation of Extwee functionality:

```javascript
// Load a Snowman format.js file
const compiler = new SnowmanTweeCompiler();
await compiler.loadFormat('../builds/2.X/format.js');

// Compile Twee source to HTML
const html = compiler.compile(tweeSource, {
    name: 'My Story',
    startPassage: 'Start'
});
```

### Key Components

1. **SnowmanTweeCompiler**: Parses Twee notation and compiles with format.js
2. **CodeMirror Integration**: Syntax highlighting and advanced editing features  
3. **Error Validation**: Checks for common Twee syntax errors
4. **Format Switching**: Dynamic loading of different Snowman versions

### Twee Syntax Support

- ✅ Passage headers: `:: PassageName [tags]`
- ✅ Story links: `[[text->target]]` and `[[target]]`
- ✅ Template tags: `<% code %>`, `<%= value %>`, `<%- escaped %>`
- ✅ Markdown syntax: Headers, bold, italic
- ✅ HTML and CSS: Inline styles and custom classes
- ✅ JavaScript: Full JavaScript support in template tags

## 🎯 Use Cases

### For Documentation
- **Live examples**: Show actual working code alongside documentation
- **Interactive tutorials**: Let users experiment with concepts immediately  
- **Version comparison**: Demonstrate differences between Snowman versions

### For Development
- **Rapid prototyping**: Quickly test ideas without setting up build tools
- **Learning**: Safe environment to experiment with Snowman features
- **Debugging**: Isolate and test specific functionality

### For Teaching
- **Workshops**: Interactive coding sessions
- **Tutorials**: Step-by-step guided examples
- **Assignments**: Provide templates students can modify

## 🌟 Advanced Features

### Auto-Compile Mode
Automatically compiles your story as you type (with 1-second debounce):

```javascript
// Enable auto-compile
this.autoCompile = true;
this.editor.on('change', () => {
    if (this.autoCompile) {
        this.debounceCompile();
    }
});
```

### Error Handling
Comprehensive validation with helpful error messages:

- Syntax validation for passage headers
- Template tag validation
- Link format checking
- Missing passage detection
- JavaScript error reporting

### Format Detection
Automatically detects and warns about version-specific features:

```javascript
// Check for 2.X utility functions
if (typeof either !== 'undefined') {
    // 2.X features available
} else {
    // Show compatibility warning
}
```

## 🚀 Deployment

The system is designed to work seamlessly on GitHub Pages:

1. **No build process**: Pure client-side JavaScript
2. **CDN dependencies**: CodeMirror loaded from CDN
3. **Relative paths**: All references use relative URLs
4. **Format.js integration**: Uses actual Snowman build files

## 🔮 Future Enhancements

### Planned Features
- **Share functionality**: URL-encoded story sharing
- **Export options**: Download compiled HTML files
- **Snippet library**: Reusable code snippets
- **Collaborative editing**: Real-time collaboration features
- **Mobile editor**: Enhanced mobile experience
- **Plugin system**: Extensible architecture for custom features

### Technical Improvements
- **Better error messages**: More specific syntax error reporting
- **Performance optimization**: Faster compilation for large stories
- **Memory management**: Better cleanup of compiled stories
- **Accessibility**: Enhanced screen reader support

## 📈 Success Metrics

The interactive examples system provides:

- **📚 10+ curated examples** covering all major Snowman features
- **🔄 Real-time compilation** with sub-second response times  
- **🎯 Version-specific content** highlighting differences between 1.X and 2.X
- **📱 Mobile-responsive design** working across all devices
- **🛠️ Developer-friendly** with comprehensive error handling

## 🏆 Conclusion

This browser-based Extwee implementation successfully delivers:

✅ **Real-time interactive examples** - Users can edit and see results immediately  
✅ **No server requirements** - Runs entirely client-side on GitHub Pages  
✅ **Full Snowman compatibility** - Uses actual format.js files from all versions  
✅ **Educational value** - Perfect for learning and teaching Snowman development  
✅ **Production ready** - Comprehensive error handling and user feedback  

The system transforms static documentation into an interactive learning experience, making Snowman more accessible to new users while providing a powerful prototyping tool for experienced developers.

---

**Ready to explore?** [🚀 Launch the Live Editor](live-editor.html) and start creating interactive stories!