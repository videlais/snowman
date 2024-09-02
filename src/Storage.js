const History = require('./History.js');
const State = require('./State.js');

class Storage {
  /**
   * Remove save by name from the localStorage.
   * @function removeSave
   * @param {string} save Name of save string.
   * @returns {boolean} True if remove was successful.
   */
  static removeSave (save = 'default') {
    let result = false;

    if (Storage.available()) {
      window.localStorage.removeItem(`${save}.snowman.history`);
      result = true;
    }

    return result;
  }

  /**
   * Returns if save string exists in localStorage
   * @function doesSaveExist
   * @param {string} save Name of save string
   * @returns {boolean} True if save string exists
   */
  static doesSaveExist (save = 'default') {
    let history = null;

    if (Storage.available()) {
      history = window.localStorage.getItem(`${save}.snowman.history`);
    }

    return (history !== null);
  }

  /**
   * Save history using optional string prefix
   * @function createSave
   * @param {string} save Optional name of save string
   * @returns {boolean} Returns true if save was successful
   */
  static createSave (save = 'default') {
    let result = false;

    if (Storage.available()) {
      window.localStorage.setItem(`${save}.snowman.history`, JSON.stringify(History.history));
      result = true;
    }

    return result;
  }

  /**
   * Attempts to restore the history and store based on optional save name
   * @function restoreSave
   * @param {string} save Optional name of save string
   * @returns {boolean} Returns true if restore was successful
   */
  static restoreSave (save = 'default') {
    let history = null;
    let result = false;

    if (Storage.available()) {
      history = window.localStorage.getItem(`${save}.snowman.history`);
      result = true;
    }

    if (history !== null) {
      // Restore history
      History.history = JSON.parse(history);
      // Find current state.
      const state = History.history[History.position].state;
      // Have State update itself.
      State.updateState(state);
    }

    return result;
  }

  /**
   * Returns if localStorage is available or not in browser context.
   * @function available
   * @returns {boolean} Returns true if localStorage can be used.
   */
  static available () {
    // Set default value to false.
    let result = false;

    try {
      window.localStorage.setItem('testKey', 'test');
      window.localStorage.removeItem('testKey');
      result = true;
    } finally {
      // If an error was thrown, we do nothing.
      // The method will return false if it did not work.
    }

    // Return result
    return result;
  }

  /**
   * Clears localStorage, if available.
   * @function removeAll
   * @returns {boolean} Returns true if removal was possible.
   */
  static removeAll () {
    // Set default value to false.
    let result = false;
    // Is localStorage available?
    if (Storage.available()) {
      // Clear the localStorage
      window.localStorage.clear();
      // Record result
      result = true;
    }
    // Return result
    return result;
  }
}

module.exports = Storage;
