function Passage (id, name, source)
{
	this.id = id;
	this.name = name;
	this.source = source;
};

Passage.prototype.render = function()
{
	// run <<script>> first, so any output from story.write()
	// is run through this same process

	var rendered = this.source.replace(/&lt;&lt;((.|[\r\n])+?)&gt;&gt;/gm,
	function (match, paren1, paren2, offset, string)
	{
		window.story.writeResult = '';
		eval(_.unescape(paren1));
		return window.story.writeResult.trim();
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
