const ejs = require('ejs');
const History = require('./History.js');
const Screen = require('./Screen.js');
const Utilities = require('./Utilities.js');

/**
 * @external Story
 * @see {@link Story}
 */

class Script {
  /**
   * Render JavaScript within a templated sandbox and return possible output.
   * Will throw error if code does.
   * @function run
   * @param {string} script - Code to run.
   * @param {Story} story - Current story object.
   * @returns {string} Any output, if produced.
   */
  static run (script, story) {
    let result = '';

    try {
      // Send in pseudo-global properties.
      result = ejs.render(script,
        {
          s: story.store,
          Storage: story.storage,
          Storylets: story.storylets,
          History: {
            hasVisited: History.hasVisited.bind(History),
            visited: History.visited.bind(History),
            length: History.history.length
          },
          Screen: {
            lock: Screen.lock.bind(),
            unlock: Screen.unlock.bind()
          },
          Sidebar: {
            hide: story.sidebar.hide.bind(),
            show: story.sidebar.show.bind()
          },
          Utils: {
            delay: Utilities.delay.bind(),
            either: Utilities.either.bind(),
            applyExternalStyles: Utilities.applyExternalStyles.bind(),
            randomInt: Utilities.randomInt.bind()
          }
        },
        {
          outputFunctionName: 'print'
        }
      );
    } catch (e) {
      // Throw error if rendering fails.
      throw new Error(`Error compiling template code: ${e}`);
    }

    return result;
  }
}

module.exports = Script;
