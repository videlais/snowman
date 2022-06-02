const State = require('../src/State.js');

describe('State', () => {
  let state = null;

  beforeEach(() => {
    state = new State();
    localStorage.clear();
  });

  describe('constructor()', () => {
    it('Should update history in navigation events', () => {
      state.events.emit('navigation', 'new');
      expect(state.history.length).toBe(1);
    });

    it('Should provide access to global s as if local object', () => {
      state.store.a = 'Hi';
      expect(window.s.a).toBe('Hi');
    });

    it('Should detect if a property is changed in store', () => {
      let test = false;
      state.events.on('change', (property, value) => {
        test = value;
      });

      window.s.a = true;

      expect(test).toBe(true);
    });
  });

  describe('save()', () => {
    it('Should use default string prefix', () => {
      state.store.a = 'Hi';
      state.history = ['Hi'];
      state.save();
      const test = JSON.parse(localStorage.getItem('default.snowman.store'));
      expect(test.a).toBe('Hi');
    });

    it('Should save store to local storage using provided string prefix', () => {
      state.store.a = 'Hi';
      state.save('test');
      const test = JSON.parse(localStorage.getItem('test.snowman.store'));
      expect(test.a).toBe('Hi');
    });

    it('Should save history to local storage using provided string prefix', () => {
      state.history = ['Hi'];
      state.save('test');
      const test = JSON.parse(localStorage.getItem('test.snowman.history'));
      expect(test.length).toBe(1);
    });
  });

  describe('clear()', () => {
    it('Should clear all saved local storage', () => {
      state.save();
      state.clear();
      const test = localStorage.getItem('default.snowman.store');
      expect(test).toBe(null);
    });
  });

  describe('exists()', () => {
    it('Should return true if save string exists', () => {
      state.save('test');
      expect(state.exists('test')).toBe(true);
    });

    it('Should return false if save string exists', () => {
      expect(state.exists('test')).toBe(false);
    });
  });

  describe('restore()', () => {
    it('Should restore history based on optional string prefix', () => {
      state.history = ['1', '2'];
      state.save('test');
      state.history = [];
      state.restore('test');
      expect(state.history.length).toBe(2);
    });

    it('Should restore store based on optional string prefix', () => {
      state.store.a = 'Hi';
      state.save('test');
      state.store = {};
      state.restore('test');
      expect(state.store.a).toBe('Hi');
    });
  });

  describe('hasVisited()', () => {
    it('Should return true if single passage name is in history', () => {
      state.history = ['1', '2'];
      expect(state.hasVisited('1')).toBe(true);
    });

    it('Should return false if single passage name is not in history', () => {
      state.history = ['1', '2'];
      expect(state.hasVisited('3')).toBe(false);
    });

    it('Should return true if all passages names are in history', () => {
      state.history = ['1', '2'];
      expect(state.hasVisited(['1', '2'])).toBe(true);
    });

    it('Should return false if any passages names are not in history', () => {
      state.history = ['1', '2'];
      expect(state.hasVisited(['1', '3'])).toBe(false);
    });
  });
});
