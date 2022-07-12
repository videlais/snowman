/**
 * @external Element
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Element}
 */
const $ = require('jquery');
const ejs = require('ejs');
const Passage = require('./Passage.js');
const Markdown = require('./Markdown.js');
const State = require('./State.js');
const History = require('./History.js');
const Storage = require('./Storage.js');
const Storylets = require('./Storylets.js');

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
      let tags = elementReference.attr('tags');

      // Does the 'tags' attribute exist?
      if (tags !== '' && tags !== undefined) {
        // Attempt to split by space
        tags = tags.split(' ');
      } else {
        // It did not exist, so we create it as an empty array.
        tags = [];
      }

      // Push the new passage.
      this.passages.push(new Passage(
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
      // Hide the redo icon.
      this.redoIcon.css('visibility', 'hidden');
      // Show the undo icon.
      this.undoIcon.css('visibility', 'visible');
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
     * @property {Array} history - Array of passage names and copies of State.store.
     * @type {Array}
     */
    this.history = new Proxy(History.history, handler);

    /**
     * Reference to redo icon.
     *
     * @property {Element} redoIcon - Redo element.
     * @type {Element}
     */
    this.redoIcon = $('tw-icon[title="Redo"]');

    // Start the story with it hidden.
    this.redoIcon.css('visibility', 'hidden');

    // Listen for user click interactions.
    this.redoIcon.on('click', () => {
      /**
       * Triggered when user clicks on the redo button.
       *
       * @event History#redo
       */
      State.events.emit('redo');
    });

    // Listen for redo events.
    State.events.on('redo', () => {
      // Attempt to redo history.
      const passageName = History.redo();
      // If redo failed, name will be null.
      if (passageName !== null) {
        // Check if at end of collection.
        if (History.position === History.history.length - 1) {
          // Hide redo
          this.redoIcon.css('visibility', 'hidden');
          // Show undo
          this.undoIcon.css('visibility', 'visible');
        }
        // Not null, show previous passage.
        this.show(passageName);
      }
    });

    // Listen for undo events.
    State.events.on('undo', () => {
      // Show redo if undo is clicked.
      this.redoIcon.css('visibility', 'visible');
      // Attempt to undo history.
      const passageName = History.undo();
      // If undo failed, name will be null.
      if (passageName !== null) {
        // Check if at beginning of collection.
        if (History.position === 0) {
          // Hide undo
          this.undoIcon.css('visibility', 'hidden');
        }
        // Not null, show previous passage.
        this.show(passageName);
      }
    });

    // Listen for screen-lock event.
    State.events.on('screen-lock', () => {
      // Append an element filling screen with CSS loading spinner.
      $(document.body).append('<tw-screenlock><div class="loading"></div></tw-screenlock>');
    });

    // Listen for screen-unlock event.
    State.events.on('screen-unlock', () => {
      // Remove tw-screenlock element, if there is one.
      $('tw-screenlock').remove();
    });

    // Listen for sidebar-show event.
    State.events.on('sidebar-show', () => {
      // Show tw-sidebar
      $('tw-sidebar').css('visibility', 'visible');
    });

    // Listen for sidebar-hide event.
    State.events.on('sidebar-hide', () => {
      // Show tw-sidebar
      $('tw-sidebar').css('visibility', 'hidden');
    });

    /**
     * Reference to internal Storylets object.
     *
     * Starts as null. During Story.start(), a new object is
     *  created based on initial passages.
     *
     * @property {Storylets} storylets Internal reference to Storylets
     * @type {Storylets|null}
     */
    this.storylets = null;
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
    // Find all passages with the tag 'storylet'.
    const passageList = this.getPassagesByTag('storylet');
    // Generate initial Storylets collection.
    this.storylets = new Storylets(passageList);

    // For each style, add them to the body as extra style elements.
    this.userStyles.forEach((style) => {
      $(document.body).append(`<style>${style}</style>`);
    });

    // For each script, render them as JavaScript inside EJS.
    this.userScripts.forEach((script) => {
      // Run any code within a templated sandbox.
      this.runScript(`<%${script}%>`);
    });

    // Get the startnode value (which is a number).
    const startingPassageID = parseInt(this.storyDataElement.attr('startnode'));
    // Use the PID to find the name of the starting passage based on elements.
    const startPassage = $(`[pid="${startingPassageID}"]`).attr('name');
    // Search for the starting passage.
    const passage = this.getPassageByName(startPassage);

    // Does the starting passage exist?
    if (passage === null) {
      // It does not exist.
      // Throw an error.
      throw new Error('Starting passage does not exist!');
    }

    // Add to the history.
    History.add(passage.name);

    // Set the global passage to the one about to be shown.
    window.passage = passage;

    // Overwrite current tags
    this.passageElement.attr('tags', passage.tags);

    // Get passage source.
    let passageSource = this.include(passage.name);

    // Run any scripts.
    passageSource = this.runScript(passageSource);

    // Parse any Markdown.
    passageSource = Markdown.parse(passageSource);

    // Overwrite the parsed with the rendered.
    this.passageElement.html(passageSource);

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
   * @function getPassagesByTag
   * @param {string} tag - Tag to search for.
   * @returns {Array} Array containing none, one, or many passage objects.
   */
  getPassagesByTag (tag) {
    // Search internal passages
    return this.passages.filter((p) => {
      return p.tags.includes(tag);
    });
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
    const result = this.passages.filter((p) => p.name === name);

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
    return this.getPassageByName(name);
  }

  /**
   * Replaces current passage shown to reader with rendered source of named passage.
   * If the named passage does not exist, an error is thrown.
   *
   * @function show
   * @param {string} name - name of the passage
   */
  show (name) {
    // Look for passage by name.
    const passage = this.getPassageByName(name);

    // passage will be null if it was not found.
    if (passage === null) {
      // Passage was not found.
      // Throw error.
      throw new Error(`There is no passage with the name ${name}`);
    }

    // Set the global passage to the one about to be shown.
    window.passage = passage;

    // Overwrite current tags.
    this.passageElement.attr('tags', passage.tags);

    // Get passage source by name.
    let passageSource = this.include(passage.name);

    // Run any script
    passageSource = this.runScript(passageSource);

    // Parse any Markdown.
    passageSource = Markdown.parse(passageSource);

    // Overwrite any existing HTML.
    this.passageElement.html(passageSource);

    /**
     * Triggered when a passage is shown
     *
     * @event State#show
     * @type {string}
     */
    State.events.emit('show', passage.name);
  }

  /**
   * Returns the source of a passage by name.
   *
   * @function include
   * @param {string} name - name of the passage.
   * @returns {string} Passage source.
   */
  include (name) {
    // Search for passage by name.
    const passage = this.getPassageByName(name);

    // Does this passage exist?
    if (passage === null) {
      // It does not exist.
      // Throw error.
      throw new Error('There is no passage with name ' + name);
    }

    // Return the passage source.
    return passage.source;
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
          Storage: Storage,
          Storylets: this.storylets,
          Story: {
            renderPassageToSelector: this.renderPassageToSelector.bind(this),
            include: this.include.bind(this),
            getPassageByName: this.getPassageByName.bind(this),
            getPassagesByTag: this.getPassagesByTag.bind(this),
            undo: this.undo.bind(this),
            redo: this.redo.bind(this),
            show: this.show.bind(this),
            addPassage: this.addPassage.bind(this),
            removePassage: this.removePassage.bind(this),
            goto: this.goto.bind(this),
            applyExternalStyles: this.applyExternalStyles.bind(this)
          },
          either: this.either.bind(this),
          History: {
            hasVisited: History.hasVisited,
            visited: History.visited
          },
          Screen: {
            lock: this.screenLock.bind(this),
            unlock: this.screenUnlock.bind(this)
          },
          Sidebar: {
            hide: this.sidebarHide.bind(this),
            show: this.sidebarShow.bind(this)
          }
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
   * @function renderPassageToSelector
   * @param {object} passageName - The passage to render
   * @param {string} selector - jQuery selector
   */
  renderPassageToSelector (passageName, selector) {
    // Get passage source
    let passageSource = this.include(passageName);

    // Run any possible template scripts.
    passageSource = this.runScript(passageSource);

    // Run the Markdown parsing.
    passageSource = Markdown.parse(passageSource);

    // Replace the HTML of the selector (if valid).
    $(selector).html(passageSource);
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

  /**
   * Trigger undo event
   *
   * @function undo
   */
  undo () {
    State.events.emit('undo');
  }

  /**
   * Trigger redo event
   *
   * @function redo
   */
  redo () {
    State.events.emit('redo');
  }

  /**
   * Trigger screenLock event
   *
   * @function screenLock
   */
  screenLock () {
    State.events.emit('screen-lock');
  }

  /**
   * Trigger screenUnlock event
   *
   * @function screenUnlock
   */
  screenUnlock () {
    State.events.emit('screen-unlock');
  }

  /**
   * Trigger sidebar-show event.
   *
   * @function sidebarShow
   */
  sidebarShow () {
    State.events.emit('sidebar-show');
  }

  /**
   * Trigger sidebar-hide event.
   *
   * @function sidebarHide
   */
  sidebarHide () {
    State.events.emit('sidebar-hide');
  }

  /**
   * Add a new passage to the story.
   *
   * @function addPassage
   * @param {string} name name
   * @param {Array} tags tags
   * @param {string} source source
   */
  addPassage (name = '', tags = [], source = '') {
    // Look for name.
    const nameSearch = this.getPassageByName(name);

    // Confirm name does not already exist.
    if (nameSearch !== null) {
      throw new Error('Cannot add two passages with the same name!');
    }

    // Confirm tags is an array.
    if (!Array.isArray(tags)) {
      // Ignore and set to empty array.
      tags = [];
    }

    // Confirm if source is string.
    if (Object.prototype.toString.call(source) !== '[object String]') {
      // Ignore and set to empty string.
      source = '';
    }

    // Add to the existing passages.
    this.passages.push(new Passage(
      name,
      tags,
      Markdown.unescape(source)
    ));
  }

  /**
   * Remove a passage from the story internal collection.
   * Removing a passage and then attempting to visit the passage will
   * throw an error.
   *
   * Note: Does not affect HTML elements.
   *
   * @function removePassage
   * @param {string} name name
   */
  removePassage (name = '') {
    this.passages = this.passages.filter(passage => {
      return passage.name !== name;
    });
  }

  /**
   * Go to an existing passage in the story. Unlike `Story.show()`, this will add to the history.
   *
   * Throws error if passage does not exist.
   *
   * @function goto
   * @param {string} name name of passage
   */
  goto (name = '') {
    // Look for passage.
    const passage = this.getPassageByName(name);

    // Does passage exist?
    if (passage === null) {
      // Throw error.
      throw new Error(`There is no passage with the name ${name}`);
    }

    // Add to the history.
    History.add(name);

    // Hide the redo icon.
    this.redoIcon.css('visibility', 'hidden');

    // Show the passage by name.
    this.show(name);
  }
}

module.exports = Story;
