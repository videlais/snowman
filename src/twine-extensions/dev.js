import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import { mode } from './codemirror-mode';
import { parsePassageText } from './parse-references';

// Define the Snowman mode
CodeMirror.defineMode('snowman', mode);

// Initialize CodeMirror
const textarea = document.querySelector('#source');
const cm = CodeMirror.fromTextArea(textarea, {
  lineNumbers: true,
  lineWrapping: true,
  mode: 'snowman',
  theme: 'default',
  tabSize: 2,
  indentWithTabs: false,
  showCursorWhenSelecting: true
});

// Function to update passage references
function updateReferences() {
  const text = cm.getValue();
  const references = parsePassageText(text);
  const referencesList = document.querySelector('#references');
  
  referencesList.innerHTML = references
    .map(ref => `<li>${ref}</li>`)
    .join('');
}

// Update references when content changes
cm.on('change', updateReferences);

// Initial update
updateReferences();

// Expose CodeMirror instance globally for testing
window.cm = cm;

console.log('Snowman CodeMirror extensions loaded successfully!');