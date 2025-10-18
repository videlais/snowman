import Storage from '../../src/Storage.js';
import History from '../../src/History.js';
import State from '../../src/State.js';

describe('Storage', () => {
  beforeEach(() => {
    History.reset();
    State.reset();
    localStorage.clear();
  });

  describe('createSave()', () => {
    it('Should save history to local storage using provided string prefix', () => {
      History.add('State');
      Storage.createSave('test');
      const test = JSON.parse(localStorage.getItem('test.snowman.history'));
      expect(test.history.length).toBe(1);
      expect(test.position).toBe(0);
    });
  });

  describe('removeSave()', () => {
    it('Should saved data using defaults from localStorage', () => {
      Storage.createSave();
      Storage.removeSave();
      const test = localStorage.getItem('default.snowman.store');
      expect(test).toBe(null);
    });

    it('Should saved data by name from localStorage', () => {
      Storage.createSave('test');
      Storage.removeSave('test');
      const test = localStorage.getItem('test.snowman.store');
      expect(test).toBe(null);
    });
  });

  describe('doesSaveExist()', () => {
    it('Should return true if named save string exists', () => {
      Storage.createSave('test');
      expect(Storage.doesSaveExist('test')).toBe(true);
    });

    it('Should return false if named save string does not exist', () => {
      expect(Storage.doesSaveExist('test')).toBe(false);
    });

    it('Should return true if default save string exists', () => {
      Storage.createSave();
      expect(Storage.doesSaveExist()).toBe(true);
    });

    it('Should return false if default save string does not exist', () => {
      expect(Storage.doesSaveExist()).toBe(false);
    });
  });

  describe('restoreSave()', () => {
    it('Should restore History.history based on optional string prefix', () => {
      History.add('1');
      History.add('2');
      Storage.createSave('test');
      History.reset();
      Storage.restoreSave('test');
      expect(History.history.length).toBe(2);
    });

    it('Should restore History.history using default string prefix', () => {
      History.add('1');
      History.add('2');
      Storage.createSave();
      History.reset();
      Storage.restoreSave();
      expect(History.history.length).toBe(2);
    });
  });

  describe('removeAll()', () => {
    it('Should remove any saves', () => {
      Storage.createSave('test');
      Storage.removeAll();
      expect(Storage.doesSaveExist('test')).toBe(false);
    });

    it('Should return true if clear() is available', () => {
      expect(Storage.removeAll()).toBe(true);
    });
  });

  describe('available()', () => {
    it('Should return true if localStorage is available', () => {
      expect(Storage.available()).toBe(true);
    });
  });

  // Tests for issue #522 fix
  describe('Position tracking in save/restore (Issue #522)', () => {
    beforeEach(() => {
      History.reset();
      State.reset();
    });

    it('Should save and restore both history and position correctly', () => {
      // Set up test scenario
      History.add('Start');
      State.store.testVar = 1;
      History.add('Page 2');
      State.store.testVar = 2;
      
      // Move back in history
      History.undo();
      expect(History.position).toBe(0);
      expect(History.history.length).toBe(2);
      
      // Save current state
      Storage.createSave('position-test');
      
      // Navigate forward and add more history
      History.redo();
      History.add('Page 3');
      expect(History.position).toBe(2);
      expect(History.history.length).toBe(3);
      
      // Restore save - this should not crash
      expect(() => Storage.restoreSave('position-test')).not.toThrow();
      
      // Verify position and history were restored correctly
      expect(History.position).toBe(0);
      expect(History.history.length).toBe(2);
      expect(History.history[0].passageName).toBe('Start');
      expect(History.history[1].passageName).toBe('Page 2');
      expect(State.store.testVar).toBe(1); // Should be restored to the state at position 0
    });

    it('Should handle the exact scenario from issue #522', () => {
      // Reproduce the exact issue scenario
      History.add('Start');
      if (State.store.someVar === undefined) {
        State.store.someVar = 0;
      }
      
      History.add('Page 2');
      State.store.someVar += 1;
      
      // Go back and forth
      History.undo();
      History.redo();
      
      // Save
      Storage.createSave('issue522-test');
      
      // Continue navigation (this changes position)
      History.add('Page 3');
      State.store.someVar += 1;
      
      // Restore - this used to crash
      expect(() => Storage.restoreSave('issue522-test')).not.toThrow();
      
      // Verify we can access the restored state
      expect(History.history[History.position]).toBeDefined();
      expect(History.history[History.position].state).toBeDefined();
    });

    it('Should handle edge case where position equals history length', () => {
      History.add('Only passage');
      // Manually set position to be equal to length (edge case)
      History.position = History.history.length;
      
      Storage.createSave('edge-test');
      
      // This should adjust position to be within bounds
      Storage.restoreSave('edge-test');
      expect(History.position).toBe(0); // Should be adjusted to valid range
      expect(History.position).toBeLessThan(History.history.length);
    });

    it('Should handle empty history gracefully', () => {
      // Save empty history
      Storage.createSave('empty-test');
      
      // Add some history
      History.add('Test');
      
      // Restore empty history
      expect(() => Storage.restoreSave('empty-test')).not.toThrow();
      expect(History.history.length).toBe(0);
      expect(History.position).toBe(0);
    });
  });

  // Backward compatibility tests
  describe('Backward compatibility with old save format', () => {
    beforeEach(() => {
      History.reset();
      State.reset();
    });

    it('Should load old format saves (array of history entries)', () => {
      // Manually create an old-format save (just array of history)
      const oldFormatSave = JSON.stringify([
        { passageName: 'Start', state: { oldVar: 1 } },
        { passageName: 'Page 2', state: { oldVar: 2 } }
      ]);
      
      if (Storage.available()) {
        globalThis.localStorage.setItem('old-format.snowman.history', oldFormatSave);
      }
      
      // Should restore without error
      expect(() => Storage.restoreSave('old-format')).not.toThrow();
      
      // Should restore history
      expect(History.history.length).toBe(2);
      expect(History.history[0].passageName).toBe('Start');
      expect(History.history[1].passageName).toBe('Page 2');
      
      // Should set position to last entry for backward compatibility
      expect(History.position).toBe(1);
      expect(State.store.oldVar).toBe(2);
    });

    it('Should handle malformed save data gracefully', () => {
      // Create malformed save data
      if (Storage.available()) {
        globalThis.localStorage.setItem('malformed.snowman.history', 'invalid json{');
      }
      
      // Should not crash and should return false
      expect(Storage.restoreSave('malformed')).toBe(false);
      expect(History.history.length).toBe(0);
      expect(History.position).toBe(0);
    });

    it('Should handle unexpected object format', () => {
      // Save with unexpected object structure
      const unexpectedFormat = JSON.stringify({ someOtherProp: 'value' });
      
      if (Storage.available()) {
        globalThis.localStorage.setItem('unexpected.snowman.history', unexpectedFormat);
      }
      
      // Should not crash and should reset to safe state
      expect(() => Storage.restoreSave('unexpected')).not.toThrow();
      expect(History.history.length).toBe(0);
      expect(History.position).toBe(0);
    });

    it('Should return true when no save data exists', () => {
      // Ensure no save data exists
      if (Storage.available()) {
        globalThis.localStorage.removeItem('nonexistent.snowman.history');
      }
      
      // Should return true when trying to restore non-existent save
      expect(Storage.restoreSave('nonexistent')).toBe(true);
      
      // History should remain empty
      expect(History.history.length).toBe(0);
      expect(History.position).toBe(0);
    });
  });
});

describe('localStorage turned off', () => {
  let temp = null;

  beforeEach(() => {
    // Mimic how Firefox turns off dom.storage
    temp = globalThis._localStorage;
    globalThis._localStorage = null;
  });

  afterAll(() => {
    // Restore localStorage after testing block
    globalThis._localStorage = temp;
  });

  it('save() should return false if localStorage is turned off', () => {
    expect(Storage.createSave('test')).toBe(false);
  });

  it('exists() should return false if localStorage is turned off', () => {
    Storage.createSave('test');
    expect(Storage.doesSaveExist('test')).toBe(false);
  });

  it('load() should return false if localStorage is turned off', () => {
    Storage.createSave('test');
    expect(Storage.restoreSave('test')).toBe(false);
  });

  it('remove() should return false if localStorage is turned off', () => {
    expect(Storage.removeSave('test')).toBe(false);
  });

  it('Should return false from available()', () => {
    expect(Storage.available()).toBe(false);
  });

  it('Should return false from removeAll()', () => {
    expect(Storage.removeAll()).toBe(false);
  });
});
