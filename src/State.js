const EventEmitter = require('events');

const handler = {
  get: (target, property) => {
    return target[property];
  },
  set: (target, property, value) => {
    // Make change.
    target[property] = value;
    // Emit change.
    State.events.emit('change', property, value);
    // Return true.
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

/**
 * @class State
 */
class State {
  static events = new EventEmitter();
  static store = new Proxy({}, handler);
  /**
   * Update current state properties to previous state values.
   *
   * @param {object} state - Object containing state properties.
   */
  static updateState (state) {
    for (const property in state) {
      this.store[property] = state[property];
    }
  }

  /**
   * Resets State properties to default values.
   */
  static reset () {
    this.events = new EventEmitter();
    this.store = new Proxy({}, handler);
  }
}

module.exports = State;
