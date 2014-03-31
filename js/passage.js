/**
 An object representing a single passage in the story. The passage currently
 being displayed is available as `window.passage`.

 @class Passage
 @constructor
**/

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

	this.source = source;
};

/**
 Returns an HTML-rendered version of this passage's source.

 @method render
 @return HTML source
**/

Passage.prototype.render = function()
{
	// run <%= eval %> and <% script %> first,
	// so any output from story.write() is run through this same process

	var rendered = this.source.replace(/&lt;%=((.|[\r\n])+?)%&gt;/gm,
	function (match, paren1)
	{
		return eval(_.unescape(paren1));
	});

	var self = this;

	var rendered = rendered.replace(/&lt;%((.|[\r\n])+?)%&gt;/gm,
	function (match, paren1)
	{
		self.writeBuffer = '';
		eval(_.unescape(paren1));
		return self.writeBuffer.trim();
	});

	rendered = window.marked(rendered);

	// [[displayed text|target]] links

	rendered = rendered.replace(/\[\[(.+?)\|(.+?)\]\]/g,
	                            '<a href="javascript:void(0)" data-passage="$2">$1</a>');

	// [[displayed text->target]] links

	rendered = rendered.replace(/\[\[(.+?)-&gt;(.+?)\]\]/g,
	                            '<a href="javascript:void(0)" data-passage="$2">$1</a>');

	// [[target<-displayed text]] links

	rendered = rendered.replace(/\[\[(.+?)&lt;-(.+?)\]\]/g,
	                            '<a href="javascript:void(0)" data-passage="$1">$2</a>');

	// [[target]] links

	rendered = rendered.replace(/\[\[(.+?)\]\]/g,
	                            '<a href="javascript:void(0)" data-passage="$1">$1</a>');

	return rendered;
};

/**
 Writes HTML to the current passage being rendered, as part of a
 `<% %>` block. Outside of a `<% %>`, this does nothing.

 @method write
 @param text {String} HTML text to write
**/

Passage.prototype.write = function (text)
{
	this.writeBuffer += text + ' ';
};

/**
 Writes an HTML rendering of a passage to the current passage being rendered,
 as part of a `<% %>` block. Outside of a `<% %>`, this does nothing.
 If the passage does not exist, an exception is raised.

 @method embed
 @param idOrName {String or Number} ID or name of the passage
**/

Passage.prototype.embed = function (idOrName)
{
	var passage = window.story.passage(idOrName);

	if (! passage)
		throw new Error('No passage with the ID or name ' + idOrName);

	this.writeBuffer += window.story.passage(idOrName).render() + ' ';
};
