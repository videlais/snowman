import DOMUtils from './DOMUtils.js';
import State from './State.js';
import $ from 'jquery';

class Sidebar {
  constructor () {
    /**
     * Reference to undo icon.
     * @property {Element} undoIcon - Undo element.
     * @type {Element}
     */
    this.undoIcon = DOMUtils.select('tw-icon[title="Undo"]');

    /**
     * Reference to redo icon.
     * @property {Element} redoIcon - Redo element.
     * @type {Element}
     */
    this.redoIcon = DOMUtils.select('tw-icon[title="Redo"]');

    // For backward compatibility with tests, add jQuery methods to elements
    if (this.undoIcon) {
      const $undoIcon = $(this.undoIcon);
      this.undoIcon.css = $undoIcon.css.bind($undoIcon);
      this.undoIcon.trigger = $undoIcon.trigger.bind($undoIcon);
    }

    if (this.redoIcon) {
      const $redoIcon = $(this.redoIcon);
      this.redoIcon.css = $redoIcon.css.bind($redoIcon);
      this.redoIcon.trigger = $redoIcon.trigger.bind($redoIcon);
    }

    // Listen for user click interactions.
    DOMUtils.on(this.undoIcon, 'click', () => {
      // If undo is ever used, redo becomes available.
      this.showRedo();
      // Emit 'undo'
      State.events.emit('undo');
    });

    // Listen for user click interactions.
    DOMUtils.on(this.redoIcon, 'click', () => {
      State.events.emit('redo');
    });

    // Start with undo hidden.
    this.hideUndo();

    // Start with redo hidden.
    this.hideRedo();
  }

  /**
   * Show undo icon.
   * @function showUndo
   */
  showUndo () {
    DOMUtils.css(this.undoIcon, 'visibility', 'visible');
  }

  /**
   * Hide undo icon.
   * @function hideUndo
   */
  hideUndo () {
    DOMUtils.css(this.undoIcon, 'visibility', 'hidden');
  }

  /**
   * Show redo icon.
   * @function showRedo
   */
  showRedo () {
    DOMUtils.css(this.redoIcon, 'visibility', 'visible');
  }

  /**
   * Hide redo icon.
   * @function hideRedo
   */
  hideRedo () {
    DOMUtils.css(this.redoIcon, 'visibility', 'hidden');
  }

  /**
   * Trigger undo event.
   * @function undo
   */
  undo () {
    State.events.emit('undo');
  }

  /**
   * Trigger redo event.
   * @function redo
   */
  redo () {
    State.events.emit('redo');
  }

  /**
   * Shows sidebar.
   * @function show
   */
  show () {
    // Show tw-sidebar.
    DOMUtils.css(DOMUtils.select('tw-sidebar'), 'visibility', 'visible');
  }

  /**
   * Hides sidebar.
   * @function hide
   */
  hide () {
    // Hide tw-sidebar.
    DOMUtils.css(DOMUtils.select('tw-sidebar'), 'visibility', 'hidden');
  }
}

export default Sidebar;
