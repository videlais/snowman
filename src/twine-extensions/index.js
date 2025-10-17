import { mode } from './codemirror-mode';
import { commands } from './codemirror-commands';
import { toolbar } from './codemirror-toolbar';
import { parsePassageText } from './parse-references';

// The ___format module is bound to `this` in webpack.extensions.config.js
import hydratedFormat from '___format';

// Add editor extensions to the format
hydratedFormat.editorExtensions = {
  twine: {
    '^2.4.0-beta2': {
      codeMirror: { commands, mode, toolbar },
      references: { parsePassageText }
    }
  }
};