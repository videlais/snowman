// extension to help editing of snowman in twine

var smMode = require('./mode-markdown-ptemplate');

var editorExtensions = {
  twine: {
    '^2.4.0-alpha1': {
      codeMirror: {
        mode: smMode
      }
    }
  }
};

// TODO the right one of
// module.exports = { editorExtensions };
this.editorExtensions = editorExtensions;
