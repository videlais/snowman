const EventEmitter = require('events');

class State {
  static createStore () {
    // Public event emitter
    this.events = new EventEmitter();

    // Internal array of visited passages
    this.history = [];

    // Internal position of history stack
    this.position = 0;

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

    // Create a global 's' that acts like an object
    this.proxy = new Proxy(this.store, handler);

    // Listen for all navigation events.
    // These happen when a user clicks on a link
    this.events.on('navigation', dest => {
      this.history.push(dest);
      this.position++;
    });

    this.events.on("undo", () => {
      if(this.position > 0) {
        this.position--;
      }
      window.story.show(this.history[this.position]);
    });
  }

  /**
   * Resets the localStorage
   *
   * @function clear
   */
  static clear () {
    localStorage.clear();
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
    let result = true;

    try {
      history = localStorage.getItem(`${save}.snowman.history`);
      store = localStorage.getItem(`${save}.snowman.store`);
    } catch (e) {
      result = false;
    }

    return (history !== null) && (store !== null) && result;
  }

  /**
   * Save history and store using optional string prefix
   *
   * @function save
   * @param {string} save - Optional name of save string
   * @returns {boolean} - Returns true if save was successful
   */
  static save (save = 'default') {
    let result = true;

    try {
      localStorage.setItem(`${save}.snowman.history`, JSON.stringify(this.history));
      localStorage.setItem(`${save}.snowman.store`, JSON.stringify(this.store));
    } catch (e) {
      result = false;
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
    let result = true;

    try {
      history = localStorage.getItem(`${save}.snowman.history`);
      store = localStorage.getItem(`${save}.snowman.store`);
    } catch (e) {
      result = false;
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
   * Returns true if the named passage exists within the history array
   *
   * @function hasVisited
   * @param {string | Array} passageName - Name(s) of passage to check
   * @returns {boolean} - True if passage(s) in history; false otherwise
   */
  static hasVisited (passageName) {
    let result = false;

    if (Array.isArray(passageName)) {
      result = passageName.every((p) => {
        return this.history.includes(p);
      });
    } else {
      result = this.history.some((p) => {
        return p === passageName;
      });
    }

    return result;
  }
}

module.exports = State;
