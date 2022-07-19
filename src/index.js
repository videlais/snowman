// Require normalize.css.
import 'normalize.css';
// Require local CSS.
import './story.css';
// Require jQuery.
const $ = require('jquery');
// Setup global jQuery.
window.$ = $;
window.jQuery = $;
// Require Story.
const Story = require('./Story.js');
// Create new Story instance.
window.Story = new Story();
// Create global store shortcut.
window.s = window.Story.store;
// Start story.
window.Story.start();
