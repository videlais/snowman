// Require normalize.css
import 'normalize.css';
// Require local CSS
import './story.css';
// Require jQuery
const $ = require('jquery');
// Setup global jQuery
window.$ = $;
window.jQuery = $;
// Require Underscore
const _ = require('underscore');
// Setup global underscore
window._ = _;
// Require Story
const Story = require('./Story.js');
// Create window.passage
window.passage = null;
// Create new Story instance
window.story = new Story();
// Start story
window.story.start();
