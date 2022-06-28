const History = require('../src/History.js');
const State = require('../src/State.js');

describe('History', () => {
  beforeEach(() => {
    State.init();
    History.init();
  });

  describe('undo()', () => {
    it('Should return null if history is empty', () => {
      expect(History.undo()).toBe(null);
    });

    it('Should return previous passage name', () => {
      History.add('Start');
      History.add('Another');
      const passageName = History.undo();
      expect(passageName).toBe('Start');
    });
  });

  describe('redo()', () => {
    it('Should return null if history is empty', () => {
      expect(History.redo()).toBe(null);
    });

    it('Should return previous passage name', () => {
      History.add('Start');
      History.add('Another');
      History.undo();
      const passageName = History.redo();
      expect(passageName).toBe('Another');
    });
  });

  describe('init()', () => {
    it('Should have initial empty array', () => {
      expect(History.history.length).toBe(0);
    });

    it('Should have position of zero', () => {
      expect(History.position).toBe(0);
    });
  });

  describe('add()', () => {
    it('Should increase size of history array', () => {
      History.add('Start');
      expect(History.history.length).toBe(1);
    });

    it('Should add passage name to array', () => {
      History.add('Start');
      expect(History.hasVisited('Start')).toBe(true);
    });
  });

  describe('hasVisited()', () => {
    it('Should return true if single passage name is in history', () => {
      History.add('1');
      expect(History.hasVisited('1')).toBe(true);
    });

    it('Should return false if single passage name is not in history', () => {
      History.add('1');
      History.add('2');
      expect(History.hasVisited('3')).toBe(false);
    });

    it('Should return true if all passages names are in history', () => {
      History.add('1');
      History.add('2');
      expect(History.hasVisited(['1', '2'])).toBe(true);
    });

    it('Should return false if any passages names are not in history', () => {
      History.add('1');
      expect(History.hasVisited(['1', '3'])).toBe(false);
    });

    it('Should return false if passed nothing to check', () => {
      expect(History.hasVisited()).toBe(false);
    });
  });

  describe('visited()', () => {
    it('Should return 1 if only one visit in history', () => {
      History.add('Start');
      History.add('Another');
      expect(History.visited('Start')).toBe(1);
    });

    it('Should return 2 if two visits in history', () => {
      History.add('Start');
      History.add('Another');
      History.add('Start');
      expect(History.visited('Start')).toBe(2);
    });
  });
});
