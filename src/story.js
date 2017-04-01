/**
 An object representing the entire story. After the document has completed
 loading, an instance of this class will be available at `window.story`.

 @class Story
 @constructor
**/

'use strict';
var $ = require('jquery');
var _ = require('underscore');
var LZString = require('lz-string');
var Passage = require('./passage');

var Story = function(dataEl) {
	/* Set up basic properties. */

	this.dataEl = dataEl;

	/**
	 The name of the story.
	 @property name
	 @type String
	 @readonly
	**/

	this.name = dataEl.attr('name');

	/**
	 The ID of the first passage to be displayed.
	 @property startPassage
	 @type Number
	 @readonly
	**/

	this.startPassage = parseInt(dataEl.attr('startnode'));

	/**
	 The program that created this story.
	 @property creator
	 @type String
	 @readonly
	**/

	this.creator = dataEl.attr('creator');

	/**
	 The version of the program used to create this story.
	 @property creatorVersion
	 @type String
	 @readOnly
	**/

	this.creatorVersion = dataEl.attr('creator-version');
	
	/* Initialize history and state. */

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
	 The name of the last checkpoint set. If none has been set, this is an
	 empty string.
	 @property checkpointName
	 @type String
	 @readonly
	**/

	this.checkpointName = '';

	/**
	 If set to true, then any JavaScript errors are ignored -- normally, play
	 would end with a message shown to the user.
	 @property ignoreErrors
	 @type Boolean
	**/

	this.ignoreErrors = false;

	/**
	 The message shown to users when there is an error and ignoreErrors is not
	 true. Any %s in the message will be interpolated as the actual error
	 messsage.
	 @property errorMessage
	 @type String
	**/

	this.errorMessage = '\u26a0 %s';

	/**
	 Mainly for internal use, this records whether the current passage contains
	 a checkpoint.
	 @property atCheckpoint
	 @type Boolean
	 @private
	**/

	this.atCheckpoint = false;

	/* Create passage objects. */

	/**
	 An array of all passages, indexed by ID.
	 @property passages
	 @type Array
	**/

	this.passages = [];

	var p = this.passages;

	dataEl.children('tw-passagedata').each(function() {
		var $t = $(this);
		var id = parseInt($t.attr('pid'));
		var tags = $t.attr('tags');

		p[id] = new Passage(
			id,
			$t.attr('name'),
			(tags !== '' && tags !== undefined) ? tags.split(' ') : [],
			$t.html()
		);
	});

	/**
	 An array of user-specific scripts to run when the story is begun.
	 @property userScripts
	 @type Array
	**/

	this.userScripts = _.map(
		dataEl.children('*[type="text/twine-javascript"]'),
		function(el) {
			return $(el).html();
		}
	);

	/**
	 An array of user-specific style declarations to add when the story is
	 begun.
	 @property userStyles
	 @type Array
	**/

	this.userStyles = _.map(
		dataEl.children('*[type="text/twine-css"]'),
		function(el) {
			return $(el).html();
		}
	);
};

_.extend(Story.prototype, {
	/**
	 Begins playing this story.
	 @method start
	 @param {DOMElement} el Element to show content in
	**/

	start: function(el) {
		this.$el = $(el);

		/* Create an element to show the passage. */

		this.$passageEl = $('<div class="passage" aria-live="polite"></div>');
		this.$el.append(this.$passageEl);

		/* Set up history event handler. */

		$(window).on('popstate', function(event) {
			var state = event.originalEvent.state;

			if (state) {
				this.state = state.state;
				this.history = state.history;
				this.checkpointName = state.checkpointName;
				this.show(this.history[this.history.length - 1], true);
			}
			else if (this.history.length > 1) {
				this.state = {};
				this.history = [];
				this.checkpointName = '';
				this.show(this.startPassage, true);
			}
		}.bind(this));

		/* Set up passage link handler. */

		this.$el.on('click', 'a[data-passage]', function (e) {
			this.show(_.unescape(
				$(e.target).closest('[data-passage]').data('passage')
			));
		}.bind(this));

		/* Set up hash change handler for save/restore. */

		$(window).on('hashchange', function() {
			this.restore(window.location.hash.replace('#', ''));
		}.bind(this));

		/* Set up error handler. */

		window.onerror = function(message, url, line) {
			if (! this.errorMessage || typeof(this.errorMessage) != 'string') {
				this.errorMessage = Story.prototype.errorMessage;
			}

			if (!this.ignoreErrors) {
				if (url) {
					message += ' (' + url;

					if (line) {
						message += ': ' + line;
					}

					message += ')';
				}

				this.$passageEl.html(this.errorMessage.replace('%s', message));
			}
		}.bind(this);

		/* Activate user styles. */

		_.each(this.userStyles, function(style) {
			this.$el.append('<style>' + style + '</style>');
		}, this);

		/* Run user scripts. */

		_.each(this.userScripts, function(script) {
			eval(script);
		}, this);

		/**
		 Triggered when the story is finished loading, and right before
		 the first passage is displayed. The story property of this event
		 contains the story.
		 @event start.sm.story
		**/

		this.$el.trigger('start.sm.story', { story: this });

		/* Try to restore based on the window hash if possible. */

		if (window.location.hash === '' ||
			!this.restore(window.location.hash.replace('#', ''))) {
			/* Start the story; mark that we're at a checkpoint. */

			this.show(this.startPassage);
			this.atCheckpoint = true;
		}
	},

	/**
	 Returns the Passage object corresponding to either an ID or name.
	 If none exists, then it returns null.
	 @method passage
	 @param idOrName {String or Number} ID or name of the passage
	 @return Passage object or null
	**/

	passage: function(idOrName) {
		if (_.isNumber(idOrName)) {
			return this.passages[idOrName];
		}
		else if (_.isString(idOrName)) {
			return _.findWhere(this.passages, { name: idOrName });
		}
	},

	/**
	 Displays a passage on the page, replacing the current one. If there is no
	 passage by the name or ID passed, an exception is raised.

	 Calling this immediately inside a passage (i.e. in its source code) will
	 *not* display the other passage. Use Story.render() instead.

	 @method show
	 @param idOrName {String or Number} ID or name of the passage
	 @param noHistory {Boolean} if true, then this will not be recorded in the
		story history
	**/

	show: function(idOrName, noHistory) {
		var passage = this.passage(idOrName);

		if (!passage) {
			throw new Error(
				'There is no passage with the ID or name "' + idOrName + '"'
			);
		}

		/**
		 Triggered whenever a passage is about to be replaced onscreen with
		 another. The passage being hidden is stored in the passage property of
		 the event.
		 @event hide.sm.passage
		**/

		this.$passageEl.trigger('hide.sm.passage', { passage: window.passage });

		/**
		 Triggered whenever a passage is about to be shown onscreen. The passage
		 being displayed is stored in the passage property of the event.
		 @event showpassage
		**/

		this.$passageEl.trigger('show.sm.passage', { passage: passage });

		if (!noHistory) {
			this.history.push(passage.id);

			try {
				if (this.atCheckpoint) {
					window.history.pushState(
						{
							state: this.state,
							history: this.history,
							checkpointName: this.checkpointName
						},
						'',
						''
					);

					$.event.trigger('added.sn.checkpoint', { name: name });
				}
				else {
					window.history.replaceState(
						{
							state: this.state,
							history: this.history,
							checkpointName: this.checkpointName
						},
						'',
						''
					);
				}
			}
			catch (e) {
				/* This may fail due to security restrictions in the browser. */

				/**
				 Triggered whenever a checkpoint fails to be saved to browser
				 history.
				 @event fail.sm.checkpoint
				**/

				this.$el.trigger('fail.sm.checkpoint', { error: e });
			}
		}

		window.passage = passage;
		this.atCheckpoint = false;
		this.$passageEl.html(passage.render());

		/**
		 Triggered after a passage has been shown onscreen, and is now
		 displayed in the story's element The passage being displayed is
		 stored in the passage property of the event.
		 @event shown.sm.passage
		**/

		this.$passageEl.trigger('shown.sm.passage', { passage: passage });
	},

	/**
	 Returns the HTML source for a passage. This is most often used when
	 embedding one passage inside another. In this instance, make sure to
	 use <%= %> instead of <%- %> to avoid incorrectly encoding HTML entities.
	 @method render
	 @param idOrName {String or Number} ID or name of the passage
	 @return {String} HTML source code
	**/

	render: function(idOrName) {
		var passage = this.passage(idOrName);

		if (!passage) {
			throw new Error('There is no passage with the ID or name ' + idOrName);
		}

		return passage.render();
	},

	/**
	 Records that the current story state should be added to the browser
	 history. Actually saving it occurs once the user navigates to another
	 passage -- otherwise, clicking the back button would cause the story to
	 show the same passage twice. Remember, only variables set on this story's
	 state variable are stored in the browser history.
	 @method checkpoint
	 @param name {String} checkpoint name, appears in history, optional
	**/

	checkpoint: function(name) {
		if (name !== undefined) {
			document.title = this.name + ': ' + name;
			this.checkpointName = name;
		}
		else {
			this.checkpointName = '';
		}

		this.atCheckpoint = true;

		/**
		 Triggered whenever a checkpoint is set in the story.
		 @event add.sn.checkpoint.sn
		**/

		$.event.trigger('add.sn.checkpoint', { name: name });
	},

	/**
	 Returns a hash value representing the current state of the story.
	 @method saveHash
	 @return String hash
	**/

	saveHash: function() {
		return LZString.compressToBase64(JSON.stringify({
			state: this.state,
			history: this.history,
			checkpointName: this.checkpointName
		}));
	},

	/**
	 Sets the URL's hash property to the hash value created by saveHash().
	 @method save
	 @return String hash
	**/

	save: function() {
		/**
		 Triggered whenever story progress is saved.
		 @event save.sn.story
		**/

		window.location.hash = this.saveHash();
		this.$el.trigger('save.sn.story');
	},

	/**
	 Tries to restore the story state from a hash value generated by saveHash().
	 @method restore
	 @param hash {String}
	 @return {Boolean} whether the restore succeeded
	**/

	restore: function(hash) {
		/**
		 Triggered before trying to restore from a hash.
		 @event restore
		**/

		this.$el.trigger('restore.sn.story');

		try {
			var save = JSON.parse(LZString.decompressFromBase64(hash));
			
			this.state = save.state;
			this.history = save.history;
			this.checkpointName = save.checkpointName;
			this.show(this.history[this.history.length - 1], true);
		}
		catch (e) {
			/* Swallow the error. */

			/**
			 Triggered if there was an error with restoring from a hash.
			 @event restorefailed
			**/

			$.event.trigger('restorefail.sn.story', { error: e });
			return false;
		};

		/**
		 Triggered after completing a restore from a hash.
		 @event restore.sn.story
		**/

		this.$el.trigger('restored.sn.story');
		return true;
	}
});

module.exports = Story;