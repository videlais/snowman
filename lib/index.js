import $ from 'jquery';
import _ from 'underscore';
import Story from './Story.js';
import Passage from './Passage.js';
import either from './Misc/either.js';
import hasVisited from './Misc/hasVisited.js';
import visited from './Misc/visited.js';
import getStyles from './Misc/getStyles.js';
import renderToSelector from './Misc/renderToSelector.js';

// Because this will be processed by Webpack, we can import CSS directly.
import './src/a.css';
import './src/b.css';

// Because this is a browser-targeted bundle, we can set up
// some global variables for easier access in other modules.

// Set up global variables
window.$ = window.jQuery = $;
window._ = _;
window.Story = Story;
window.Passage = Passage;

// Setup additional libraries
window.either = either;
window.hasVisited = hasVisited;
window.visited = visited;
window.getStyles = getStyles;
window.renderToSelector = renderToSelector;

// When the browser is ready, start the story.
$(function() {
	window.story = new Story();
	window.story.start();
});
