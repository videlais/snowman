/**
 * @external Element
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Element}
 */

const LZString = require('lz-string');
const Passage = require('./Passage.js');
const $ = require('jquery');
const _ = require('underscore');

/**
 * An object representing the entire story. After the document has completed
 * loading, an instance of this class will be available at `window.story`.
 *
 * @class Story
 */
class Story {
  constructor (dataEl) {
    this.dataEl = dataEl;

    /**
     * @property {string} name - The name of the story.
     * @type {string}
     * @readonly
     */

    this.name = this.dataEl.attr('name');

    /**
     * @property {number} startPassage - The ID of the first passage to be displayed.
     * @type {number}
     * @readonly
     */

    this.startPassage = parseInt(this.dataEl.attr('startnode'));

    /**
     * @property {string} creator - The program that created this story.
     * @type {string}
     * @readonly
     */

    this.creator = this.dataEl.attr('creator');

    /**
     * @property {string} creatorVersion - The version of the program used to create this story.
     * @type {string}
     * @readonly
     */

    this.creatorVersion = this.dataEl.attr('creator-version');

    /**
     * @property {Array} history - An array of passage IDs
     * @type {Array}
     * @readonly
     */

    this.history = [];

    /**
     * An object that stores data that persists across a single user session.
     * Any other variables will not survive the user pressing back or forward.
     *
     * @property {object} state - Story state
     * @type {object}
     */

    this.state = {};

    /**
     * The name of the last checkpoint set. If none has been set, this is an
     * empty string.
     *
     * @property {string} checkpointName - name of checkpoint
     * @type {string}
     * @readonly
     */

    this.checkpointName = '';

    /**
     * If set to true, then any JavaScript errors are ignored -- normally, play
     * would end with a message shown to the user.
     *
     * @property {boolean} ignoreErrors - If errors should be ignored
     * @type {boolean}
     */

    this.ignoreErrors = false;

    /**
     * The message shown to users when there is an error and ignoreErrors is not
     * true.
     *
     * @property {string} errorMessage - Error message
     * @type {string}
     */

    this.errorMessage = '';

    /**
     * Mainly for internal use, this records whether the current passage contains
     * a checkpoint.
     *
     * @property {boolean} atCheckpoint - if at checkpoint
     * @type {boolean}
     * @private
     */

    this.atCheckpoint = false;

    /**
     * An array of all passages, indexed by ID.
     *
     * @property {Array} passages - Passages array
     * @type {Array}
     */

    this.passages = [];

    const p = [];

    dataEl.children('tw-passagedata').each(function () {
      const $t = $(this);
      const id = parseInt($t.attr('pid'));
      const tags = $t.attr('tags');

      p[id] = new Passage(
        id,
        $t.attr('name'),
        (tags !== '' && tags !== undefined) ? tags.split(' ') : [],
        $t.html()
      );
    });

    this.passages = p;

    /**
     * An array of user-specific scripts to run when the story is begun.
     *
     * @property {Array} userScripts - Array of user-added JavaScript
     * @type {Array}
     */

    this.userScripts = [];

    // Add the internal (HTML) contents of all SCRIPT tags
    $('*[type="text/twine-javascript"]').each((index, value) => {
      this.userScripts.push($(value).html());
    });

    /**
     * An array of user-specific style declarations to add when the story is
     * begun.
     *
     * @property {Array} userStyles - Array of user-added styles
     * @type {Array}
     */

    this.userStyles = [];

    // Add the internal (HTML) contents of all STYLE tags
    $('*[type="text/twine-css"]').each((index, value) => {
      this.userStyles.push($(value).html());
    });

    /* Set up error handler. */
    window.onerror = function (message, source, lineno, colno, error) {
      $.event.trigger('sm.story.error', [error, 'Browser']);
    };

    $(window).on('sm.story.error', (event, error, source) => {
      // Save the error
      this.errorMessage = 'In ' + source + ': ' + error.name + ': ' + error.message;

      if (this.ignoreErrors === false) {
        // tw-passage might not exist yet, so use tw-story
        $('tw-story').html(this.errorMessage);
      }
    });

    this.$passageEl = $('<tw-passage class="passage" aria-live="polite"></tw-passage>');
  }

  /**
   * Begins playing this story.
   *
   * @function start
   * @param {Element} el - Element to show content in
   * @returns {void}
   */

  start (el) {
    this.$el = $(el);

    /* Create an element to show the passage. */
    this.$el.append(this.$passageEl);

    /* Set up history event handler. */
    $(window).on('popstate', (event) => {
      const state = event.originalEvent.state;

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
    });

    /* Set up hash change handler for save/restore. */
    $(window).on('hashchange', () => {
      this.restore(window.location.hash.replace('#', ''));
    });

    /* Activate user styles. */
    this.userStyles.forEach((style) => {
      this.$el.append('<style>' + style + '</style>');
    });

    /* Run user scripts. */
    this.userScripts.forEach((script) => {
      try {
        /* eslint-disable no-eval */
        eval(script);
        /* eslint-enable no-eval */
      } catch (error) {
        $.event.trigger('sm.story.error', [error, 'Story JavaScript Eval()']);
      }
    });

    /* Set up passage link handler. */
    this.$el.on('click', 'a[data-passage]', (e) => {
      this.show(_.unescape(
        $(e.target).closest('[data-passage]').data('passage')
      ));
    });

    /**
     * Triggered when the story is finished loading, and right before
     * the first passage is displayed. The story property of this event
     * contains the story.
     *
     * @event sm.story.started
     */

    $.event.trigger('sm.story.started', { story: this });

    /* Try to restore based on the window hash if possible. */

    if (window.location.hash === '' || !this.restore(window.location.hash.replace('#', ''))) {
      /* Start the story; mark that we're at a checkpoint. */

      this.show(this.startPassage);
      this.atCheckpoint = true;
    }
  }

  /**
   * Returns the Passage object corresponding to either an ID or name.
   * If none exists, then it returns null.
   *
   * @function passage
   * @param {string|number} idOrName - ID or name of the passage
   * @returns {object} - Passage object or null
   */
  passage (idOrName) {
    let passage = null;

    if (_.isNumber(idOrName)) {
      if (idOrName < this.passages.length) {
        passage = this.passages[idOrName];
      }
    } else if (_.isString(idOrName)) {
      const result = this.passages.filter((p) => p.name === idOrName);

      if (result.length !== 0) {
        passage = result[0];
      }
    }

    return passage;
  }

  /**
   * Displays a passage on the page, replacing the current one. If there is no
   * passage by the name or ID passed, an exception is raised.
   *
   * Calling this immediately inside a passage (i.e. in its source code) will
   * not display the other passage. Use Story.render() instead.
   *
   * @function show
   * @param {string|number} idOrName - ID or name of the passage
   * @param {boolean} noHistory - if true, then this will not be recorded in the
    story history
   * @returns {void} - Returns nothing
   */
  show (idOrName, noHistory = false) {
    const passage = this.passage(idOrName);

    if (passage === null) {
      throw new Error(
        'There is no passage with the ID or name "' + idOrName + '"'
      );
    }

    /**
     * Triggered whenever a passage is about to be replaced onscreen with
     * another. The passage being hidden is stored in the passage property of
     * the event.
     *
     * @event sm.passage.hidden
     */

    this.$passageEl.trigger('sm.passage.hidden', { passage: window.passage });

    /**
     * Triggered whenever a passage is about to be shown onscreen. The passage
     * being displayed is stored in the passage property of the event.
     *
     * @event sm.passage.showing
     */

    this.$passageEl.trigger('sm.passage.showing', { passage: passage });

    if (noHistory === false) {
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
        /* This may fail due to security restrictions in the browser. */
        /**
         * Triggered whenever a checkpoint fails to be saved to browser
         * history.
         *
         * @event sm.checkpoint.failed
         */

        $.event.trigger('sm.checkpoint.failed', { error: e });
      }

      $.event.trigger('sm.checkpoint.added', { name: idOrName });
    }

    window.passage = passage;
    this.atCheckpoint = false;

    try {
      this.$passageEl.html(passage.render());
    } catch (e) {
      $.event.trigger('sm.story.error', [e, 'Story.show()']);
    }

    /**
     * Triggered after a passage has been shown onscreen, and is now
     * displayed in the story's element The passage being displayed is
     * stored in the passage property of the event.
     *
     * @event sm.passage.shown
     */

    this.$passageEl.trigger('sm.passage.shown', { passage: passage });
  }

  /**
   * Returns the HTML source for a passage. This is most often used when
   * embedding one passage inside another. In this instance, make sure to
   * use <%= %> instead of <%- %> to avoid incorrectly encoding HTML entities.
   *
   * @function render
   * @param {string|number} idOrName - ID or name of the passage
   * @returns {string} - HTML source code
   */
  render (idOrName) {
    const passage = this.passage(idOrName);

    if (passage == null) {
      throw new Error('There is no passage with the ID or name ' + idOrName);
    }

    return passage.render();
  }

  /**
   * Records that the current story state should be added to the browser
   * history. Actually saving it occurs once the user navigates to another
   * passage -- otherwise, clicking the back button would cause the story to
   * show the same passage twice. Remember, only variables set on this story's
   * state variable are stored in the browser history.
   *
   * @function checkpoint
   * @param {string} name - checkpoint name, appears in history, optional
   * @returns {void} - Returns nothing
   */
  checkpoint (name) {
    if (name !== undefined) {
      document.title = this.name + ': ' + name;
      this.checkpointName = name;
    } else {
      this.checkpointName = '';
    }

    this.atCheckpoint = true;

    /**
     * Triggered whenever a checkpoint is set in the story.
     *
     * @event sm.checkpoint.adding
     */

    $.event.trigger('sm.checkpoint.adding', { name: name });
  }

  /**
   * Sets the URL hash property to the hash value created by saveHash().
   *
   * @function save
   * @param {string} hash - Hash to set URL
   * @returns {void} - Returns nothing
   */
  save (hash) {
    window.location.hash = hash;

    /**
     * Triggered whenever story progress is saved.
     *
     * @event sm.story.saved
     */

    $.event.trigger('sm.story.saved');
  }

  /**
   * Returns LZString + compressBase64 Hash.
   *
   * @function saveHash
   * @returns {string} - Returns the LZString hash
   */
  saveHash () {
    const hash = LZString.compressToBase64(JSON.stringify({
      state: this.state,
      history: this.history,
      checkpointName: this.checkpointName
    }));

    return hash;
  }

  /**
   * Tries to restore the story state from a hash value generated by saveHash().
   *
   * @function restore
   * @param {string} hash - Hash to restore from
   * @returns {boolean} if the restore succeeded
   */

  restore (hash) {
    try {
      const save = JSON.parse(LZString.decompressFromBase64(hash));

      this.state = save.state;
      this.history = save.history;
      this.checkpointName = save.checkpointName;
      this.show(this.history[this.history.length - 1], true);
    } catch (e) {
      /* Swallow the error. */

      /**
       * Triggered if there was an error with restoring from a hash.
       *
       * @event sm.restore.failed
       */

      $.event.trigger('sm.restore.failed', { error: e });
      return false;
    }

    /**
     * Triggered after completing a restore from a hash.
     *
     * @event sm.restore.success
     */

    $.event.trigger('sm.restore.success');
    return true;
  }
}

module.exports = Story;
