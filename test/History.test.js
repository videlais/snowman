const zlib = require('zlib');
const History = require('../lib/History.js');

describe('History', () => {
  let history;

  beforeEach(() => {
    history = new History();
  });

  describe('push()', () => {
    it('Should push to history array length', () => {
      history.push('test');
      expect(history.history.length).toBe(1);
    });
  });

  describe('pop()', () => {
    it('Should pop history array', () => {
      history.push('test');
      history.pop();
      expect(history.history.length).toBe(0);
    });
  });

  describe('saveToHash()', () => {
    it('Should generate a gzip base64-encoded hash', () => {
      expect(history.saveToHash()).toBe('CxaAeyJzdGF0ZSI6e30sImhpc3RvcnkiOltdLCJjaGVja3BvaW50TmFtZSI6IiJ9Aw==');
    });
  });

  describe('restoreFromHash()', () => {
    it('Should generate a gzip base64-encoded hash', () => {
      history.checkpointName = "hi";
      const compressed = history.saveToHash();
      const h2 = new History();
      h2.restoreFromHash(compressed);
      expect(h2.checkpointName).toBe('hi');
    });

    it('Should only restore state if the property exists', () => {
      const h = JSON.stringify({
        history: history.history,
        checkpointName: history.checkpointName
      });
  
      const compressed = zlib.brotliCompressSync(h).toString('base64');

      history.state.a = "hi";
      history.restoreFromHash(compressed);
      expect(history.state.a).toBe("hi");
    });

    it('Should only restore history if the property exists', () => {
      const h = JSON.stringify({
        state: history.state,
        checkpointName: history.checkpointName
      });
  
      const compressed = zlib.brotliCompressSync(h).toString('base64');

      history.push("test");
      history.restoreFromHash(compressed);
      expect(history.history.length).toBe(1);
    });

    it('Should only restore checkpointname if the property exists', () => {
      const h = JSON.stringify({
        state: history.state
      });
  
      const compressed = zlib.brotliCompressSync(h).toString('base64');

      history.checkpointName = 'test'
      history.restoreFromHash(compressed);
      expect(history.checkpointName).toBe('test');
    });

    it('Should only restore history if the property exists AND it is an array', () => {
      const h = JSON.stringify({
        history: {}
      });
  
      const compressed = zlib.brotliCompressSync(h).toString('base64');

      history.push("test");
      history.restoreFromHash(compressed);
      expect(history.history.length).toBe(1);
    });

    it('Should throw error if hash is invalid', () => {
      expect(() => { 
        history.restoreFromHash('hi');
      }).toThrow();
    });

    it('Should throw error if JSON.parse() fails', () => {
      const stringHash = zlib.brotliCompressSync("test").toString('base64');
      expect(() => { 
        history.restoreFromHash(stringHash);
      }).toThrow();
    });
  });

  describe('hasVisited()', () => {
    it('Should return false if no entries in history', () => {
      expect(history.hasVisited("test")).toBe(false);
    });

    it('Should return true if string name in history', () => {
      history.push("test");
      expect(history.hasVisited("test")).toBe(true);
    });

    it('Should return true if array of names in history', () => {
      history.push("test");
      history.push("test2");
      expect(history.hasVisited(['test', 'test2'])).toBe(true);
    });

    it('Should return false if one of array of names is not in history', () => {
      history.push("test");
      expect(history.hasVisited(['test', 'test2'])).toBe(false);
    });
  });
});
