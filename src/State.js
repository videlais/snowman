const EventEmitter = require('events');

class State {
  /**
   * Creates internal event emitter and store proxy
   *
   * @function createStore
   */
  static createStore () {
    // Public event emitter
    this.events = new EventEmitter();

    // Internal array of visited passages
    this.history = [];

    // Internal store
    this.store = {};

    // Act like an object, but emit on any changes
    const handler = {
      get: (target, property) => {
        return target[property];
      },
      set: (target, property, value) => {
        // Make change
        target[property] = value;
        // Emit change
        this.events.emit('change', property, value);
      }
    };

    // Create a proxy that acts like an object.
    this.proxy = new Proxy(this.store, handler);
  }

  /**
   * Remove save by name from the localStorage
   *
   * @function remove
   * @param {string} save - Name of save string
   * @returns {boolean} - True if remove was successful
   */
  static remove (save = 'default') {
    let result = false;

    if (window.localStorage !== null) {
      window.localStorage.removeItem(`${save}.snowman.history`);
      window.localStorage.removeItem(`${save}.snowman.store`);
      result = true;
    }

    return result;
  }

  /**
   * Returns if save string exists in localStorage
   *
   * @function exists
   * @param {string} save - Name of save string
   * @returns {boolean} - True if save string exists (is not null)
   */
  static exists (save = 'default') {
    let history = null;
    let store = null;

    if (window.localStorage !== null) {
      history = window.localStorage.getItem(`${save}.snowman.history`);
      store = window.localStorage.getItem(`${save}.snowman.store`);
    }

    return (history !== null) && (store !== null);
  }

  /**
   * Save history and store using optional string prefix
   *
   * @function save
   * @param {string} save - Optional name of save string
   * @returns {boolean} - Returns true if save was successful
   */
  static save (save = 'default') {
    let result = false;

    if (window.localStorage !== null) {
      window.localStorage.setItem(`${save}.snowman.history`, JSON.stringify(this.history));
      window.localStorage.setItem(`${save}.snowman.store`, JSON.stringify(this.store));
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
    let store = null;
    let result = false;

    if (window.localStorage !== null) {
      history = window.localStorage.getItem(`${save}.snowman.history`);
      store = window.localStorage.getItem(`${save}.snowman.store`);
      result = true;
    }

    if (history !== null) {
      this.history = JSON.parse(history);
    }

    if (store !== null) {
      this.store = JSON.parse(store);
    }

    return result;
  }

  /**
   * Returns true if the named passage exists within State history array
   *
   * @function hasVisited
   * @param {string | Array} passageName - Name(s) of passage to check
   * @returns {boolean} - True if passage(s) in history; false otherwise
   */
  static hasVisited (passageName = null) {
    let result = false;

    if (Array.isArray(passageName)) {
      result = passageName.every((p) => {
        return State.history.includes(p);
      });
    } else {
      result = State.history.some((p) => {
        return p === passageName;
      });
    }

    return result;
  }
}

module.exports = State;
