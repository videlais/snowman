function Story (el)
{
	// set up basic properties

	this.el = el;
	this.name = el.attr('data-name');
	this.startPassage = parseInt(el.attr('data-startnode'));
	this.creator = el.attr('data-creator');
	this.creatorVersion = el.attr('data-creator-version');
	
	// initialize history and state

	this.history = [];
	this.state = {};
	this.checkpointName = '';
	this.atCheckpoint = true;

	// create passage objects

	this.passages = [];

	var p = this.passages;

	el.children('*[data-role="passage"]').each(function (el)
	{
		var $t = $(this);
		var id = parseInt($t.attr('data-id'));
		p[id] = new Passage(id, $t.attr('data-name'), $t.html());
	});

	// run story script(s)
	// stylesheets are already set by the HTML tags

	el.children('*[data-role="script"]').each(function (el)
	{
		eval($(this).html());
	});

	// set up history event handler

	var self = this;

	$(window).on('popstate', function (event)
	{
		var state = event.originalEvent.state;

		if (state)
		{
			self.state = state.state;
			self.history = state.history;
			self.checkpointName = state.checkpointName;
			self.show(self.history[self.history.length - 1]);
		}
		else
		{
			self.state = {};
			self.history = [];
			self.checkpointName = '';
			self.show(self.startPassage);
		};
	});
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
	var passage = this.passage(idOrName);
	this.history.push(passage.id);

	if (this.atCheckpoint)
		window.history.pushState({ state: this.state, history: this.history, checkpointName: this.checkpointName });
	else
		window.history.replaceState({ state: this.state, history: this.history, checkpointName: this.checkpointName });

	this.atCheckpoint = false;
	$('#passage').html(passage.render());
};

Story.prototype.write = function (text)
{
	this.writeResult += text + ' ';
};

Story.prototype.embed = function (idOrName)
{
	this.writeResult += this.passage(idOrName).render() + ' ';
};

Story.prototype.checkpoint = function (name)
{
	document.title = this.name + ': ' + name;
	this.checkpointName = name;
	this.atCheckpoint = true;
};
