/**
 * either - Randomly selects a value from a list of values.
 * @file Misc.js
 * @function
 * @returns {string} - A randomly selected value from the list of values passed to it.
 * @example
 * // Returns one of the values passed to it
 * either("A", "B", "C", "D");
 * @example
 * // Returns one of the values passed to it
 * either("A", "B", "C", "D", ["E", "F"]);
 */
function either() {

  var tempArray = [];
  var tPosition = 0;

  for(var i = 0; i < arguments.length; i++) {

    if(!(arguments[i] instanceof Array) ) {

      tempArray.push(arguments[i]);

    } else {

      for(var k = 0; k < arguments[i].length; k++) {
        tempArray.push(arguments[i][k]);
      }
    }
  }

  tPosition = _.random(tempArray.length - 1);
  return tempArray[tPosition];

};

/**
 * hasVisited - Checks if a passage has been visited.
 * @file Misc.js
 * @function
 * @param {number} - The ID of the passage to check.
 * @returns {boolean} - Returns true if the passage has been visited, false if it has not.
 */
function hasVisited () {

  // Perform sanity check: if no arguments are passed, return false.
  if(arguments.length == 0) {
    return false;
  }

  // Perform sanity check: if window.story is not defined, return false.
  if(typeof window.story == 'undefined') {
    return false;
  }

  // Perform sanity check: if window.story.history is not defined, return false.
  if(typeof window.story.history == 'undefined') {
    return false;
  }

  // Perform sanity check: if window.story.passage is not defined, return false.
  if(typeof window.story.passage == 'undefined') {
    return false;
  }

  var p = null;

  if(arguments.length == 1) {

    p = window.story.passage(arguments[0]);

    if(p != null) {

      return window.story.history.includes(p.id);

    } else {

      return false;
    }

  } else {

    for(var i = 0; i < arguments.length; i++) {

      p = window.story.passage(arguments[i]);

      if(p == null || window.story.history.includes(p.id) == false) {
        return false;
      }

    }

    return true;

  }

};

/**
 * visited - Returns the number of times a passage has been visited.
 * @function
 * @file Misc.js
 * @param {number} - The ID of the passage to check. 
 * @returns {number} - The number of times the passage has been visited.
 * @example
 * // Returns the number of times the passage with the ID of 1 has been visited.
 * visited(1);
 * @example
 * // Returns the number of times the passage with the ID of 1 has been visited.
 * visited(1, 2, 3);
 */
function visited () {

  // Perform sanity check: if no arguments are passed, return 0.
  if(arguments.length == 0) {
    return 0;
  }

  // Perform sanity check: if window.story is not defined, return 0.
  if(typeof window.story == 'undefined') {
    return 0;
  }

  // Perform sanity check: if window.story.history is not defined, return 0.
  if(typeof window.story.history == 'undefined') {
    return 0;
  }

  let counts = [];
  let count = [];

  for(var i = 0; i < arguments.length; i++) {

    var p = window.story.passage(arguments[i]);

    if( p != null) {

      count = window.story.history.filter(function(id) {

        return id == p.id;

      });

    }

    counts.push(count.length);

  }

  return Math.min(...counts);

};


/**
 * renderToSelector - Renders a passage to a selector.
 * @file Misc.js
 * @function
 * @param {string} selector - The selector to render the passage to. 
 * @param {*} passage - The passage to render.
 * @returns {void}
 * @example
 * // Renders a passage to a selector.
 * renderToSelector("#passage", 1);
 */
function renderToSelector (selector, passage) {

  var p = window.story.passage(passage);

  if(p != null) {

    $(selector).html(p.render());

  }

};

/**
 * getStyles - Loads CSS files into the DOM.
 * @file Misc.js
 * @function
 * @param {string} - The URL of the CSS file to load.
 * @returns {void}
 */
function getStyles () {

  // Perform sanity check: if no arguments are passed, return.
  if(arguments.length == 0) {
    return;
  }

  // Perform sanity check: if window.$ or $ is not defined, return.
  if(typeof window.$ == 'undefined' || typeof $ == 'undefined') {
    return;
  }

  return $.when.apply($,
        $.map(arguments, function(url) {
            return $.get(url, function(css) {
                $("<style>" + css + "</style>").appendTo("head");
            });
        })
    );
};

// Export the functions
module.exports = {
  either: either,
  hasVisited: hasVisited,
  visited: visited,
  renderToSelector: renderToSelector,
  getStyles: getStyles
};