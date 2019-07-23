/*
  Bind global functions to 'window'
*/

var $ = require('jquery');
var _ = require('underscore');
var Passage = require('./passage');

var Window = function() {

  // Borrowed from Protagonist
  // https://github.com/massivedanger/protagonist/blob/master/src/js/helpers.js#L136
  window.randomNumber = function(min, max, floating) {
    return _.random(min, max, floating);
  };

  // Borrowed from Protagonist
  // https://github.com/massivedanger/protagonist/blob/master/src/js/helpers.js#L127
  window.random = function() {
    if (arguments.length == 1) {
      return _.sample(arguments[0]);
    }
    else {
      return _.sample(arguments);
    }
  };

  /*
      Create a link

      Copied from Protagonist
      https://github.com/massivedanger/protagonist/blob/master/src/js/helpers.js#L54
  */
  window.link = function(text, attrs, passage) {

    var options = {};
    var attrs = attrs || null;
    var passage = passage || null;

    var link = $('<a></a>')
      .attr('href', 'javascript:void(0)')
      .html(text);

    var classes = [];
    var id = null;
    var classOrId = /([#\.])([^#\.]+)/g;

    if(attrs != null) {

      var matches = classOrId.exec(attrs);

      while (matches !== null) {
      		switch (matches[1]) {
      			case '#':
      				id = matches[2];
      				break;

      			case '.':
      				classes.push(matches[2]);
      				break;

      			default:
      				throw new Error("Don't know how to apply selector " + matches[0]);
      		}

      		matches = classOrId.exec(attrs);
      	}

      	if (id !== null) {
      		link.attr('id', id);
      	}

      	if (classes.length > 0) {
          link.addClass(classes.join(' '));
      	}

    }

    if(passage != null) {
      link.attr('data-passage', passage);
    }

    return link.prop('outerHTML');

  };

};

module.exports = Window;
