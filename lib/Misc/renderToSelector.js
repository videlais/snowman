const $ = require("jquery");

/**
 * renderToSelector - Renders a passage to a selector.
 * @file Misc.js
 * @function
 * @param {string} selector - The selector to render the passage to. 
 * @param {*} passage - The passage to render.
 * @returns {void}
 * @example
 * // Renders a passage to a selector.
 * renderToSelector("#passage", "Example");
 */
function renderToSelector (selector, passage) {

    const p = window.story.passage(passage);
  
    if(p != null) {
      $(selector).html(p.render());
    }
}

module.exports = renderToSelector;