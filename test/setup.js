// Jest setup file
// This file sets up the testing environment for Jest

import $ from 'jquery';
import _ from 'underscore';
import { marked } from 'marked';
import Story from '../src/story.js';
import Passage from '../src/passage.js';

// Set up global variables that are expected by the tests
global.$ = $;
global.jQuery = $;
global._ = _;

// Set up marked properly for the new API
global.marked = marked;

// Mock window.location for tests that manipulate the hash
// Note: JSDOM handles location well enough for our tests

// Make Story and Passage available globally (as they would be in the browser)
global.Story = Story;
global.Passage = Passage;