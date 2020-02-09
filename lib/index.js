/* eslint-disable no-unused-vars */
var polyfill = require('@babel/polyfill');
var $ = window.$ = window.jQuery = require('jquery');
var _ = window._ = require('underscore');
var marked = window.marked = require('marked');
var Story = window.Story = require('./Story.js');
var Passage = window.Passage = require('./Passage.js');
require('./Misc.js');
/* eslint-enable no-unused-vars */

$(function () {
  window.story = new Story($('tw-storydata'));
  window.story.start($('tw-story'));
});
