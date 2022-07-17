const Storage = require('../src/Storage.js');
const History = require('../src/History.js');
const State = require('../src/State.js');

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
      expect(test.length).toBe(1);
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
