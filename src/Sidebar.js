const $ = require('jquery');
const State = require('./State.js');

class Sidebar {
  constructor () {
    /**
     * Reference to undo icon.
     *
     * @property {Element} undoIcon - Undo element.
     * @type {Element}
     */
    this.undoIcon = $('tw-icon[title="Undo"]');

    /**
     * Reference to redo icon.
     *
     * @property {Element} redoIcon - Redo element.
     * @type {Element}
     */
    this.redoIcon = $('tw-icon[title="Redo"]');

    /**
     * Reference to tw-sidebar element.
     *
     * @property {Element} sidebar  Sidebar element.
     * @type {Element}
     */
    this.sidebar = $('tw-sidebar');

    // Listen for user click interactions
    this.undoIcon.on('click', () => {
      // If undo is ever used, redo becomes available.
      this.showRedo();
      // Emit 'undo'
      State.events.emit('undo');
    });

    // Listen for user click interactions.
    this.redoIcon.on('click', () => {
      State.events.emit('redo');
    });

    // Start with undo hidden.
    this.hideUndo();

    // Start with redo hidden.
    this.hideRedo();
  }

  /**
   * Show undo icon.
   *
   * @function showUndo
   */
  showUndo () {
    this.undoIcon.css('visibility', 'visible');
  }

  /**
   * Hide undo icon.
   *
   * @function hideUndo
   */
  hideUndo () {
    this.undoIcon.css('visibility', 'hidden');
  }

  /**
   * Show redo icon.
   *
   * @function showRedo
   */
  showRedo () {
    this.redoIcon.css('visibility', 'visible');
  }

  /**
   * Hide redo icon.
   *
   * @function hideRedo
   */
  hideRedo () {
    this.redoIcon.css('visibility', 'hidden');
  }

  /**
   * Trigger undo event.
   *
   * @function undo
   */
  undo () {
    State.events.emit('undo');
  }

  /**
   * Trigger redo event.
   *
   * @function redo
   */
  redo () {
    State.events.emit('redo');
  }

  /**
   * Shows sidebar.
   *
   * @function show
   */
  show () {
    // Show tw-sidebar.
    $('tw-sidebar').css('visibility', 'visible');
  }

  /**
   * Hides sidebar.
   *
   * @function hide
   */
  hide () {
    // Hide tw-sidebar.
    $('tw-sidebar').css('visibility', 'hidden');
  }
}

module.exports = Sidebar;
