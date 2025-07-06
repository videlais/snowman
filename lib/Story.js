/**
 * Represents the entire story.
 */

import LZString from 'lz-string';
import Passage from './Passage.js';

import _ from 'underscore';

/**
 An object representing the entire story. After the document has completed
 loading, an instance of this class will be available at `window.story`.

 @class Story
**/

class Story {
	/**
	 * Creates a new Story object.
	 * 1) Looks for the tw-storydata element in the DOM. (If it doesn't exist, throws an error.)
	 * 2) Parses the tw-storydata element to get the story's name, start passage, and passages.
	 * 3) Sets up the history array, state object, checkpoint name, ignoreErrors property, errorMessage property, and atCheckpoint property.
	 * 4) Sets up the passages array.
	 * 5) Sets up the userScripts array.
	 * 6) Sets up the userStyles array.
	 * 7) Sets up the error handler.
	 * 8) Looks for the story and passage elements.
	 * @constructor
	 */
	constructor() {
		// Find the tw-storydata element (if it exists).
		const dataElement = document.querySelector('tw-storydata');

		// If the tw-storydata element doesn't exist, throw an error.
		if (dataElement == null) {
			// If the tw-storydata element doesn't exist, throw an error.
			throw new Error('Error: No tw-storydata element found in the document.');
		}

		// Look for the 'name' attribute in the tw-storydata element.
		// This will either be the the name of the story or null. (If it's null, the story will be unnamed.)
		this.name = dataElement.getAttribute('name');

		// Look for the 'startnode' attribute in the tw-storydata element.
		const startNode = dataElement.getAttribute('startnode');

		// If the 'startnode' attribute is null, throw an error.
		if (startNode == null) {
			throw new Error('Error: No startnode attribute found in the tw-storydata element.');
		}

		// Convert the 'startnode' attribute to an integer and store it in the startPassage property.
		this.startPassage = parseInt(startNode);

		// Setup the history array.
		this.history = [];

		// Setup the state object.
		this.state = {};

		// Setup the checkpoint name.
		this.checkpointName = '';

		// Setup the ignoreErrors property.
		//  If set to true, then any JavaScript errors are ignored.
		this.ignoreErrors = false;

		// Setup the errorMessage property.
		//  This is the message shown to users when there is an error and ignoreErrors is not true.
		this.errorMessage = '';

		// Setup the atCheckpoint property.
		//  Mainly for internal use, this records whether the current passage contains a checkpoint.
		this.atCheckpoint = false;
		
		// Setup the passages array
		this.passages = [];
 	   
		// For each child element of the 'tw-passagedata' element, create a new Passage object and add it to the passages array.
		for (let passageElement of dataElement.querySelectorAll('tw-passagedata')) {
			// Get the passage's ID.
			const id = parseInt(passageElement.getAttribute('pid'));
			// Get the passage's tags.
			const tags = passageElement.getAttribute('tags');
			// Create a new Passage object and add it to the passages array.
			this.passages[id] = new Passage(
				id,
				passageElement.getAttribute('name'),
				(tags !== '' && tags !== undefined) ? tags.split(' ') : [],
				passageElement.innerHTML
			);		
		}

		// Set up the userScripts array.
		this.userScripts = [];

     	// Add the internal (HTML) contents of all SCRIPT tags.
     	for(let script of document.querySelectorAll('*[type="text/twine-javascript"]') ) {
			this.userScripts.push( $(script).html() );
		}

		// Set up the userStyles array.
		this.userStyles = [];

     	// Add the internal (HTML) contents of all STYLE tags.
     	for(let css of document.querySelectorAll('*[type="text/twine-css"]') ) {
			this.userStyles.push( $(css).html() );
	}

    	/* Set up error handler. */
    	window.onerror = function(message, source, lineno, colno, error) {

       $.event.trigger("sm.story.error", [error, "Browser"]);

    	};

    	$(window).on('sm.story.error', function(event, error, source) {

       // Save the error
       this.errorMessage = "In " + source + ": " + error.name + ": " + error.message;

       if (this.ignoreErrors == false) {

         // tw-passage might not exist yet, so use tw-story
         $('tw-story').html(this.errorMessage);

       }

    	}.bind(this));

		// Get the passage element.
		this.$passageElement = $('tw-passage');

		// Get the story element.
		this.$storyElement = $('tw-story');
   }

	/**
	 Begins playing this story.
	 @method start
	**/
	start() {
		/* Set up history event handler. */
		$(window).on('popstate', function(event) {

			var state = event.originalEvent.state;

			if (state) {

				this.state = state.state;
				this.history = state.history;
				this.checkpointName = state.checkpointName;
				this.show(this.history[this.history.length - 1], true);

			} else if (this.history.length > 1) {

				this.state = {};
				this.history = [];
				this.checkpointName = '';
				this.show(this.startPassage, true);
			}

		}.bind(this));

		/* Set up hash change handler for save/restore. */
		$(window).on('hashchange', function() {

			this.restore(window.location.hash.replace('#', ''));

		}.bind(this));

		// For each entry in the userStyles array, append a new style element to the document body.
		// This will activate the user styles.
		this.userStyles.forEach((style) => {
			$(document.body).append(`<style>${style}</style>`);
		});

		// For each entry in the userScripts array, append a new script element to the document body.
		// This will activate the user scripts.
		this.userScripts.forEach((entry) => {
			// Create a new `<script>`.
			const newScriptElement = $('<script>');
			// Set the text of new from old.
			newScriptElement.html(entry);
			// Append the new `<script>` with text to document body.
			$(document.body).append(newScriptElement);
		});

		/* Set up passage link handler. */
		this.$storyElement.on('click', 'a[data-passage]', function (e) {

			this.show(_.unescape(
				$(e.target).closest('[data-passage]').data('passage')
			));

		}.bind(this));

		/**
		 Triggered when the story is finished loading, and right before
		 the first passage is displayed. The story property of this event
		 contains the story.
		 @event sm.story.started
		**/
		$.event.trigger('sm.story.started', { story: this });

		/* Try to restore based on the window hash if possible. */
		if (window.location.hash === '' ||
			!this.restore(window.location.hash.replace('#', ''))) {
			/* Start the story; mark that we're at a checkpoint. */
			this.show(this.startPassage);
			this.atCheckpoint = true;
		}
	}

	/**
	 Returns the Passage object corresponding to either an ID or name.
	 If none exists, then it returns null.
	 @method passage
	 @param idOrName {String or Number} ID or name of the passage
	 @return Passage object or null
	**/
	passage(idOrName) {

    	let passage = null;

		if (_.isNumber(idOrName)) {
      		if(idOrName < this.passages.length) {
        		passage = this.passages[idOrName];
      		}
		} else if (_.isString(idOrName)) {
			const result = this.passages.filter( (p) => p.name == idOrName);
      		if(result.length != 0) {
        		passage = result[0];
      		}
		}
    	return passage;
	}

	/**
	 Displays a passage on the page, replacing the current one. If there is no
	 passage by the name or ID passed, an error is thrown.

	 Calling this immediately inside a passage (i.e. in its source code) will
	 *not* display the other passage. Use Story.render() instead.

	 @method show
	 @param idOrName {String or Number} ID or name of the passage
	 @param noHistory {Boolean} if true, then this will not be recorded in the
		story history
	**/
	show(idOrName, noHistory = false) {
		// Get the passage object
		const passage = this.passage(idOrName);

		// If the passage is null, throw an error
		if (passage == null) {
			throw new Error(`Error: There is no passage with the ID or name ${idOrName}`);
		}

		/**
		 Triggered whenever a passage is about to be replaced onscreen with
		 another. The passage being hidden is stored in the passage property of
		 the event.
		 @event sm.passage.hidden
		**/

		this.$passageElement.trigger('sm.passage.hidden', { passage: window.passage });

		/**
		 Triggered whenever a passage is about to be shown onscreen. The passage
		 being displayed is stored in the passage property of the event.
		 @event sm.passage.showing
		**/

		this.$passageElement.trigger('sm.passage.showing', { passage: passage });

		// Set the passage element's HTML to the rendered passage
		this.$passageElement.html(passage.render());

		if (noHistory == false) {

			this.history.push(passage.id);

			try {

				if (this.atCheckpoint == true) {

					window.history.pushState(
						{
							state: this.state,
							history: this.history,
							checkpointName: this.checkpointName
						},
						'',
						''
					);

				} else {

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

			} catch (e) {
				$.event.trigger('sm.checkpoint.failed', { error: e });
			}

      		$.event.trigger('sm.checkpoint.added', { name: idOrName });

		}

		window.passage = passage;
		this.atCheckpoint = false;

		/**
		 Triggered after a passage has been shown onscreen, and is now
		 displayed in the story's element The passage being displayed is
		 stored in the passage property of the event.
		 @event sm.passage.shown
		**/

		this.$passageElement.trigger('sm.passage.shown', { passage: passage });

	}

	/**
	 Returns the HTML source for a passage. This is most often used when
	 embedding one passage inside another. In this instance, make sure to
	 use <%= %> instead of <%- %> to avoid incorrectly encoding HTML entities.
	 @method render
	 @param idOrName {String or Number} ID or name of the passage
	 @return {String} HTML source code
	**/
	render(idOrName) {
		// Get the passage object
		const passage = this.passage(idOrName);

		// If the passage is null, throw an error
		if (passage == null) {
			throw new Error(`Error: There is no passage with the ID or name: ${idOrName}`);
		}

		// Return the rendered passage
		return passage.render();
	}

	/**
	 Records that the current story state should be added to the browser
	 history. Actually saving it occurs once the user navigates to another
	 passage -- otherwise, clicking the back button would cause the story to
	 show the same passage twice. Remember, only variables set on this story's
	 state variable are stored in the browser history.
	 @method checkpoint
	 @param name {String} checkpoint name, appears in history, optional
	**/
	checkpoint(name) {

		if (name !== undefined) {

			document.title = this.name + ': ' + name;
			this.checkpointName = name;

		} else {

			this.checkpointName = '';

		}

		this.atCheckpoint = true;

		/**
		 Triggered whenever a checkpoint is set in the story.
		 @event sm.checkpoint.adding
		**/

		$.event.trigger('sm.checkpoint.adding', { name: name });
	}

	/**
	 Sets the URL's hash property to the hash value created by saveHash().
	 @method save
	**/
	save(hash) {

		window.location.hash = hash;

		/**
		 Triggered whenever story progress is saved.
		 @event sm.story.saved
		**/

		$.event.trigger('sm.story.saved');

	}

	/**
	 Returns LZString + compressBase64 Hash.
	 @method saveHash()
	**/
	saveHash() {

		let hash = LZString.compressToBase64(JSON.stringify({
			state: this.state,
			history: this.history,
			checkpointName: this.checkpointName
		}));

		return hash;
	}

	/**
	 Tries to restore the story state from a hash value generated by saveHash().
	 @method restore
	 @param hash {String}
	 @return {Boolean} if the restore succeeded
	**/

	restore(hash) {

		try {

			const save = JSON.parse(LZString.decompressFromBase64(hash));

			this.state = save.state;
			this.history = save.history;
			this.checkpointName = save.checkpointName;
			this.show(this.history[this.history.length - 1], true);

		} catch (e) {
			/* Swallow the error. */

			/**
			 Triggered if there was an error with restoring from a hash.
			 @event sm.restore.failed
			**/

			$.event.trigger('sm.restore.failed', { error: e });
			return false;

		}

		/**
		 Triggered after completing a restore from a hash.
		 @event sm.restore.success
		**/

		$.event.trigger('sm.restore.success');
		return true;
	}

}

export default Story;
