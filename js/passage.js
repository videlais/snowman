/**
 An object representing a single passage in the story. The passage currently
 being displayed is available as `window.passage`.

 @class Passage
 @constructor
**/

'use strict';

function Passage (id, name, source)
{
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
	 The passage source code.
	 @property source
	 @type String
	**/

	this.source = _.unescape(source);
};

_.extend(Passage.prototype,
{
	/**
	 Returns an HTML-rendered version of this passage's source. This
	 first runs the source code through the Underscore template parser,
	 then runs the result through a Markdown renderer, and then finally
	 converts bracketed links to passage links.

	 @method render
	 @return HTML source
	**/

	render: function()
	{
		// we have to temporarily disable window.print, as it
		// interferes with Underscore's template print function

		var result = _.template(_.unescape(this.source), { s: window.story.state });

		result = result.replace(/\[\[(.*?)\]\]/g, function (match, target)
		{
			var display = target;

			// display|target format

			var barIndex = target.indexOf('|');

			if (barIndex != -1)
			{
				display = target.substr(0, barIndex);
				target = target.substr(barIndex + 1);
			}
			else
			{
				// display->target format

				var rightArrIndex = target.indexOf('->');

				if (rightArrIndex != -1)
				{
					display = target.substr(0, rightArrIndex);
					target = target.substr(rightArrIndex + 2);
				}
				else
				{
					// target<-display format

					var leftArrIndex = target.indexOf('<-');

					if (leftArrIndex != -1)
					{
						display = target.substr(leftArrIndex + 2);
						target = target.substr(0, leftArrIndex);
					}
				};
			};

			// does this look like an external link? 

			if (/^\w+:\/\/\/?\w/i.test(target))
				return '<a href="' + target + '">' + display + '</a>';
			else
				return '<a href="javascript:void(0)" data-passage="' + _.escape(target) + '">' + display + '</a>';
		});

		return marked(result);
	}
});
