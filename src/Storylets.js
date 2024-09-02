const { Query } = require('mingo');
const State = require('./State.js');

/**
 * An object containing none, one, or multiple passages based
 * on their use of the 'storylet' passage tag and `<requirements>` element.
 * @class Storylets
 */
class Storylets {
  constructor (storyPassages = []) {
    // Internal array of passages.
    this.passages = [];

    // Is storyPassages an array?
    if (!Array.isArray(storyPassages)) {
      // If not, make it an empty array.
      storyPassages = [];
    }

    // For each, look for the <requirements> element in their source.
    for (const passageEntry of storyPassages) {
      // Double-check each object has a 'source' property.
      if (Object.prototype.hasOwnProperty.call(passageEntry, 'source')) {
        // Find the element and replace it with an empty string.
        const searchedSource = passageEntry.source.replace(/<requirements>([^>]*?)<\/requirements>/gmi, (match, captured) => {
          // Set a default object if JSON parsing fails.
          let passageRequirements = {};

          // Attempt JSON parsing, which can throw error on failure.
          try {
            // Try to parse string into object
            passageRequirements = JSON.parse(captured);
          } finally {
            // Ignore the error
          }

          // Set default priority for all cards.
          let passagePriority = 0;

          // Look for priority property.
          // First, are there any keys?
          if (Object.keys(passageRequirements).length > 0) {
            // Second, does the 'priority' property exist?
            if (Object.prototype.hasOwnProperty.call(passageRequirements, 'priority')) {
              // Update priority.
              passagePriority = passageRequirements.priority;
              // Remove priority.
              delete passageRequirements.priority;
            }
          }

          // Add the passage to the internal array.
          this.passages.push(
            {
              passage: passageEntry,
              requirements: passageRequirements,
              priority: passagePriority
            }
          );

          // Return empty string, removing it from the passage source.
          return '';
        });

        // Overwrite previous source with removed <requirements> element.
        passageEntry.source = searchedSource;
      }
    }
  }

  /**
   * For each passage in the internal collection,
   * test their requirements against State.store.
   *
   * Returns highest priority passages first.
   * @function getAvailablePassages
   * @param {number} limit Number of passages to return
   * @returns {Array} Array of none, one, or many available passages.
   */
  getAvailablePassages (limit = 0) {
    // Create results array.
    let results = [];

    // Force argument into number.
    limit = parseInt(limit);

    // For each passage, test its requirements against State.store.
    this.passages.forEach(entry => {
      // Pull the requirements.
      const requirements = entry.requirements;
      // Create a query based on requirements.
      const query = new Query(requirements);
      // Test against State.store AND make sure there are search properties.
      // As requirements can be an empty object, we need to protect against it.
      if (query.test(State.store) && Object.keys(requirements).length > 0) {
        // Add the element to the results.
        results.push(entry);
      }
    });

    // Sort results by priority.
    results.sort((a, b) => b.priority - a.priority);

    // Slice the results based on limit argument.
    if (limit !== 0) {
      results = results.slice(0, limit);
    }

    // Return either all or sliced results.
    return results;
  }

  /**
   * Add a passage to the Storylets collection.
   * @function addPassage
   * @param {string} newName Name of existing passage to add.
   * @param {object} newRequirements Requirements of passage.
   * @param {number} newPriority Priority of passage compared to other available.
   */
  addPassage (newName = '', newRequirements = {}, newPriority = 0) {
    // Check if passage exists in Story.
    const newPassage = window.Story.getPassageByName(newName);

    // If the passage was not found, throw an error.
    if (newPassage == null) {
      throw new Error('Passage must exist in Story to be added to Storylets collection');
    }

    // Test if passage exists in Storylets collection.
    if (this.includes(newName)) {
      throw new Error('Cannot add same passage twice to Storylets collection.');
    }

    // Verify newRequirements is an object.
    if (!(newRequirements && typeof newRequirements === 'object' && newRequirements.constructor === Object)) {
      // Ignore and set to empty object.
      newRequirements = {};
    }

    // Force parse newPriority into a number.
    newPriority = parseInt(newPriority);

    // Add the new, existing passage along with its requirements and priority.
    this.passages.push(
      {
        passage: newPassage,
        requirements: newRequirements,
        priority: newPriority
      }
    );
  }

  /**
   * Returns if Storylets collection already contains passage name or not.
   *
   * As passage names are unique to a story, the Storylets collection
   * cannot hold two entries with the same name.
   * @function includes
   * @param {string} name Name of passage to search.
   * @returns {boolean} True if passage is in collection.
   */
  includes (name = '') {
    // Filter for passage name.
    const passageList = this.passages.filter((entry) => {
      return entry.passage.name === name;
    });

    // Return if passage was found.
    return (passageList.length > 0);
  }

  /**
   * Remove a passage from the collection by name.
   * @function removePassage
   * @param {string} name Name of existing passage to remove.
   */
  removePassage (name = '') {
    this.passages = this.passages.filter((entry) => {
      return entry.passage.name !== name;
    });
  }
}

module.exports = Storylets;
