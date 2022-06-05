const State = require('../src/State.js');

describe('State', () => {
  beforeEach(() => {
    State.createStore();
    localStorage.clear();
  });

  describe('constructor()', () => {
    it('Should provide event emitter for use of navigation and other events', () => {
      State.events.on('navigation', () => {
        State.history.push('Test');
      });
      State.events.emit('navigation', 'new');
      expect(State.history.length).toBe(1);
    });

    it('Should provide access to proxy as if store', () => {
      State.proxy.a = 'Hi';
      expect(State.store.a).toBe('Hi');
    });

    it('Should detect if a property is changed in store', () => {
      let test = false;
      State.events.on('change', (property, value) => {
        test = value;
      });

      State.proxy.a = true;

      expect(test).toBe(true);
    });
  });

  describe('save()', () => {
    it('Should use default string prefix', () => {
      State.store.a = 'Hi';
      State.history = ['Hi'];
      State.save();
      const test = JSON.parse(localStorage.getItem('default.snowman.store'));
      expect(test.a).toBe('Hi');
    });

    it('Should save store to local storage using provided string prefix', () => {
      State.store.a = 'Hi';
      State.save('test');
      const test = JSON.parse(localStorage.getItem('test.snowman.store'));
      expect(test.a).toBe('Hi');
    });

    it('Should save history to local storage using provided string prefix', () => {
      State.history = ['Hi'];
      State.save('test');
      const test = JSON.parse(localStorage.getItem('test.snowman.history'));
      expect(test.length).toBe(1);
    });
  });

  describe('clear()', () => {
    it('Should clear all saved local storage', () => {
      State.save();
      State.clear();
      const test = localStorage.getItem('default.snowman.store');
      expect(test).toBe(null);
    });
  });

  describe('exists()', () => {
    it('Should return true if save string exists', () => {
      State.save('test');
      expect(State.exists('test')).toBe(true);
    });

    it('Should return false if save string exists', () => {
      expect(State.exists('test')).toBe(false);
    });
  });

  describe('restore()', () => {
    it('Should restore history based on optional string prefix', () => {
      State.history = ['1', '2'];
      State.save('test');
      State.history = [];
      State.restore('test');
      expect(State.history.length).toBe(2);
    });

    it('Should restore store based on optional string prefix', () => {
      State.store.a = 'Hi';
      State.save('test');
      State.store = {};
      State.restore('test');
      expect(State.store.a).toBe('Hi');
    });
  });

  describe('hasVisited()', () => {
    it('Should return true if single passage name is in history', () => {
      State.history = ['1', '2'];
      expect(State.hasVisited('1')).toBe(true);
    });

    it('Should return false if single passage name is not in history', () => {
      State.history = ['1', '2'];
      expect(State.hasVisited('3')).toBe(false);
    });

    it('Should return true if all passages names are in history', () => {
      State.history = ['1', '2'];
      expect(State.hasVisited(['1', '2'])).toBe(true);
    });

    it('Should return false if any passages names are not in history', () => {
      State.history = ['1', '2'];
      expect(State.hasVisited(['1', '3'])).toBe(false);
    });
  });
});
