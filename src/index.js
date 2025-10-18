// Require normalize.css.
import 'normalize.css';
// Require local CSS.
import './story.css';
// Require jQuery.
const $ = require('jquery');
// Setup global jQuery.
globalThis.$ = $;
globalThis.jQuery = $;
// Require Story.
const Story = require('./Story.js');
// Create new Story instance.
globalThis.Story = new Story();
// Create global store shortcut.
globalThis.s = globalThis.Story.store;
// Start story.
globalThis.Story.start();
