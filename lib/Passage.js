const $ = require('jquery');
const _ = require('underscore');
const Markdown = require('./Markdown.js');

/**
 * An object representing a passage. The current passage will be `window.passage`
 *
 * @class Passage
 */

class Passage {
  constructor (id, name, tags, source) {
    /**
     * @property {number} id - id number of passage
     * @type {number}
     */

    this.id = id || 1;

    /**
     * @property {string} name - The name of passage
     * @type {string}
     */

    this.name = name || 'Default';

    /**
     * @property {Array} tags - The tags of the passage.
     * @type {Array}
     */

    this.tags = tags || [];

    /**
     * @property {string} source - The passage source code.
     * @type {string}
     */

    this.source = _.unescape(source);
  }

  /**
   * Produce HTML from Markdown input
   *
   * @function render
   * @param {string} source - Source to parse
   */

  render (source) {
    // Test if 'source' is defined or not
    if (!(typeof source !== 'undefined' && source !== null)) {
      // Assume that 'this.source' is the correct source
      source = this.source;
    }

    let result = '';

    try {
      result = _.template(source)({ s: window.story.state, $: $ });
    } catch (error) {
      $.event.trigger('sm.story.error', [error, 'Passage.render() using _.template()']);
    }

    return Markdown.parse(result);
  }
}

module.exports = Passage;
