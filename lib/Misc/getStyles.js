const $ = require('jquery');

/**
 * getStyles - Loads CSS files into the DOM.
 * @file Misc.js
 * @function
 * @param {string} - The URL of the CSS file to load.
 * @returns {null|Promise} - Returns a Promise if the function is successful, otherwise null.
 */
function getStyles () {

    // Perform sanity check: if no arguments are passed, return.
    if(arguments.length == 0) {
      return null;
    }
  
    // Perform sanity check: if window.document is not defined, return.
    if(typeof window.document == 'undefined') {
      throw new TypeError("window.document is not defined.");
    }
  
    return $.when.apply($,
          $.map(arguments, function(url) {
              return $.get(url, function(css) {
                  $("<style>" + css + "</style>").appendTo("head");
              });
          })
      );
}

module.exports = getStyles;
