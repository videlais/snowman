import State from './State.js';

/**
 * @namespace History
 * @property {Array}    history   Array of passages and previous state.
 * @property {number}   position  Current position in the array.
 */

class History {
  static history = [];
  static position = 0;
  /**
   * Add a passage name to the history array.
   * @function add
   * @param {string} name - Name of the passage to add.
   */
  static add (name) {
    // Append to the end
    this.history.push({
      passageName: name,
      state: Object.assign({}, State.store)
    });

    // Reset the position to entry at the end.
    this.position = this.history.length - 1;
  }

  /**
   * Step back one index in the history array.
   * @function undo
   * @returns {string | null} Name of now current passage; null if undo not possible.
   */
  static undo () {
    let result = null;

    if (this.position >= 1 && this.history.length >= 1) {
      // Decrease position
      this.position -= 1;
      // Find state.
      const state = this.history[this.position].state;
      // Have State update itself.
      State.updateState(state);
      // Return current passage name
      result = this.history[this.position].passageName;
    }

    return result;
  }

  /**
   * Step forward in history array, if possible.
   * @function Redo
   * @returns {string | null} Name of now current passage; null if redo not possible.
   */
  static redo () {
    let result = null;

    if (this.position >= 0 && this.position < this.history.length - 1) {
      // Increase position
      this.position += 1;
      // Find state.
      const state = this.history[this.position].state;
      // Have State update itself.
      State.updateState(state);
      // Return current passage name
      result = this.history[this.position].passageName;
    }

    return result;
  }

  /**
   * Returns true if the named passage exists within the history array.
   * @function hasVisited
   * @param {string | Array} passageName - Name(s) of passage to check.
   * @returns {boolean} True if passage(s) in history; false otherwise.
   */
  static hasVisited (passageName = null) {
    let result = false;

    if (Array.isArray(passageName)) {
      result = passageName.every((passageName) => {
        return this.history.some(entry => {
          return entry.passageName === passageName;
        });
      });
    } else {
      result = this.history.some((p) => {
        return p.passageName === passageName;
      });
    }

    return result;
  }

  /**
   * Returns number of visits for a single passage.
   * @function visited
   * @param   {string} passageName  Passage name to check.
   * @returns {number}              Number of visits to passage.
   */
  static visited (passageName) {
    let searchResults = [];
    searchResults = this.history.filter(entry => entry.passageName === passageName);
    return searchResults.length;
  }

  /**
   * Resets History values to defaults.
   * @function reset
   */
  static reset () {
    this.history = [];
    this.position = 0;
  }
}

export default History;
