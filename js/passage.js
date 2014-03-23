function Passage (id, name, source)
{
	this.id = id;
	this.name = name;
	this.source = source;
};

Passage.prototype.render = function (el)
{
	return window.marked(this.source);
};
