/* eslint-disable no-unused-lets */
let polyfill = require("@babel/polyfill");
let $ = window.$ = window.jQuery = require('jquery');
let _ = window._ = require('underscore');
let marked = window.marked = require('marked');
let Story = window.Story = require('./Story.js');
let Passage = window.Passage = require('./Passage.js');
//let Misc = require("./Misc/index.js");
window.either = require('./Misc/either.js');
window.hasVisited = require('./Misc/hasVisited.js');
window.visited = require('./Misc/visited.js');
window.getStyles = require('./Misc/getStyles.js');
window.renderToSelector = require('./Misc/renderToSelector.js');
/* eslint-enable no-unused-lets */

$(function() {
	window.story = new Story();
	window.story.start();
});
