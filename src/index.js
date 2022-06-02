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
// Create story state
window.story.state = {};
// Start story
window.story.start();
