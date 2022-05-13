/* eslint-disable no-unused-vars */
const polyfill = require('@babel/polyfill');
const $ = require('jquery');
const _ = require('underscore');
const Story = window.Story = require('./Story.js');
const Passage = window.Passage = require('./Passage.js');
require('./Misc.js');
/* eslint-enable no-unused-vars */

$(function () {
  window.story = new Story($('tw-storydata'));
  window.story.start($('tw-story'));
});
