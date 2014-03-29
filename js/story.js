/**
 An object representing the entire story. After the document has completed
 loading, an instance of this class will be available at `window.story`.

 @class Story
 @constructor
**/

function Story (el)
{
	// set up basic properties

	this.el = el;

	/**
	 The name of the story.
	 @property name
	 @type String
	 @readonly
	**/

	this.name = el.attr('data-name');

	/**
	 The ID of the first passage to be displayed.
	 @property startPassage
	 @type Number
	 @readonly
	**/

	this.startPassage = parseInt(el.attr('data-startnode'));

	/**
	 The program that created this story.

	 @property creator
	 @type String
	 @readonly
	**/

	this.creator = el.attr('data-creator');

	/**
	 The version of the program used to create this story.

	 @property creatorVersion
	 @type String
	 @readOnly
	**/

	this.creatorVersion = el.attr('data-creator-version');
	
	// initialize history and state

	/**
	 An array of passage IDs, one for each passage viewed during the current
	 session.

	 @property history
	 @type Array
	 @readOnly
	**/

	this.history = [];

	/**
	 An object that stores data that persists across a single user session.
	 Any other variables will not survive the user pressing back or forward.

	 @property state
	 @type Object
	**/

	this.state = {};

	/**
	 The name of the last checkpoint set. If none has been set, this is an empty string.

	 @property checkpointName
	 @type String
	 @readonly
	**/

	this.checkpointName = '';

	/**
	 Mainly for internal use, this records whether the current passage contains
	 a checkpoint.

	 @property atCheckpoint
	 @type Boolean
	 @private
	**/

	this.atCheckpoint = false;

	// create passage objects

	/**
	 An array of all passages, indexed by ID.

	 @property passages
	 @type Array
	**/

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
			self.atCheckpoint = false;
			self.state = state.state;
			self.history = state.history;
			self.checkpointName = state.checkpointName;
			self.show(self.history[self.history.length - 1]);
		}
		else if (self.history.length > 1)
		{
			self.state = {};
			self.history = [];
			self.checkpointName = '';
			self.show(self.startPassage);
		};
	});

	// set up passage link handler

	$('body').on('click', 'a[data-passage]', function()
	{
		self.show($(this).attr('data-passage'));
	});
};

/**
 Begins playing this story.

 @method start
**/

Story.prototype.start = function()
{
	// start the story; mark that we're at a checkpoint

	this.show(this.startPassage);
	this.atCheckpoint = true;
};

/**
 Returns the Passage object corresponding to either an ID or name.
 If none exists, then it returns null.

 @method passage
 @param idOrName {String or Number} ID or name of the passage
 @return Passage object or null
**/

Story.prototype.passage = function (idOrName)
{
	if (_.isNumber(idOrName))
		return this.passages[idOrName];
	else if (_.isString(idOrName))
		return _.findWhere(this.passages, { name: idOrName });
};

/**
 Displays a passage on the page, replacing the current one.

 @method show
 @param idOrName {String or Number} ID or name of the passage
**/

Story.prototype.show = function (idOrName)
{
	var passage = this.passage(idOrName);
	this.history.push(passage.id);

	if (this.atCheckpoint)
	{
		window.history.pushState({ state: this.state, history: this.history, checkpointName: this.checkpointName }, '', '');
	}
	else
	{
		window.history.replaceState({ state: this.state, history: this.history, checkpointName: this.checkpointName }, '', '');
	};

	window.passage = passage;
	this.atCheckpoint = false;
	$('#passage').html(passage.render());
};

/**
 Adds an entry in the browser history for the current story state.
 Remember, only variables set on this story's state variable are
 stored in the browser history.

 @method checkpoint
 @param name {String} checkpoint name, appears in history
**/

Story.prototype.checkpoint = function (name)
{
	document.title = this.name + ': ' + name;
	this.checkpointName = name;
	this.atCheckpoint = true;
};
