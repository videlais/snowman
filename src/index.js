import $ from 'jquery';
import _ from 'underscore';
import { marked } from 'marked';
import Story from './story.js';
import Passage from './passage.js';

// Make libraries available globally for browser compatibility
window.$ = window.jQuery = $;
window._ = _;
window.marked = marked;
window.Story = Story;
window.Passage = Passage;

$(function() {
	window.story = new Story($('tw-storydata'));
	window.story.start($('#main'));
});
