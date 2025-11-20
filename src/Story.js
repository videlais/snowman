/**
 * @external Element
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Element}
 */
import { getServiceContainer } from './ServiceRegistry.js';
import Passage from './Passage.js';
import Storylets from './Storylets.js';

/**
 * An object representing the entire story. After the document has completed
 * loading, an instance of this class will be available at `window.Story`.
 * @class Story
 */
class Story {
  /**
   * Create a Story object based on tw-storydata element.
   * @param {ServiceContainer} container - Optional service container for dependency injection
   */
  constructor (container = null) {
    // Get service container (use provided or global)
    this.container = container || getServiceContainer();
    
    // Inject dependencies
    this.domUtils = this.container.resolve('domUtils');
    this.markdown = this.container.resolve('markdown');
    this.state = this.container.resolve('state');
    this.history = this.container.resolve('history');
    this.storyletsModule = this.container.resolve('storylets');
    this.script = this.container.resolve('script');
    this.screen = this.container.resolve('screen');
    this.storage = this.container.resolve('storage');

    /**
     * @property {string} name - The name of the story.
     * @type {string}
     * @readonly
     */
    this.name = this.domUtils.attr('tw-storydata', 'name');

    /**
     * An array of all passages.
     * @property {Array} passages - Passages array.
     * @type {Array}
     */
    this.passages = [];

    // For each child element of the `<tw-storydata>` element,
    //  create a new Passage object based on its attributes.
    this.domUtils.each(this.domUtils.children('tw-storydata', 'tw-passagedata'), (index, element) => {
      // Access any potential tags.
      let tags = this.domUtils.attr(element, 'tags');

      // Does the 'tags' attribute exist?
      if (tags !== '' && tags !== undefined) {
        // Attempt to split by space.
        tags = tags.split(' ');
      } else {
        // It did not exist, so we create it as an empty array.
        tags = [];
      }

      // Push the new passage.
      // Only unescape EJS template delimiters, not all HTML
      let source = this.domUtils.html(element);
      source = source.replaceAll('&lt;%', '<%').replaceAll('%&gt;', '%>');
      
      this.passages.push(new Passage(
        this.domUtils.attr(element, 'name'),
        tags,
        source
      ));
    });

    /**
     * Passage element.
     * @property {Element} passageElement Passage element.
     * @type {Element}
     */
    this.passageElement = this.domUtils.select('tw-passage');

    /**
     * Sidebar.
     * @property {Element} sidebar Sidebar instance.
     * @type {Element}
     */
    this.sidebar = this.container.resolve('sidebar');

    // Reset History.
    this.history.reset();

    /**
     * History reference.
     * @property {History} history Reference to History.
     * @type {History}
     */
    // this.history already set above

    /**
     * Screen reference.
     * @property {Screen} screen Reference to Screen.
     * @type {Screen}
     */
    // this.screen already set above

    /**
     * Storage reference.
     * @property {Storage} storage Reference to Storage.
     * @type {Storage}
     */
    // this.storage already set above

    // Reset State.
    this.state.reset();

    /**
     * State.events reference.
     * @property {EventEmitter} events Reference to State.events.
     * @type {EventEmitter}
     */
    this.events = this.state.events;

    /**
     * State.store reference.
     * @property {Proxy} store Reference to State.store.
     * @type {Proxy}
     */
    this.store = this.state.store;

    // Listen for redo events.
    this.state.events.on('redo', () => {
      // Attempt to redo history.
      const passageName = this.history.redo();
      // If redo failed, name will be null.
      if (passageName !== null) {
        // Check if at end of collection.
        if (this.history.position === this.history.history.length - 1) {
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
    this.state.events.on('undo', () => {
      // Show redo if undo is clicked.
      this.sidebar.showRedo();
      // Attempt to undo history.
      const passageName = this.history.undo();
      // If undo failed, name will be null.
      if (passageName !== null) {
        // Check if at beginning of collection.
        if (this.history.position === 0) {
          // Hide undo
          this.sidebar.hideUndo();
        }
        // Not null, show previous passage.
        this.show(passageName);
      }
    });

    /**
     * The current passage.
     * @property {Passage|null} currentPassage Currently showing passage, if any.
     * @type {Passage|null}
     */
    this.currentPassage = null;

    /**
     * Reference to internal Storylets object.
     *
     * Starts as null. During Story.start(), a new object is
     * created based on initial passages.
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
   * @function start
   */
  start () {
    // Find all passages with the tag 'storylet'.
    const passageList = this.getPassagesByTag('storylet');
    // Generate initial Storylets collection.
    this.storylets = new Storylets(passageList);

    // For each Twine style, add them to the body as extra style elements.
    this.domUtils.each('*[type="text/twine-css"]', (index, element) => {
      // Append a new `<style>` with text from old.
      this.domUtils.append(document.body, `<style>${this.domUtils.text(element)}</style>`);
    });

    /**
     * Note: Browsers prevent error catching from scripts
     *  added after the initial loading.
     *
     * window.onerror will have error, but it cannot
     *  be caught.
     */
    this.domUtils.each('*[type="text/twine-javascript"]', (index, element) => {
      // Create a new `<script>`.
      const newScriptElement = this.domUtils.createElement('script');
      // Set the text of new from old.
      this.domUtils.text(newScriptElement, this.domUtils.text(element));
      // Append the new `<script>` with text to document body.
      this.domUtils.append(document.body, newScriptElement);
    });

    // Get the startnode value (which is a number).
    const startingPassageID = Number.parseInt(this.domUtils.attr('tw-storydata', 'startnode'));
    // Use the PID to find the name of the starting passage based on elements.
    const startPassage = this.domUtils.attr(`[pid="${startingPassageID}"]`, 'name');
    // Search for the starting passage.
    const passage = this.getPassageByName(startPassage);

    // Does the starting passage exist?
    if (passage === null) {
      // It does not exist.
      // Throw an error.
      throw new Error('Starting passage does not exist!');
    }

    // Add to the history.
    this.history.add(passage.name);

    // Set the global passage to the one about to be shown.
    this.currentPassage = passage;

    // Overwrite current tags
    this.domUtils.attr(this.passageElement, 'tags', passage.tags);

    // Get passage source.
    const passageSource = this.include(passage.name);

    // Overwrite the parsed with the rendered.
    this.domUtils.html(this.passageElement, passageSource);

    // Listen for any reader clicking on `<tw-link>`.
    this.domUtils.on('tw-link[data-passage]', 'click', (event) => {
      // Retrieve data-passage value.
      const passageName = this.domUtils.attr(event.target, 'data-passage');
      // Add to the history.
      this.history.add(passageName);
      // Hide the redo icon.
      this.sidebar.hideRedo();
      // Show the undo icon.
      this.sidebar.showUndo();
      // Show the passage by name.
      this.show(passageName);
    });

    /**
     * Triggered when the story starts.
     * @event State#start
     * @type {string}
     */
    this.state.events.emit('start', passage.name);
  }

  /**
   * Returns an array of none, one, or many passages matching a specific tag.
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
   * this always returns the first search result.
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
    this.domUtils.attr(this.passageElement, 'tags', passage.tags);

    // Get passage source by name.
    const passageSource = this.include(passage.name);

    // Overwrite any existing HTML.
    this.domUtils.html(this.passageElement, passageSource);

    // Listen for any reader clicking on `<tw-link>`.
    this.domUtils.on('tw-link[data-passage]', 'click', (event) => {
      // Retrieve data-passage value.
      const passageName = this.domUtils.attr(event.target, 'data-passage');
      // Add to the history.
      this.history.add(passageName);
      // Hide the redo icon.
      this.sidebar.hideRedo();
      // Show the undo icon.
      this.sidebar.showUndo();
      // Show the passage by name.
      this.show(passageName);
    });

    /**
     * Triggered when a passage is shown.
     * @event State#show
     * @type {string}
     */
    this.state.events.emit('show', passage.name);
  }

  /**
   * Returns the rendered source of a passage by name.
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
    passageSource = this.script.run(passageSource, this);

    // Parse any Markdown.
    passageSource = this.markdown.parse(passageSource);

    // Run the Markdown conversion.
    passageSource = this.markdown.convert(passageSource);

    // Return the passage source.
    return passageSource;
  }

  /**
   * Render a passage by name to a CSS selector.
   * @function renderPassageToSelector
   * @param {string} passageName - Name of passage to include.
   * @param {string} selector - CSS selector to use.
   */
  renderPassageToSelector (passageName, selector) {
    // Get passage source
    const passageSource = this.include(passageName);

    // Replace the HTML of the selector (if valid).
    this.domUtils.html(selector, passageSource);
  }

  /**
   * Add a new passage to the story.
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
      this.markdown.unescape(source)
    ));
  }

  /**
   * Remove a passage from the story internal collection.
   * Removing a passage and then attempting to visit the passage will
   * throw an error.
   *
   * Note: Does not affect HTML elements.
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
    this.history.add(name);

    // Hide the redo icon.
    this.sidebar.hideRedo();

    // Show the passage by name.
    this.show(name);
  }
}

export default Story;
