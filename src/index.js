// Require normalize.css
import 'normalize.css';
// Require local CSS
import './story.css';
// Require Story
const Story = require('./Story.js');
// Create window.passage
window.passage = null;
// Create new Story instance
window.story = new Story();
// Start story
window.story.start();
