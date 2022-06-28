const History = require('./History.js');
const State = require('./State.js');

class Storage {
  /**
   * Remove save by name from the localStorage
   *
   * @function removeSave
   * @param {string} save - Name of save string
   * @returns {boolean} - True if remove was successful
   */
  static removeSave (save = 'default') {
    let result = false;

    if (window.localStorage !== null) {
      window.localStorage.removeItem(`${save}.snowman.history`);
      result = true;
    }

    return result;
  }

  /**
   * Returns if save string exists in localStorage
   *
   * @function doesSaveExist
   * @param {string} save - Name of save string
   * @returns {boolean} - True if save string exists (is not null)
   */
  static doesSaveExist (save = 'default') {
    let history = null;

    if (window.localStorage !== null) {
      history = window.localStorage.getItem(`${save}.snowman.history`);
    }

    return (history !== null);
  }

  /**
   * Save history using optional string prefix
   *
   * @function save
   * @param {string} save - Optional name of save string
   * @returns {boolean} - Returns true if save was successful
   */
  static save (save = 'default') {
    let result = false;

    if (window.localStorage !== null) {
      window.localStorage.setItem(`${save}.snowman.history`, JSON.stringify(History.history));
      result = true;
    }

    return result;
  }

  /**
   * Attempts to restore the history and store based on optional save name
   *
   * @function restore
   * @param {string} save - Optional name of save string
   * @returns {boolean} - Returns true if restore was successful
   */
  static restore (save = 'default') {
    let history = null;
    let result = false;

    if (window.localStorage !== null) {
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
}

module.exports = Storage;
