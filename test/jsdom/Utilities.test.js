const Utilities = require('../../src/Utilities.js');
const $ = require('jquery');

describe('Utilities', () => {
  describe('delay()', () => {
    it('Should run function if time is negative', () => {
      const test = true;
      Utilities.delay(() => {
        expect(test).toBe(true);
      }, -1);
    });

    it('Should pass arguments to timed function', () => {
      Utilities.delay((test) => {
        expect(test).toBe(true);
      }, -1, true);
    });

    it('Should delay 100 milliseconds with arrow ', () => {
      Utilities.delay((test) => {
        expect(test).toBe(true);
      }, 100, true);
    });

    it('Should delay 100 milliseconds with scoped function', () => {
      Utilities.delay(function (test) {
        expect(test).toBe(true);
      }, 100, true);
    });
  });

  describe('either()', () => {
    describe('either()', () => {
      it('Should return null if given nothing', () => {
        expect(Utilities.either()).toBe(null);
      });

      it('Should return single entry when only given one number', () => {
        expect(Utilities.either(1)).toBe(1);
      });

      it('Should return single entry when only given one number in an array', () => {
        expect(Utilities.either([1])).toBe(1);
      });

      it('Should return single entry when given mixed input', () => {
        expect(Utilities.either([1], 2, [3], [4])).toBeLessThan(5);
      });
    });
  });

  describe('applyExternalStyles()', () => {
    describe('applyExternalStyles()', () => {
      it('Should append a remote CSS file', () => {
        Utilities.applyExternalStyles(['https://twinery.org/homepage/css/homepage.css', 'https://twinery.org/homepage/css/homepage-responsive.css']);
        expect($('link').length).toBe(2);
      });

      it('Should throw error if argument is not array', () => {
        expect(() => Utilities.applyExternalStyles(2)).toThrow();
      });
    });
  });

  describe('randomInt()', () => {
    it('Should return number less than max', () => {
      expect(Utilities.randomInt(1, 2) < 3).toBe(true);
    });

    it('Should return number greater than min', () => {
      expect(Utilities.randomInt(1, 2) < 0).toBe(false);
    });

    it('Should return default values', () => {
      expect(Utilities.randomInt()).toBe(0);
    });

    it('Should return 0 to min if greater than max', () => {
      expect(Utilities.randomInt(2) < 3).toBe(true);
    });

    it('Should return min if min and max are the same', () => {
      expect(Utilities.randomInt(1, 1)).toBe(1);
    });
  });
});
