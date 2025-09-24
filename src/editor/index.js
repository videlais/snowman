import { createSnowmanEditor, snowmanMode } from '../lib/snowman-mode.js';

(function () {
  // Initialize Snowman CodeMirror mode
  let editorInstance = null;

  // Create toolbar element
  const toolbar = document.createElement('div');
  toolbar.className = 'snowman-editor-toolbar';
  toolbar.innerHTML = `
    <div class="toolbar-section">
      <button class="toolbar-btn" data-action="bold" title="Bold">B</button>
      <button class="toolbar-btn" data-action="italic" title="Italic">I</button>
      <button class="toolbar-btn" data-action="link" title="Insert Link">🔗</button>
      <button class="toolbar-btn" data-action="code" title="Code">{ }</button>
    </div>
    <div class="toolbar-section">
      <span class="toolbar-label">Snowman + Markdown Editor</span>
    </div>
  `;

  // Add toolbar styles
  const toolbarStyles = document.createElement('style');
  toolbarStyles.textContent = `
    .snowman-editor-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-bottom: none;
      padding: 8px 12px;
      border-radius: 4px 4px 0 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .toolbar-section {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .toolbar-btn {
      background: white;
      border: 1px solid #ccc;
      border-radius: 3px;
      padding: 4px 8px;
      cursor: pointer;
      font-size: 12px;
      font-weight: bold;
    }
    .toolbar-btn:hover {
      background: #e9e9e9;
    }
    .toolbar-label {
      font-size: 12px;
      color: #666;
      font-weight: 500;
    }
  `;
  document.head.appendChild(toolbarStyles);

  // Toolbar button handlers
  function handleToolbarAction(action, editor) {
    const state = editor.state;
    const selection = state.selection.main;
    
    switch (action) {
      case 'bold':
        editor.dispatch({
          changes: {
            from: selection.from,
            to: selection.to,
            insert: `**${state.doc.sliceString(selection.from, selection.to)}**`
          }
        });
        break;
      case 'italic':
        editor.dispatch({
          changes: {
            from: selection.from,
            to: selection.to,
            insert: `*${state.doc.sliceString(selection.from, selection.to)}*`
          }
        });
        break;
      case 'link':
        const linkText = state.doc.sliceString(selection.from, selection.to) || 'Link Text';
        editor.dispatch({
          changes: {
            from: selection.from,
            to: selection.to,
            insert: `[${linkText}](URL)`
          }
        });
        break;
      case 'code':
        editor.dispatch({
          changes: {
            from: selection.from,
            to: selection.to,
            insert: `\`${state.doc.sliceString(selection.from, selection.to)}\``
          }
        });
        break;
    }
  }

  // Watch the body for the loading of CodeMirror
  const targetNode = document.querySelector('body');
  const config = { attributes: false, childList: true, subtree: true };

  const observer = new MutationObserver(function (mutationList, observer) {
    for (const mutation of mutationList) {
      const target = mutation.target;
      
      // Look for CodeMirror textarea or passage editor
      if (target.className && (
          target.className.includes('CodeMirror') || 
          target.className.includes('passage-text-editor') ||
          target.tagName === 'TEXTAREA'
        )) {
        
        // Find the appropriate container
        let container = target.closest('.passage-editor, .cm-editor') || 
                      document.querySelector('.passageTags')?.parentElement ||
                      target.parentElement;
        
        if (container && !container.querySelector('.snowman-editor-toolbar')) {
          // Add toolbar
          container.insertBefore(toolbar, container.firstChild);
          
          // Initialize CodeMirror if we have a textarea
          const textarea = container.querySelector('textarea');
          if (textarea && !editorInstance) {
            const editorContainer = document.createElement('div');
            textarea.parentElement.insertBefore(editorContainer, textarea.nextSibling);
            textarea.style.display = 'none';
            
            editorInstance = createSnowmanEditor(editorContainer, textarea.value, {
              extensions: [{
                key: 'Cmd-s', 
                run: () => {
                  textarea.value = editorInstance.state.doc.toString();
                  textarea.dispatchEvent(new Event('input'));
                  return true;
                }
              }]
            });
            
            // Sync changes back to textarea
            editorInstance.dom.addEventListener('input', () => {
              textarea.value = editorInstance.state.doc.toString();
              textarea.dispatchEvent(new Event('input'));
            });
          }
          
          // Add toolbar event listeners
          toolbar.addEventListener('click', (e) => {
            if (e.target.classList.contains('toolbar-btn')) {
              const action = e.target.dataset.action;
              if (editorInstance) {
                handleToolbarAction(action, editorInstance);
              }
            }
          });
          
          break;
        }
      }
    }
  });

  // Start observing
  observer.observe(targetNode, config);

  // Export for global access
  window.SnowmanEditor = {
    mode: snowmanMode,
    createEditor: createSnowmanEditor,
    getInstance: () => editorInstance
  };
})();
