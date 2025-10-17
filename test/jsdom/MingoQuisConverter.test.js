const { convertMingoToQuis, normalizeRequirements } = require('../../src/MingoQuisConverter.js');

describe('MingoQuisConverter', () => {
  describe('convertMingoToQuis()', () => {
    it('Should convert simple equality', () => {
      const mingo = { "test": 1 };
      const quis = convertMingoToQuis(mingo);
      expect(quis).toBe('$test == 1');
    });

    it('Should convert greater than', () => {
      const mingo = { "test": { "$gt": 1 } };
      const quis = convertMingoToQuis(mingo);
      expect(quis).toBe('$test > 1');
    });

    it('Should convert greater than or equal', () => {
      const mingo = { "health": { "$gte": 50 } };
      const quis = convertMingoToQuis(mingo);
      expect(quis).toBe('$health >= 50');
    });

    it('Should convert less than', () => {
      const mingo = { "score": { "$lt": 100 } };
      const quis = convertMingoToQuis(mingo);
      expect(quis).toBe('$score < 100');
    });

    it('Should convert less than or equal', () => {
      const mingo = { "level": { "$lte": 5 } };
      const quis = convertMingoToQuis(mingo);
      expect(quis).toBe('$level <= 5');
    });

    it('Should convert not equal', () => {
      const mingo = { "status": { "$ne": "inactive" } };
      const quis = convertMingoToQuis(mingo);
      expect(quis).toBe('$status != "inactive"');
    });

    it('Should convert multiple fields with AND', () => {
      const mingo = { "health": 100, "level": 5 };
      const quis = convertMingoToQuis(mingo);
      expect(quis).toBe('$health == 100 && $level == 5');
    });

    it('Should convert $and operator', () => {
      const mingo = { 
        "$and": [
          { "health": { "$gt": 50 } },
          { "level": { "$gte": 5 } }
        ]
      };
      const quis = convertMingoToQuis(mingo);
      expect(quis).toBe('($health > 50 && $level >= 5)');
    });

    it('Should convert $or operator', () => {
      const mingo = { 
        "$or": [
          { "magic": { "$lt": 10 } },
          { "strength": { "$gt": 80 } }
        ]
      };
      const quis = convertMingoToQuis(mingo);
      expect(quis).toBe('($magic < 10 || $strength > 80)');
    });

    it('Should convert $in operator', () => {
      const mingo = { "class": { "$in": ["warrior", "mage", "rogue"] } };
      const quis = convertMingoToQuis(mingo);
      expect(quis).toBe('($class == "warrior" || $class == "mage" || $class == "rogue")');
    });

    it('Should convert $nin operator', () => {
      const mingo = { "status": { "$nin": ["banned", "suspended"] } };
      const quis = convertMingoToQuis(mingo);
      expect(quis).toBe('($status != "banned" && $status != "suspended")');
    });

    it('Should convert complex nested conditions', () => {
      const mingo = {
        "$and": [
          { "level": { "$gte": 10 } },
          { "$or": [
            { "class": "wizard" },
            { "magic": { "$gt": 50 } }
          ]}
        ]
      };
      const quis = convertMingoToQuis(mingo);
      expect(quis).toBe('($level >= 10 && ($class == "wizard" || $magic > 50))');
    });

    it('Should handle empty object', () => {
      const mingo = {};
      const quis = convertMingoToQuis(mingo);
      expect(quis).toBe('true');
    });

    it('Should handle string values', () => {
      const mingo = { "name": "John" };
      const quis = convertMingoToQuis(mingo);
      expect(quis).toBe('$name == "John"');
    });

    it('Should handle boolean values', () => {
      const mingo = { "active": true };
      const quis = convertMingoToQuis(mingo);
      expect(quis).toBe('$active == true');
    });

    it('Should throw error for invalid input', () => {
      expect(() => convertMingoToQuis(null)).toThrow('Query must be an object');
      expect(() => convertMingoToQuis("string")).toThrow('Query must be an object');
    });
  });

  describe('normalizeRequirements()', () => {
    it('Should pass through string requirements unchanged', () => {
      const requirements = '$health > 50 && $level >= 5';
      const result = normalizeRequirements(requirements);
      expect(result).toBe('$health > 50 && $level >= 5');
    });

    it('Should convert object requirements', () => {
      const requirements = { "test": { "$gt": 1 } };
      const result = normalizeRequirements(requirements);
      expect(result).toBe('$test > 1');
    });

    it('Should handle null/undefined', () => {
      expect(normalizeRequirements(null)).toBe('true');
      expect(normalizeRequirements(undefined)).toBe('true');
    });

    it('Should handle non-object, non-string values', () => {
      expect(normalizeRequirements(123)).toBe('true');
      expect(normalizeRequirements(true)).toBe('true');
    });
  });
});