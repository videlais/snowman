const ejs = require('ejs');
const State = require('./State.js');
const StorageAlias = require('./Storage.js');
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
   *
   * @function run
   * @param {string} script - Code to run.
   * @param {Story} story - Current story object.
   * @returns {string} Any output, if produced.
   */
  static run (script, story) {
    let result = '';

    try {
      // Send in pseudo-global properties
      /* eslint-disable object-shorthand */
      result = ejs.render(script,
        {
          s: State.store,
          Storage: StorageAlias,
          Storylets: story.storylets,
          Story: {
            name: story.name,
            currentPassage: story.currentPassage,
            renderPassageToSelector: story.renderPassageToSelector.bind(story),
            include: story.include.bind(story),
            getPassageByName: story.getPassageByName.bind(story),
            getPassagesByTag: story.getPassagesByTag.bind(story),
            show: story.show.bind(story),
            addPassage: story.addPassage.bind(story),
            removePassage: story.removePassage.bind(story),
            goto: story.goto.bind(story),
            events: State.events
          },
          History: {
            hasVisited: History.hasVisited.bind(History),
            visited: History.visited.bind(History),
            length: History.history.length
          },
          Screen: {
            lock: Screen.lock.bind(Screen),
            unlock: Screen.unlock.bind(Screen)
          },
          Sidebar: {
            hide: story.sidebar.hide.bind(),
            show: story.sidebar.show.bind()
          },
          Utils: {
            delay: Utilities.delay.bind(Utilities),
            either: Utilities.either.bind(Utilities),
            applyExternalStyles: Utilities.applyExternalStyles.bind(Utilities),
            randomInt: Utilities.randomInt.bind(Utilities)
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

    /* eslint-enable object-shorthand */
    return result;
  }
}

module.exports = Script;
