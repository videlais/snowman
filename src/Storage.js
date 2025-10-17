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
      const saveData = {
        history: History.history,
        position: History.position
      };
      window.localStorage.setItem(`${save}.snowman.history`, JSON.stringify(saveData));
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
      try {
        const parsedData = JSON.parse(history);
        
        // Check if this is the new format (object with history and position)
        // or the old format (array of history entries)
        if (Array.isArray(parsedData)) {
          // Old format: just an array of history entries
          History.history = parsedData;
          // Set position to the last entry for backward compatibility
          History.position = Math.max(0, parsedData.length - 1);
        } else if (parsedData && typeof parsedData === 'object' && 'history' in parsedData) {
          // New format: object with history and position properties
          History.history = parsedData.history || [];
          History.position = typeof parsedData.position === 'number' ? parsedData.position : 0;
        } else {
          // Fallback for unexpected formats
          History.history = [];
          History.position = 0;
        }
        
        // Ensure position is within bounds
        if (History.position >= History.history.length) {
          History.position = Math.max(0, History.history.length - 1);
        }
        
        // Only try to restore state if we have valid history and position
        if (History.history.length > 0 && History.position >= 0) {
          const state = History.history[History.position].state;
          State.updateState(state);
        }
      } catch (e) {
        // If parsing fails, reset to safe state
        History.history = [];
        History.position = 0;
        result = false;
      }
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
    } catch(error) {
      console.info('Info: localStorage is not available. Error:', error);
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
