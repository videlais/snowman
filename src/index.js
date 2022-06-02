// Require normalize.css
import 'normalize.css';
// Require local CSS
import './story.css';
// Require jQuery
const $ = require('jquery');
// Require Story
const Story = require('./Story.js');
// Setup global jQuery
window.$ = $;
// Create window.passage
window.passage = null;
// Create new Story instance
window.story = new Story();
// Start story
window.story.start();
