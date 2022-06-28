const State = require('./State.js');

class History {
  /**
   * Create the initial history values.
   *
   * @function init
   */
  static init () {
    this.history = [];
    this.position = 0;
  }

  /**
   * Add a passage name to the history array.
   *
   * @function add
   * @param {string} name - Name of the passage to add
   */
  static add (name) {
    // Append to the end
    History.history.push({
      passageName: name,
      state: Object.assign({}, State.store)
    });

    // Reset the position to entry at the end
    History.position = History.history.length - 1;
  }

  /**
   * Step back one index in the history array.
   *
   * @function undo
   * @returns {string | null} Name of now current passage; null if undo not possible.
   */
  static undo () {
    let result = null;

    if (History.history.length > 1) {
      // Decrease position
      History.position -= 1;
      // Find state.
      const state = History.history[History.position].state;
      // Have State update itself.
      State.updateState(state);
      // Return current passage name
      result = History.history[History.position].passageName;
    }

    return result;
  }

  /**
   * Step forward in history array, if possible.
   *
   * @function Redo
   * @returns {string | null} Name of now current passage; null if redo not possible.
   */
  static redo () {
    let result = null;

    if (History.position < History.history.length - 1) {
      // Increase position
      History.position += 1;
      // Find state.
      const state = History.history[History.position].state;
      // Have State update itself.
      State.updateState(state);
      // Return current passage name
      result = History.history[History.position].passageName;
    }

    return result;
  }

  /**
   * Returns true if the named passage exists within the history array.
   *
   * @function hasVisited
   * @param {string | Array} passageName - Name(s) of passage to check.
   * @returns {boolean} True if passage(s) in history; false otherwise.
   */
  static hasVisited (passageName = null) {
    let result = false;

    if (Array.isArray(passageName)) {
      result = passageName.every((passageName) => {
        return History.history.some(entry => {
          return entry.passageName === passageName;
        });
      });
    } else {
      result = History.history.some((p) => {
        return p.passageName === passageName;
      });
    }

    return result;
  }

  /**
   * Returns number of visits for a single passage.
   *
   * @function visited
   * @param {string} passageName - Passage name to check.
   * @returns {number} Number of visits to passage.
   */
  static visited (passageName) {
    return History.history.filter(entry => entry.passageName === passageName).length;
  }
}

module.exports = History;
