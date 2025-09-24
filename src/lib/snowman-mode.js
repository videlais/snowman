/**
 * CodeMirror mode for Snowman story format with markdown support
 * Provides syntax highlighting for Snowman passages containing markdown
 */

import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { markdown } from '@codemirror/lang-markdown';
import { basicSetup } from 'codemirror';

/**
 * Creates a CodeMirror editor instance with Snowman/markdown support
 * @param {HTMLElement} parent - The parent element to attach the editor to
 * @param {string} initialContent - Initial content for the editor
 * @param {Object} options - Additional configuration options
 * @returns {EditorView} The CodeMirror editor instance
 */
export function createSnowmanEditor(parent, initialContent = '', options = {}) {
  const extensions = [
    basicSetup,
    markdown(),
    EditorView.theme({
      '&': {
        fontSize: '14px',
        border: '1px solid #ddd',
        borderRadius: '4px'
      },
      '.cm-content': {
        padding: '10px',
        minHeight: '200px'
      },
      '.cm-focused': {
        outline: 'none',
        borderColor: '#0066cc'
      },
      // Snowman-specific styling
      '.cm-snowman-link': {
        color: '#0066cc',
        textDecoration: 'underline'
      },
      '.cm-snowman-variable': {
        color: '#d73a49',
        fontWeight: 'bold'
      },
      '.cm-snowman-comment': {
        color: '#6a737d',
        fontStyle: 'italic'
      }
    }),
    ...(options.extensions || [])
  ];

  const state = EditorState.create({
    doc: initialContent,
    extensions
  });

  return new EditorView({
    state,
    parent
  });
}

/**
 * Enhanced mode for Snowman syntax within markdown
 * This extends the markdown mode to recognize Snowman-specific constructs
 */
export const snowmanMode = {
  name: 'snowman',
  
  /**
   * Initialize the mode
   */
  init() {
    // Register custom highlighting for Snowman constructs
    return {
      mode: 'markdown',
      highlightFormatting: true,
      taskLists: true,
      strikethrough: true,
      emoji: true,
      // Custom token types for Snowman
      tokenTypeOverrides: {
        // Snowman links: [[Link text]]
        'snowman-link': 'cm-snowman-link',
        // Snowman variables: <%s.variable%>
        'snowman-variable': 'cm-snowman-variable',
        // Snowman comments: <%-- comment --%>
        'snowman-comment': 'cm-snowman-comment'
      }
    };
  }
};

// Export default configuration for Twine integration
export default {
  mode: snowmanMode,
  createEditor: createSnowmanEditor
};