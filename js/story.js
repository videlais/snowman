function Story (el)
{
	// set up basic properties

	this.el = el;
	this.name = el.attr('data-name');
	this.startPassage = parseInt(el.attr('data-startnode'));
	this.creator = el.attr('data-creator');
	this.creatorVersion = el.attr('data-creator-version');

	// create passage objects

	this.passages = [];

	var p = this.passages;

	el.children('*[data-role="passage"]').each(function (el)
	{
		var $t = $(this);
		p[$t.attr('data-id')] = new Passage($t.attr('data-id'), $t.attr('data-name'), $t.html());
	});

	// TODO: set up stylesheet and script
};

Story.prototype.passage = function (idOrName)
{
	if (_.isNumber(idOrName))
		return this.passages[idOrName];
	else if (_.isString(idOrName))
		return _.findWhere(this.passages, { name: idOrName });
};

Story.prototype.show = function (idOrName)
{
	$('#passage').html(this.passage(idOrName).render());
};

Story.prototype.write = function (text)
{
	this.writeResult += text + ' ';
};

Story.prototype.embed = function (idOrName)
{
	this.writeResult += this.passage(idOrName).render() + ' ';
};
