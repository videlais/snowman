/**
 An object representing a single passage in the story. The passage currently
 being displayed is available as `window.passage`.
 @class Passage
 @constructor
**/

import _ from 'underscore';
import { marked } from 'marked';
import jQuery from 'jquery';

/**
 Our rendering engine. This is available externally as Passage.render(),
 as well as on Passage instances.
 @method render
 @return HTML source
**/

function render(source) {
	/* See below for the definition of readyFunc. */

	var result = _.template(source)({ s: window.story.state, $: readyFunc });

	/*
	Transform class, ID, hidden, and link shorthands in HTML tags.

	<a-0.class#id> becomes
	<a href="javascript:void(0)" style="display: none" class="class" id="id">
	*/

	result = result.replace(
		/<([a-z]+)([.#\-0].*?)(?=[\s>])/gi,
		function(match, tagName, attrs) {
			return '<' + tagName + ' ' + renderAttrs(attrs);
		}
	);

	/* [[links]] */

	result = result.replace(/\[\[(.*?)\]\]/g, function(match, target) {
		var display = target;

		/* display|target format */

		var barIndex = target.indexOf('|');

		if (barIndex != -1) {
			display = target.substr(0, barIndex);
			target = target.substr(barIndex + 1);
		}
		else {
			/* display->target format */

			var rightArrIndex = target.indexOf('->');

			if (rightArrIndex != -1) {
				display = target.substr(0, rightArrIndex);
				target = target.substr(rightArrIndex + 2);
			}
			else {
				/* target<-display format */

				var leftArrIndex = target.indexOf('<-');

				if (leftArrIndex != -1) {
					display = target.substr(leftArrIndex + 2);
					target = target.substr(0, leftArrIndex);
				}
			}
		}

		/* Does this look like an external link? */

		if (/^\w+:\/\/\/?\w/i.test(target)) {
			return '<a href="' + target + '">' + display + '</a>';
		}
		else {
			return '<a href="javascript:void(0)" data-passage="' +
				_.escape(target) + '">' + display + '</a>';
		}
	});

	return marked.parse(result, { breaks: false, gfm: true });
};

/**
 A helper function that converts markup like #id.class into HTML
 attributes.
 @method renderAttrs
 @private
 @param {String} attrs an attribute shorthand, i.e. #myId.className. There are
 	two special leading prefixes: - (minus) will hide an element, and 0 will
	give it a href property that does nothing.
 @return {String} HTML source code
**/

function renderAttrs(attrs) {
	var result = '';

	for (var i = 0; attrs[i] === '-' || attrs[i] === '0'; i++) {
		switch (attrs[i]) {
			case '-':
				result += 'style="display:none" ';
				break;

			case '0':
				result += 'href="javascript:void(0)" ';
				break;
		}
	}

	var classes = [];
	var id = null;
	var classOrId = /([#.])([^#.]+)/g;
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
		result += 'id="' + id + '" ';
	}

	if (classes.length > 0) {
		result += 'class="' + classes.join(' ') + '"';
	}

	return result.trim();
}

/**
 A helper function that is connected to passage templates as $. It acts
 like the jQuery $ function, running a script when the passage is ready in
 the DOM. The function passed is also bound to div#passage for convenience.

 If this is *not* passed a single function, then this acts as a passthrough
 to jQuery's native $ function.

 @function readyFunc
 @return jQuery object, as with jQuery()
 @private
**/

function readyFunc() {
	if (arguments.length == 1 && typeof arguments[0] == 'function') {
		return jQuery(window).one(
			'shown.sm.passage',
			_.bind(arguments[0], jQuery('#passage'))
		);
	}
	else {
		return jQuery.apply(window, arguments);
	}
}

var Passage = function(id, name, tags, source) {
	/**
	 The numeric ID of the passage.
	 @property name
	 @type Number
	 @readonly
	**/

	this.id = id;

	/**
	 The name of the passage.
	 @property name
	 @type String
	**/

	this.name = name;

	/**
	 The tags of the passage.
	 @property tags
	 @type Array
	**/

	this.tags = tags;

	/**
	 The passage source code.
	 @property source
	 @type String
	**/

	this.source = source;
};

/**
 Static renderer, which will render any string passed to it as HTML. See
 Passage.render()'s instance method for a description of what exactly it does.
 @method render
 @static
 @return HTML source
**/
Passage.render = render;

_.extend(Passage.prototype, {
	/**
	 Returns an HTML-rendered version of this passage's source. This
	 first runs the source code through the Underscore template parser,
	 then runs the result through a Markdown renderer, and then finally
	 converts bracketed links to passage links.
	 @method render
	 @return HTML source
	**/

	render: function() {
		return render(_.unescape(this.source));
	}
});

export default Passage;
