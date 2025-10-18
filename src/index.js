// Require normalize.css.
import 'normalize.css';
// Require local CSS.
import './story.css';
// Import Story.
import Story from './Story.js';
// Require jQuery for end-user story scripts.
import $ from 'jquery';
// Setup global jQuery for story creators.
globalThis.$ = $;
globalThis.jQuery = $;
// Create new Story instance.
globalThis.Story = new Story();
// Create global store shortcut.
globalThis.s = globalThis.Story.store;
// Start story.
globalThis.Story.start();
