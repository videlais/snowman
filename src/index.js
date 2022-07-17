// Require normalize.css
import 'normalize.css';
// Require local CSS
import './story.css';
// Require jQuery
const $ = require('jquery');
// Setup global jQuery
window.$ = $;
window.jQuery = $;
// Require Story
const Story = require('./Story.js');
// Create new Story instance
window.story = new Story();
// Start story
window.story.start();
