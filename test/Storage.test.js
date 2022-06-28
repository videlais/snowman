const Storage = require('../src/Storage.js');
const History = require('../src/History.js');
const State = require('../src/State.js');

describe('Storage', () => {
  beforeEach(() => {
    History.init();
    State.init();
    localStorage.clear();
  });

  describe('save()', () => {
    it('Should save history to local storage using provided string prefix', () => {
      History.add('State');
      Storage.save('test');
      const test = JSON.parse(localStorage.getItem('test.snowman.history'));
      expect(test.length).toBe(1);
    });
  });

  describe('removeSave()', () => {
    it('Should saved data using defaults from localStorage', () => {
      Storage.save();
      Storage.removeSave();
      const test = localStorage.getItem('default.snowman.store');
      expect(test).toBe(null);
    });

    it('Should saved data by name from localStorage', () => {
      Storage.save('test');
      Storage.removeSave('test');
      const test = localStorage.getItem('test.snowman.store');
      expect(test).toBe(null);
    });
  });

  describe('doesSaveExist()', () => {
    it('Should return true if named save string exists', () => {
      Storage.save('test');
      expect(Storage.doesSaveExist('test')).toBe(true);
    });

    it('Should return false if named save string does not exist', () => {
      expect(Storage.doesSaveExist('test')).toBe(false);
    });

    it('Should return true if default save string exists', () => {
      Storage.save();
      expect(Storage.doesSaveExist()).toBe(true);
    });

    it('Should return false if default save string does not exist', () => {
      expect(Storage.doesSaveExist()).toBe(false);
    });
  });

  describe('restore()', () => {
    it('Should restore History.history based on optional string prefix', () => {
      History.add('1');
      History.add('2');
      Storage.save('test');
      History.init();
      Storage.restore('test');
      expect(History.history.length).toBe(2);
    });

    it('Should restore History.history using default string prefix', () => {
      History.add('1');
      History.add('2');
      Storage.save();
      History.init();
      Storage.restore();
      expect(History.history.length).toBe(2);
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
    expect(Storage.save('test')).toBe(false);
  });

  it('exists() should return false if localStorage is turned off', () => {
    Storage.save('test');
    expect(Storage.doesSaveExist('test')).toBe(false);
  });

  it('load() should return false if localStorage is turned off', () => {
    Storage.save('test');
    expect(Storage.restore('test')).toBe(false);
  });

  it('remove() should return false if localStorage is turned off', () => {
    expect(Storage.removeSave('test')).toBe(false);
  });
});
