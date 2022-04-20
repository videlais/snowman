/**
 * Return random entry in an array.
 *
 * @function either
 * @param {...any} arg One or more items
 * @returns {object} Entry - The object randomly selected
 */
window.either = function (arg) {
  var tempArray = [];
  var tPosition = 0;

  for (var i = 0; i < arguments.length; i++) {
    if (!(arguments[i] instanceof Array)) {
      tempArray.push(arguments[i]);
    } else {
      for (var k = 0; k < arguments[i].length; k++) {
        tempArray.push(arguments[i][k]);
      }
    }
  }

  tPosition = _.random(tempArray.length - 1);
  return tempArray[tPosition];
};

/**
 * Return if all passage(s) appear in history.
 *
 * @function hasVisited
 * @param {...(string|number)} passage One or more passage names or ids
 * @returns {boolean} Boolean
 **/
window.hasVisited = function (passage) {
  var p = null;

  if (arguments.length === 1) {
    p = window.story.passage(arguments[0]);

    if (p != null) {
      return window.story.history.includes(p.id);
    } else {
      return false;
    }
  } else {
    for (var i = 0; i < arguments.length; i++) {
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
 * For an array of passage names, return the minimum of visits.
 *
 * @function visited
 * @param {...(string|number)} passage One or more passage names or ids
 * @returns {number} - Visit number
 **/
window.visited = function (passage) {
  var counts = [];
  var count = [];

  for (var i = 0; i < arguments.length; i++) {
    var p = window.story.passage(arguments[i]);

    if (p !== null) {
      count = window.story.history.filter(function (id) {
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
 * @param {string|number} passage - The passage to render
 **/
window.renderToSelector = function (selector, passage) {
  var p = window.story.passage(passage);

  if (p !== null) {
    $(selector).html(p.render());
  }
};

/**
 * Retrieve and apply external CSS files
 *
 * @function getStyles
 * @returns {void} - Returns nothing
 **/
window.getStyles = function () {
  return $.when.apply($,
    $.map(arguments, function (url) {
      return $.get(url, function (css) {
        $('<style>' + css + '</style>').appendTo('head');
      });
    })
  );
};
