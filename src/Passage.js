const $ = require('jquery');
const ejs = require('ejs');
const Markdown = require('./Markdown.js');

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

    this.source = Markdown.unescape(source);
  }

  /**
   * Produces HTML from Markdown input.
   * 1. Tries to run Ejs.render() on source.
   * 2. Throws error if template rendering fails.
   * 3. Returns Markdown.parse()'d source content.
   *
   * @function render
   */

  render () {
    let result = '';

    // Try to render the template code, if any.
    try {
      // Send in s and $.
      result = ejs.render(this.source, { s: window.story.state, $ }, { outputFunctionName: 'print' });
    } catch (e) {
      // Throw error is rendering fails.
      throw new Error(`Error compiling template code in passage: ${e}`);
    }

    // Return parsed source.
    return Markdown.parse(result);
  }
}

module.exports = Passage;
