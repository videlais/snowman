const State = require('../src/State.js');

describe('State', () => {
  beforeEach(() => {
    State.init();
  });

  describe('init()', () => {
    it('Should provide event emitter for use of events', () => {
      let result = false;
      State.events.on('test', () => {
        result = true;
      });
      State.events.emit('test');
      expect(result).toBe(true);
    });

    it('Should have store as object', () => {
      State.store.a = 'Hi';
      expect(State.store.a).toBe('Hi');
    });

    it('Should detect if a property is changed in store', () => {
      let test = false;

      State.events.on('change', (property, value) => {
        test = value;
      });

      State.store.a = true;
      expect(test).toBe(true);
    });

    it('Should have store for... in... support', () => {
      State.store.a = 'Hi';
      let result = false;
      for (const prop in State.store) {
        result = State.store[prop];
      }
      expect(result).toBe('Hi');
    });
  });

  describe('updateState()', () => {
    it('Should update properties', () => {
      State.store.a = '1';
      State.updateState({ a: 'Hi' });
      expect(State.store.a).toBe('Hi');
    });

    it('Should do nothing when given null', () => {
      State.store.a = '1';
      State.updateState(null);
      expect(State.store.a).toBe('1');
    });
  });
});
