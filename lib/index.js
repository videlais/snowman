/* eslint-disable no-unused-lets */
let polyfill = require("@babel/polyfill");
let $ = window.$ = window.jQuery = require('jquery');
let _ = window._ = require('underscore');
let marked = window.marked = require('marked');
let Story = window.Story = require('./Story.js');
let Passage = window.Passage = require('./Passage.js');
let Misc = require("./Misc.js");
// Map Misc functions to window
window.either = Misc.either;
window.hasVisited = Misc.hasVisited;
window.visited = Misc.visited;
window.renderToSelector = Misc.renderToSelector;
window.getStyles = Misc.getStyles;
/* eslint-enable no-unused-lets */

$(function() {
	window.story = new Story($('tw-storydata'));
	window.story.start($('tw-story'));
});
