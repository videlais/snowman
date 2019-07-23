'use strict';
/* eslint-disable no-unused-vars */
var $ = window.$ = window.jQuery = require('jquery');
var _ = window._ = require('underscore');
var marked = window.marked = require('marked');
var Story = window.Story = require('./story');
var Passage = window.Passage = require('./passage');
var Window = require('./window');
/* eslint-enable no-unused-vars */

$(function() {
	window.story = new Story($('tw-storydata'));
	// Bind functions
	var binding = new Window();
	window.story.start($('#main'));
});
