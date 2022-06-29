/**
 * @external Element
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Element}
 */
const $ = require('jquery');
const _ = require('underscore');
const ejs = require('ejs');
const Passage = require('./Passage.js');
const Markdown = require('./Markdown.js');
const State = require('./State.js');
const History = require('./History.js');

/**
 * An object representing the entire story. After the document has completed
 * loading, an instance of this class will be available at `window.story`.
 *
 * @class Story
 */
class Story {
  constructor () {
    /**
     * @property {Element} storyDataElement - Reference to tw-storydata element
     * @type {Element}
     * @readonly
     */
    this.storyDataElement = $('tw-storydata');

    /**
     * @property {string} name - The name of the story.
     * @type {string}
     * @readonly
     */
    this.name = this.storyDataElement.attr('name');

    /**
     * @property {string} creator - The program that created this story.
     * @type {string}
     * @readonly
     */
    this.creator = this.storyDataElement.attr('creator');

    /**
     * @property {string} creatorVersion - The version of the program used to create this story.
     * @type {string}
     * @readonly
     */
    this.creatorVersion = this.storyDataElement.attr('creator-version');

    /**
     * @property {string} startPassage - ID of the first passage to be displayed.
     * @type {string}
     * @readonly
     */
    this.startPassage = parseInt(this.storyDataElement.attr('startnode'));

    // Create internal events and storehouse for state.
    State.init();

    // Create history management.
    History.init();

    /**
     * @property {string} state - State proxy; an object with mutation tracking
     * @type {object}
     */
    this.state = State.store;

    /**
     * An array of all passages, indexed by ID.
     *
     * @property {Array} passages - Passages array
     * @type {Array}
     */
    this.passages = [];

    // For each child element of the tw-storydata element,
    //  create a new Passage object based on its attributes.
    this.storyDataElement.children('tw-passagedata').each((index, element) => {
      const elementReference = $(element);
      const id = parseInt(elementReference.attr('pid'));
      let tags = elementReference.attr('tags');

      // Does the 'tags' attribute exist?
      if (tags !== '' && tags !== undefined) {
        // Attempt to split by space
        tags = tags.split(' ');
      } else {
        // It did not exist, so we create it as an empty array.
        tags = [];
      }

      this.passages.push(new Passage(
        id,
        elementReference.attr('name'),
        tags,
        Markdown.unescape(elementReference.html())
      ));
    });

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

    /**
     * Story element
     *
     * @property {Element} storyElement - Story element
     * @type {Element}
     * @readonly
     */
    this.storyElement = $('tw-story');

    // Catch user clicking on links
    this.storyElement.on('click', 'tw-link[data-passage]', (e) => {
      // Pull destination passage name from the attribute.
      const passageName = Markdown.unescape($(e.target).closest('[data-passage]').data('passage'));
      // Add to the history.
      History.add(passageName);
      // Hide the redo icon
      this.redoIcon.css('visibility', 'hidden');
      // Show the passage by name.
      this.show(passageName);
    });

    /**
     * Passage element
     *
     * @property {Element} passageElement - Passage element
     * @type {Element}
     */
    this.passageElement = $('tw-passage');

    /**
     * Reference to undo icon
     *
     * @property {Element} undoIcon - Undo element
     * @type {Element}
     */
    this.undoIcon = $('tw-icon[title="Undo"]');

    // Start the story with it hidden.
    this.undoIcon.css('visibility', 'hidden');

    // Listen for user click interactions
    this.undoIcon.on('click', () => {
      /**
       * Triggered when user clicks on the undo button.
       *
       * @event History#undo
       */
      State.events.emit('undo');

      // If undo is ever used, redo becomes available.
      this.redoIcon.css('visibility', 'visible');
    });

    // Read-only proxy construct
    const handler = {
      get: (target, property, receiver) => {
        return Reflect.get(target, property, receiver);
      }
    };

    /**
     * Legacy property. Read-only proxy to History.history.
     *
     * @property {Array} history - Array of passage names and copies of State.store
     * @type {Array}
     */
    this.history = new Proxy(History.history, handler);

    /**
     * Reference to redo icon
     *
     * @property {Element} redoIcon - Redo element
     * @type {Element}
     */
    this.redoIcon = $('tw-icon[title="Redo"]');

    // Start the story with it hidden.
    this.redoIcon.css('visibility', 'hidden');

    // Listen for user click interactions
    this.redoIcon.on('click', () => {
      /**
       * Triggered when user clicks on the redo button.
       *
       * @event History#redo
       */
      State.events.emit('redo');
    });

    // Listen for redo events
    State.events.on('redo', () => {
      // Attempt to redo history.
      const passageName = History.redo();
      // If redo failed, name will be null.
      if (passageName !== null) {
        // Not null, show previous passage.
        window.story.show(passageName);
      }
    });

    // Listen for undo events
    State.events.on('undo', () => {
      // Attempt to undo history.
      const passageName = History.undo();
      // If undo failed, name will be null.
      if (passageName !== null) {
        // Not null, show previous passage.
        window.story.show(passageName);
      }
    });
  }

  /**
   * Begins playing this story based on data from tw-storydata.
   * 1. Apply all user styles
   * 2. Run all user scripts
   * 3. Find starting passage
   * 4. Add to starting passage to History.history
   * 5. Show starting passage
   * 6. Trigger 'start' event
   *
   * @function start
   */

  start () {
    // For each style, add them to the body as extra style elements.
    this.userStyles.forEach((style) => {
      $(document.body).append(`<style>${style}</style>`);
    });

    // For each script, render them as JavaScript inside EJS.
    this.userScripts.forEach((script) => {
      // Run any code within a templated sandbox.
      this.runScript(`<%${script}%>`);
    });

    const passage = this.getPassageById(this.startPassage);

    // Does the starting passage exist?
    if (passage === null) {
      // It does not exist.
      // Throw an error.
      throw new Error('Starting passage does not exist!');
    }

    // Add to the history.
    History.add(passage.name);

    // Show starting passage.
    this.show(passage.name);

    /**
     * Triggered when the story starts
     *
     * @event State#start
     * @type {string}
     */
    State.events.emit('start', passage.name);
  }

  /**
   * Returns an array of none, one, or many passages matching a specific tag.
   *
   * @function getPassagesByTags
   * @param {string} tag - Tag to search for
   * @returns {Array} Array containing none, one, or many passage objects
   */
  getPassagesByTags (tag) {
    // Search internal passages
    return this.passages.filter((p) => {
      return p.tags.includes(tag);
    });
  }

  /**
   * Returns a Passage object by id from internal collection. If none exists, returns null.
   * The Twine editor prevents multiple passages from having the same id, so
   *  this always returns the first search result.
   *
   * @function getPassageById
   * @param {number} id - id of the passage
   * @returns {Passage|null} Passage object or null
   */
  getPassageById (id) {
    // Create default value
    let passage = null;

    // Search for any passages with the name
    const result = window.story.passages.filter((p) => p.id === id);

    // Were any found?
    if (result.length !== 0) {
      // Grab the first result.
      passage = result[0];
    }

    // Return either null or first result found.
    return passage;
  }

  /**
   * Returns a Passage object by name from internal collection. If none exists, returns null.
   * The Twine editor prevents multiple passages from having the same name, so
   *  this always returns the first search result.
   *
   * @function getPassageByName
   * @param {string} name - name of the passage
   * @returns {Passage|null} Passage object or null
   */
  getPassageByName (name) {
    // Create default value
    let passage = null;

    // Search for any passages with the name
    const result = window.story.passages.filter((p) => p.name === name);

    // Were any found?
    if (result.length !== 0) {
      // Grab the first result.
      passage = result[0];
    }

    // Return either null or first result found.
    return passage;
  }

  /**
   * Legacy method. Alias for Story.getPassageByName().
   *
   * @function passage
   * @param {string} name - name of the passage
   * @returns {Passage|null} Passage object or null
   */
  passage (name) {
    return window.story.getPassageByName(name);
  }

  /**
   * Replaces current passage shown to reader with rendered source of named passage.
   * If the named passage does not exist, an error is thrown.
   *
   * @function show
   * @param {string} name - name of the passage
   */
  show (name) {
    const passage = this.getPassageByName(name);

    if (passage === null) {
      throw new Error(`There is no passage with the name ${name}`);
    }

    // Set the global passage to the one about to be shown.
    window.passage = passage;

    // Overwrite current tags
    this.passageElement.attr('tags', passage.tags);

    // Overwrite the parsed with the rendered.
    this.passageElement.html(this.render(passage.name));

    // Change visibility after second (and later) show calls
    if (this.history.length > 1) {
      this.undoIcon.css('visibility', 'visible');
    }

    /**
     * Triggered when a passage is shown
     *
     * @event State#show
     * @type {string}
     */
    State.events.emit('show', passage.name);
  }

  /**
   * Returns the HTML source for a passage. This is most often used when
   * embedding one passage inside another. In this instance, make sure to
   * use <%= %> instead of <%- %> to avoid incorrectly encoding HTML entities.
   *
   * 1. Find passage by name
   * 2. Run EJS rendering for possible template tags
   * 3. Run Markdown parsing
   *
   * @function render
   * @param {string} name - name of the passage
   * @returns {string} HTML source code
   */
  render (name) {
    // Search for passage by name
    const passage = window.story.getPassageByName(name);

    // Does this passage exist?
    if (passage === null) {
      // It does not exist.
      // Throw error.
      throw new Error('There is no passage with name ' + name);
    }

    // Render any possible code first
    let result = window.story.runScript(passage.source);

    // Parse the resulting text
    result = Markdown.parse(result);

    // Return the rendered and parsed passage source.
    return result;
  }

  /**
   * Accepts mixed input of arrays or comma-separated list of values and returns a random entry.
   * Will return null when given no arguments.
   *
   * Examples:
   * - either(1,2,3);
   * - either(1,[2],[4,5]);
   *
   * @function either
   * @param {object|Array} args - Array or comma-separated list
   * @returns {object|null} Random entry or null
   */
  either (...args) {
    let tempArray = [];
    let result = null;

    // For every entry...
    for (const entry of args) {
      // If it is not an array...
      if (!(entry instanceof Array)) {
        // push the entry into the temporary array.
        tempArray.push(entry);
      } else {
        // Spread out any subentries and add them to temporary array.
        tempArray = [...tempArray, ...entry];
      }
    }

    // Check if any entries were added.
    if (tempArray.length > 0) {
      // If they were, grab one of them.
      result = tempArray[Math.floor(Math.random() * tempArray.length)];
    }

    // Return either null (no entries) or random entry.
    return result;
  }

  /**
   * Render JavaScript within a templated sandbox and return possible output.
   * Will throw error if code does.
   *
   * @function runScript
   * @param {string} script - Code to run
   * @returns {string} Any output, if produced
   */
  runScript (script) {
    let result = '';

    try {
      // Send in pseudo-global properties
      /* eslint-disable object-shorthand */
      result = ejs.render(script,
        {
          State: State,
          s: this.state,
          $: $,
          _: _,
          renderToSelector: this.renderToSelector,
          include: this.render,
          either: this.either,
          hasVisited: History.hasVisited,
          visited: History.visited,
          getPassageByName: this.getPassageByName,
          undo: () => { State.events.emit('undo'); },
          redo: () => { State.events.emit('redo'); }
        },
        {
          outputFunctionName: 'print'
        }
      );
    } catch (e) {
      // Throw error if rendering fails.
      throw new Error(`Error compiling template code: ${e}`);
    }

    /* eslint-enable object-shorthand */
    return result;
  }

  /**
   * Render a passage to any/all element(s) matching query selector
   *
   * @function renderToSelector
   * @param {object} passageName - The passage to render
   * @param {string} selector - jQuery selector
   */
  renderToSelector (passageName, selector) {
    // Render content to a specific selector.
    try {
      $(selector).html(window.story.render(passageName));
    } catch (e) {
      // Throw error if selector does not exist.
      throw new Error('Error with selector when using renderToSelector()');
    }
  }

  /**
   * Applies external CSS files
   *
   * @function applyExternalStyles
   * @param {Array} files - Array of one or more external files to load
   */
  applyExternalStyles (files) {
    if (Array.isArray(files)) {
      files.forEach(location => {
        $('<link/>', {
          rel: 'stylesheet',
          type: 'text/css',
          href: location
        }).appendTo('head');
      });
    } else {
      throw new Error('Method only accepts an array!');
    }
  }
}

module.exports = Story;
