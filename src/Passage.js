/**
 * An object representing a passage. The current passage will be `window.passage`.
 *
 * @class Passage
 */

class Passage {
  constructor (id = 1, name = 'Default', tags = [], source = '') {
    /**
     * @property {number} id - id number of passage
     * @type {number}
     */

    this.id = id;

    /**
     * @property {string} name - The name of passage
     * @type {string}
     */

    this.name = name;

    /**
     * @property {Array} tags - The tags of the passage.
     * @type {Array}
     */

    this.tags = tags;

    /**
     * @property {string} source - The passage source code.
     * @type {string}
     */

    this.source = source;
  }
}

module.exports = Passage;
