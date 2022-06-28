const EventEmitter = require('events');

class State {
  /**
   * Creates internal event emitter and store proxy.
   *
   * @function init
   */
  static init () {
    // Public event emitter.
    this.events = new EventEmitter();

    // Act like an object, but emit on any changes.
    const handler = {
      get: (target, property) => {
        return target[property];
      },
      set: (target, property, value) => {
        // Make change
        target[property] = value;
        // Emit change
        this.events.emit('change', property, value);
        // Return true
        return true;
      },
      ownKeys: (target) => {
        return Object.keys(target);
      },
      getOwnPropertyDescriptor: () => {
        return {
          enumerable: true,
          configurable: true
        };
      }
    };

    // Create a proxy that acts like an object.
    this.store = new Proxy({}, handler);
  }

  /**
   * Update current state properties to previous state values
   *
   * @function updateState
   * @param {object} state - Object containing state properties.
   */
  static updateState (state) {
    for (const property in state) {
      State.store[property] = state[property];
    }
  }
}

module.exports = State;
