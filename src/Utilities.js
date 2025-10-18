const DOMUtils = require('./DOMUtils.js');

class Utilities {
  /**
   * Accepts a function, wait, and optional set of arguments.
   * After the wait, the function will run with the passed arguments.
   * @function delay
   * @param {Function}    func    Function to run.
   * @param {number}      wait    Number of milliseconds to wait.
   * @param {any}         [args]  Optional arguments to pass to the function.
   * @returns {number}            Identification of timer returned from setTimeout().
   */
  static delay (func, wait, ...args) {
    const boundFunction = func.bind(func);
    return setTimeout(boundFunction, wait, ...args);
  }

  /**
   * Accepts mixed input of arrays or comma-separated list of values and returns a random entry.
   * Will return null when given no arguments.
   *
   * Examples:
   * - either(1,2,3);
   * - either(1,[2],[4,5]);
   * @function either
   * @param   {object|Array} args Array or comma-separated list.
   * @returns {object|null}       Random entry or null.
   */
  static either (...args) {
    let tempArray = [];
    let result = null;

    // For every entry...
    for (const entry of args) {
      // If it is an array...
      if (Array.isArray(entry)) {
        // Spread out any subentries and add them to temporary array.
        tempArray = [...tempArray, ...entry];
      } else {
        // push the entry into the temporary array.
        tempArray.push(entry);
      }
    }

    // Check if any entries were added.
    if (tempArray.length > 0) {
      // If they were, grab one of them.
      result = tempArray[Math.floor(Math.random() * tempArray.length)];
    }

    // Return either null (no entries) or random entry.
    return result;
  }

  /**
   * Applies external CSS files.
   * @function applyExternalStyles
   * @param {Array} files Array of one or more external files to load.
   */
  static applyExternalStyles (files) {
    if (Array.isArray(files)) {
      for (const location of files) {
        const link = DOMUtils.createElement('link', {
          attributes: {
            rel: 'stylesheet',
            type: 'text/css',
            href: location
          }
        });
        DOMUtils.append('head', link);
      }
    } else {
      throw new TypeError('Method only accepts an array!');
    }
  }

  /**
   * Return random integer within range.
   * @function randomInt
   * @param   {number}  min   Start of range (default 0).
   * @param   {number}  max   End of range (default 0).
   * @returns {number}        Number in range.
   */
  static randomInt (min = 0, max = 0) {
    // Round up to min.
    min = Math.ceil(min);
    // Round down to max.
    max = Math.floor(max);

    // Is min greater than max?
    if (min > max) {
      max = min;
      min = 0;
    }

    return Math.floor(Math.random() * (max - min)) + min;
  }

  /**
   * Return random decimal number within range.
   * @function randomFloat
   * @param   {number}  min   Start of range (default 0).
   * @param   {number}  max   End of range (default 0).
   * @returns {number}        Decimal number in range.
   */
  static randomFloat (min = 0, max = 0) {
    // Is min greater than max?
    if (min > max) {
      max = min;
      min = 0;
    }

    return Math.random() * (max - min) + min;
  }
}

module.exports = Utilities;
