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

    it('Should act as proxy to store', () => {
      State.proxy.a = 'Hi';
      expect(State.proxy.a).toBe('Hi');
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

  describe('remove()', () => {
    it('Should saved data using defaults from localStorage', () => {
      State.save();
      State.remove();
      const test = localStorage.getItem('default.snowman.store');
      expect(test).toBe(null);
    });

    it('Should saved data by name from localStorage', () => {
      State.save('test');
      State.remove('test');
      const test = localStorage.getItem('test.snowman.store');
      expect(test).toBe(null);
    });
  });

  describe('exists()', () => {
    it('Should return true if named save string exists', () => {
      State.save('test');
      expect(State.exists('test')).toBe(true);
    });

    it('Should return false if named save string does not exist', () => {
      expect(State.exists('test')).toBe(false);
    });

    it('Should return true if default save string exists', () => {
      State.save();
      expect(State.exists()).toBe(true);
    });

    it('Should return false if default save string does not exist', () => {
      expect(State.exists()).toBe(false);
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

    it('Should restore store using default prefix', () => {
      State.store.a = 'Hi';
      State.save();
      State.store = {};
      State.restore();
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

    it('Should return false if passed nothing to check', () => {
      expect(State.hasVisited()).toBe(false);
    });
  });
});

describe('localStorage turned off', () => {
  let temp = null;

  beforeEach(() => {
    // Mimic how Firefox turns off dom.storage
    temp = window._localStorage;
    window._localStorage = null;
  });

  afterAll(() => {
    // Restore localStorage after testing block
    window._localStorage = temp;
  });

  it('save() should return false if localStorage is turned off', () => {
    expect(State.save('test')).toBe(false);
  });

  it('exists() should return false if localStorage is turned off', () => {
    State.save('test');
    expect(State.exists('test')).toBe(false);
  });

  it('load() should return false if localStorage is turned off', () => {
    State.save('test');
    expect(State.restore('test')).toBe(false);
  });

  it('remove() should return false if localStorage is turned off', () => {
    expect(State.remove('test')).toBe(false);
  });
});
