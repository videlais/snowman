const $ = require('jquery');
const _ = require('underscore');

/**
 * Return random entry in an array.
 *
 * @function either
 * @returns {object} Entry - The object randomly selected
 */
window.either = function () {
  const tempArray = [];
  let tPosition = 0;

  for (let i = 0; i < arguments.length; i++) {
    if (!(arguments[i] instanceof Array)) {
      tempArray.push(arguments[i]);
    } else {
      for (let k = 0; k < arguments[i].length; k++) {
        tempArray.push(arguments[i][k]);
      }
    }
  }

  tPosition = _.random(tempArray.length - 1);
  return tempArray[tPosition];
};

/**
 * Return if passage(s) appear in history.
 *
 * @function hasVisited
 * @returns {boolean|Array} Boolean or Array of Boolean values
 */
window.hasVisited = function () {
  let p = null;

  if (arguments.length === 1) {
    p = window.story.passage(arguments[0]);

    if (p != null) {
      return window.story.history.includes(p.id);
    } else {
      return false;
    }
  } else {
    for (let i = 0; i < arguments.length; i++) {
      p = window.story.passage(arguments[i]);

      if (p === null || window.story.history.includes(p.id) === false) {
        return false;
      }
    }

    return true;
  }
};

/**
 * Return number of times a passage appears in history.
 * For an array of passage names, return an array of visits.
 *
 * @function visited
 * @returns {number|Array} - Visit number or Array of visit numbers
 */
window.visited = function () {
  const counts = [];
  let count = [];

  for (let i = 0; i < arguments.length; i++) {
    const p = window.story.passage(arguments[i]);

    if (p !== null) {
      count = window.story.history.filter((id) => {
        return id === p.id;
      });
    }

    counts.push(count.length);
  }

  return Math.min(...counts);
};

/**
 * Render a passage to any/all element(s) matching query selector
 *
 * @function renderToSelector
 * @param {string} selector - HTML Query selector
 * @param {object} passage - The passage to render
 */
window.renderToSelector = function (selector, passage) {
  const p = window.story.passage(passage);

  if (p !== null) {
    $(selector).html(p.render());
  }
};

/**
 * Retrieve and apply external CSS files
 *
 * @function getStyles
 * @returns {void} - Returns nothing
 */
window.getStyles = function () {
  return $.when.apply($,
    $.map(arguments, function (url) {
      return $.get(url, function (css) {
        $('<style>' + css + '</style>').appendTo('head');
      });
    })
  );
};
