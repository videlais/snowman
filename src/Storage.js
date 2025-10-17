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
      globalThis.localStorage.removeItem(`${save}.snowman.history`);
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
      history = globalThis.localStorage.getItem(`${save}.snowman.history`);
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
      globalThis.localStorage.setItem(`${save}.snowman.history`, JSON.stringify(saveData));
      result = true;
    }

    return result;
  }

  /**
   * Parses and normalizes save data format
   * @private
   * @param {any} parsedData - The parsed JSON data
   * @returns {object} Normalized history data with history array and position
   */
  static _normalizeSaveData (parsedData) {
    if (Array.isArray(parsedData)) {
      // Old format: just an array of history entries
      return {
        history: parsedData,
        position: Math.max(0, parsedData.length - 1)
      };
    }
    
    if (parsedData && typeof parsedData === 'object' && 'history' in parsedData) {
      // New format: object with history and position properties
      return {
        history: parsedData.history || [],
        position: typeof parsedData.position === 'number' ? parsedData.position : 0
      };
    }
    
    // Fallback for unexpected formats
    return { history: [], position: 0 };
  }

  /**
   * Resets history to safe state
   * @private
   */
  static _resetToSafeState () {
    History.history = [];
    History.position = 0;
  }

  /**
   * Attempts to restore the history and store based on optional save name
   * @function restoreSave
   * @param {string} save Optional name of save string
   * @returns {boolean} Returns true if restore was successful
   */
  static restoreSave (save = 'default') {
    if (!Storage.available()) {
      return false;
    }

    const historyData = globalThis.localStorage.getItem(`${save}.snowman.history`);
    if (historyData === null) {
      return true;
    }

    try {
      const parsedData = JSON.parse(historyData);
      const { history, position } = Storage._normalizeSaveData(parsedData);
      
      History.history = history;
      History.position = Math.min(position, Math.max(0, history.length - 1));
      
      // Restore state if we have valid history
      if (history.length > 0 && History.position >= 0) {
        const state = history[History.position].state;
        State.updateState(state);
      }
      
      return true;
    } catch (error) {
      console.warn('Warning: Failed to parse save data, resetting to safe state:', error.message);
      Storage._resetToSafeState();
      return false;
    }
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
      globalThis.localStorage.setItem('testKey', 'test');
      globalThis.localStorage.removeItem('testKey');
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
      globalThis.localStorage.clear();
      // Record result
      result = true;
    }
    // Return result
    return result;
  }
}

module.exports = Storage;
