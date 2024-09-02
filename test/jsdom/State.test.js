const State = require('../../src/State.js');

describe('State', () => {
  describe('Store interactions', () => {
    afterEach(() => {
      State.reset();
    });

    it('Should have store as object', () => {
      State.store.a = 'Hi';
      expect(State.store.a).toBe('Hi');
    });

    it('Should detect if a property is changed in store', () => {
      let test = false;

      State.events.on('change', (property, value) => {
        test = value;
        expect(test).toBe(true);
      });

      State.store.a = true;
    });

    it('Should have store for... in... support', () => {
      State.store.a = 'Hi';
      let result = false;
      for (const prop in State.store) {
        result = State.store[prop];
      }
      expect(result).toBe('Hi');
    });

    it('Should allow deletion', () => {
      State.store.a = 'Hi';
      delete State.store.a;
      expect('a' in State.store).toBe(false);
    });

    it('Should allow has/in', () => {
      State.store.a = 'Hi';
      expect('a' in State.store).toBe(true);
    });

    it('Should do nothing if trying to delete property that does not exist', () => {
      expect(delete State.store.a).toBe(false);
    });
  });

  describe('Event usage', () => {
    afterEach(() => {
      State.reset();
    });

    it('Should provide event emitter for use of events', () => {
      let result = false;
      State.events.on('test', () => {
        result = true;
        expect(result).toBe(true);
      });
      State.events.emit('test');
    });
  });

  describe('updateState()', () => {
    afterEach(() => {
      State.reset();
    });

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
