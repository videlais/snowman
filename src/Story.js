/**
 * @external Element
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Element}
 */
const $ = require('jquery');
const Passage = require('./Passage.js');
const Markdown = require('./Markdown.js');
const State = require('./State.js');
const History = require('./History.js');
const Storylets = require('./Storylets.js');
const Script = require('./Script.js');
const Sidebar = require('./Sidebar.js');
const Screen = require('./Screen.js');
const Storage = require('./Storage.js');

/**
 * An object representing the entire story. After the document has completed
 * loading, an instance of this class will be available at `window.Story`.
 *
 * @class Story
 */
class Story {
  constructor () {
    /**
     * @property {Element} storyDataElement - Reference to tw-storydata element.
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
     * An array of all passages.
     *
     * @property {Array} passages - Passages array.
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
        // Attempt to split by space.
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
     * Story element.
     *
     * @property {Element} storyElement Story element.
     * @type {Element}
     * @readonly
     */
    this.storyElement = $('tw-story');

    // Catch user clicking on links.
    this.storyElement.on('click', 'tw-link[data-passage]', (e) => {
      // Pull destination passage name from the attribute.
      const passageName = Markdown.unescape($(e.target).closest('[data-passage]').data('passage'));
      // Add to the history.
      History.add(passageName);
      // Hide the redo icon.
      this.sidebar.hideRedo();
      // Show the undo icon.
      this.sidebar.showUndo();
      // Show the passage by name.
      this.show(passageName);
    });

    /**
     * Passage element.
     *
     * @property {Element} passageElement Passage element
     * @type {Element}
     */
    this.passageElement = $('tw-passage');

    /**
     * Sidebar.
     *
     * @property {Element} sidebar Sidebar instance.
     * @type {Element}
     */
    this.sidebar = new Sidebar();

    /**
     * Reference to Sidebar.undo()
     *
     */
    this.undo = this.sidebar.undo.bind(this.sidebar);

    /**
     * Reference to Sidebar.redo()
     *
     */
    this.redo = this.sidebar.redo.bind(this.sidebar);

    // Reset History.
    History.reset();

    /**
     * History reference.
     *
     * @property {History} history Reference to History.
     * @type {History}
     */
    this.history = History;

    /**
     * Screen reference.
     *
     * @property {Screen} screen Reference to Screen.
     * @type {Screen}
     */
    this.screen = Screen;

    /**
     * Storage reference.
     *
     * @property {Storage} screen Reference to Storage.
     * @type {Storage}
     */
    this.storage = Storage;

    // Reset State.
    State.reset();

    /**
     * State.events reference.
     *
     * @property {EventEmitter} events Reference to State.events.
     * @type {EventEmitter}
     */
    this.events = State.events;

    /**
     * State.store reference.
     *
     * @property {Proxy} store Reference to State.store.
     * @type {Proxy}
     */
    this.store = State.store;

    // Listen for redo events.
    State.events.on('redo', () => {
      // Attempt to redo history.
      const passageName = History.redo();
      // If redo failed, name will be null.
      if (passageName !== null) {
        // Check if at end of collection.
        if (History.position === History.history.length - 1) {
          // Hide redo.
          this.sidebar.hideRedo();
          // Show undo.
          this.sidebar.showUndo();
        }
        // Not null, show previous passage.
        this.show(passageName);
      }
    });

    // Listen for undo events.
    State.events.on('undo', () => {
      // Show redo if undo is clicked.
      this.sidebar.showRedo();
      // Attempt to undo history.
      const passageName = History.undo();
      // If undo failed, name will be null.
      if (passageName !== null) {
        // Check if at beginning of collection.
        if (History.position === 0) {
          // Hide undo
          this.sidebar.hideUndo();
        }
        // Not null, show previous passage.
        this.show(passageName);
      }
    });

    /**
     * The current passage.
     *
     * @property {Passage|null} currentPassage Currently showing passage, if any.
     * @type {Passage|null}
     */
    this.currentPassage = null;

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

    // For each Twine style, add them to the body as extra style elements.
    $('*[type="text/twine-css"]').each((index, element) => {
      // Convert from Element into jQuery Element.
      const twineStyleElement = $(element);
      // Append a new `<style>` with text from old.
      $(document.body).append(`<style>${twineStyleElement.text()}</style>`);
    });

    /**
     * Note: Browsers prevent error catching from scripts
     *  added after the initial loading.
     *
     * window.onerror will have error, but it cannot
     *  be caught.
     */
    $('*[type="text/twine-javascript"]').each((index, element) => {
      // Convert Element into jQuery Element.
      const twineScriptElement = $(element);
      // Create a new `<script>`.
      const newScriptElement = $('<script>');
      // Set the text of new from old.
      newScriptElement.text(twineScriptElement.text());
      // Append the new `<script>` with text to document body.
      $(document.body).append(newScriptElement);
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
    this.currentPassage = passage;

    // Overwrite current tags
    this.passageElement.attr('tags', passage.tags);

    // Get passage source.
    const passageSource = this.include(passage.name);

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
   * Replaces current passage shown to reader with rendered source of named passage.
   * If the named passage does not exist, an error is thrown.
   *
   * @function show
   * @param {string} name name of the passage.
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

    // Set currentPassage to the one about to be shown.
    this.currentPassage = passage;

    // Overwrite current tags.
    this.passageElement.attr('tags', passage.tags);

    // Get passage source by name.
    const passageSource = this.include(passage.name);

    // Overwrite any existing HTML.
    this.passageElement.html(passageSource);

    /**
     * Triggered when a passage is shown.
     *
     * @event State#show
     * @type {string}
     */
    State.events.emit('show', passage.name);
  }

  /**
   * Returns the rendered source of a passage by name.
   *
   * @function include
   * @param {string} name - name of the passage.
   * @returns {string} Rendered passage source.
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

    // Get passage source.
    let passageSource = passage.source;

    // Run any script.
    passageSource = Script.run(passageSource, this);

    // Parse any Markdown.
    passageSource = Markdown.parse(passageSource);

    // Run the Markdown conversion.
    passageSource = Markdown.convert(passageSource);

    // Return the passage source.
    return passageSource;
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
    const passageSource = this.include(passageName);

    // Replace the HTML of the selector (if valid).
    $(selector).html(passageSource);
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
    this.sidebar.hideRedo();

    // Show the passage by name.
    this.show(name);
  }
}

module.exports = Story;
