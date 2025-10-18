"use strict";
(self["webpackChunksnowman"] = self["webpackChunksnowman"] || []).push([[670],{

/***/ 704:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ src_Storylets)
});

// EXTERNAL MODULE: ./node_modules/quis/build/quis.esm.js
var quis_esm = __webpack_require__(293);
// EXTERNAL MODULE: ./src/State.js
var State = __webpack_require__(421);
;// ./src/MingoQuisConverter.js
/**
 * Utility to convert Mingo (MongoDB-style) queries to Quis DSL expressions
 * for use in Snowman storylet requirements.
 */

/**
 * Converts a Mingo query object to a Quis DSL expression string
 * @param {object} mingoQuery - MongoDB-style query object
 * @returns {string} Quis DSL expression
 */
function convertMingoToQuis(mingoQuery) {
  if (!mingoQuery || typeof mingoQuery !== 'object') {
    throw new Error('Query must be an object');
  }

  // Handle empty object - should match everything
  const keys = Object.keys(mingoQuery);
  if (keys.length === 0) {
    return 'true'; // Empty requirements always match
  }

  // Handle single field
  if (keys.length === 1) {
    const key = keys[0];
    const value = mingoQuery[key];

    // Handle MongoDB logical operators
    if (key === '$and') {
      if (!Array.isArray(value)) {
        throw new TypeError('$and requires an array of conditions');
      }
      const conditions = value.map(cond => convertMingoToQuis(cond));
      return `(${conditions.join(' && ')})`;
    }

    if (key === '$or') {
      if (!Array.isArray(value)) {
        throw new TypeError('$or requires an array of conditions');
      }
      const conditions = value.map(cond => convertMingoToQuis(cond));
      return `(${conditions.join(' || ')})`;
    }

    if (key === '$not') {
      return `!(${convertMingoToQuis(value)})`;
    }

    // Handle field queries
    return convertFieldQuery(key, value);
  }

  // Handle multiple fields (implicit AND)
  const conditions = keys.map(key => {
    return convertFieldQuery(key, mingoQuery[key]);
  });
  return conditions.join(' && ');
}

/**
 * Converts a single field query to Quis expression
 * @param {string} field - Field name
 * @param {*} value - Query value (can be primitive or operator object)
 * @returns {string} Quis expression for the field
 */
function convertFieldQuery(field, value) {
  // Simple equality
  if (typeof value !== 'object' || value === null) {
    return `$${field} == ${JSON.stringify(value)}`;
  }

  // Handle comparison operators
  const operators = Object.keys(value);
  
  // Check if this object contains operators (keys starting with $) or is a plain value object
  const hasOperators = operators.some(key => key.startsWith('$'));
  if (!hasOperators) {
    // This is a plain object being used as a value, treat as equality
    return `$${field} == ${JSON.stringify(value)}`;
  }
  
  if (operators.length === 1) {
    const operator = operators[0];
    const operatorValue = value[operator];

    switch (operator) {
      case '$eq':
        return `$${field} == ${JSON.stringify(operatorValue)}`;
      case '$ne':
        return `$${field} != ${JSON.stringify(operatorValue)}`;
      case '$gt':
        return `$${field} > ${JSON.stringify(operatorValue)}`;
      case '$gte':
        return `$${field} >= ${JSON.stringify(operatorValue)}`;
      case '$lt':
        return `$${field} < ${JSON.stringify(operatorValue)}`;
      case '$lte':
        return `$${field} <= ${JSON.stringify(operatorValue)}`;
      case '$in':
        {
          if (!Array.isArray(operatorValue)) {
            throw new TypeError('$in requires an array');
          }
          const inConditions = operatorValue.map(val => 
            `$${field} == ${JSON.stringify(val)}`
          );
          return `(${inConditions.join(' || ')})`;
        }
      case '$nin':
        {
          if (!Array.isArray(operatorValue)) {
            throw new TypeError('$nin requires an array');
          }
          const ninConditions = operatorValue.map(val => 
            `$${field} != ${JSON.stringify(val)}`
          );
          return `(${ninConditions.join(' && ')})`;
        }
      default:
        throw new Error(`Unsupported operator: ${operator}`);
    }
  } else if (operators.length > 1) {
    // Multiple operators on same field (e.g., {$gt: 10, $lt: 20})
    const conditions = operators.map(op => {
      return convertFieldQuery(field, { [op]: value[op] });
    });
    return `(${conditions.join(' && ')})`;
  }

  // Fallback for complex objects - treat as equality
  return `$${field} == ${JSON.stringify(value)}`;
}

/**
 * Converts storylet requirements from old format to new format
 * Supports both string (new format) and object (old format) requirements
 * @param {string|object} requirements - Requirements in either format
 * @returns {string} Quis DSL expression
 */
function normalizeRequirements(requirements) {
  // If already a string, assume it's the new format
  if (typeof requirements === 'string') {
    return requirements;
  }

  // If object, convert from Mingo to Quis
  if (typeof requirements === 'object' && requirements !== null) {
    return convertMingoToQuis(requirements);
  }

  // Default fallback
  return 'true';
}


;// ./src/Storylets.js




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
      if (Object.hasOwn(passageEntry, 'source')) {
        // Find the element and replace it with an empty string.
        const searchedSource = passageEntry.source.replaceAll(/<requirements>([^>]*?)<\/requirements>/gmi, (match, captured) => {
          // Set a default object if JSON parsing fails.
          let passageRequirements = {};

          // Attempt JSON parsing, which can throw error on failure.
          try {
            // Try to parse string into object
            passageRequirements = JSON.parse(captured);
          } catch (error) {
            console.info('INFO: Failed to parse passage requirements. Error:', error);
            // Ignore the error
          }

          // Set default priority for all cards.
          let passagePriority = 0;

          // Look for priority property.
          // First, are there any keys?
          if (Object.keys(passageRequirements).length > 0) {
            // Second, does the 'priority' property exist?
            if (Object.hasOwn(passageRequirements, 'priority')) {
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
    limit = Number.parseInt(limit);

    // For each passage, test its requirements against State.store.
    for (const entry of this.passages) {
      // Pull the requirements.
      const requirements = entry.requirements;
      
      // Convert requirements to Quis DSL expression
      let quisExpression;
      try {
        quisExpression = normalizeRequirements(requirements);
      } catch (error) {
        console.warn('Failed to parse requirements for passage:', entry.passage.name, error);
        return; // Skip this passage if requirements are invalid
      }
      
      // Create values function for Quis
      const values = (name) => {
        // Remove $ prefix if present (Quis expects $variableName, but we store variableName)
        const cleanName = name.startsWith('$') ? name.slice(1) : name;
        return State/* default */.A.store[cleanName];
      };
      
      // Test requirements against State.store
      let isAvailable = false;
      try {
        // Only test if there are actual requirements (not empty object/string)
        if ((typeof requirements === 'object' && Object.keys(requirements).length > 0) ||
            (typeof requirements === 'string' && requirements.trim() !== '' && requirements !== 'true')) {
          isAvailable = (0,quis_esm/* parse */.qg)(quisExpression, { values });
        }
      } catch (error) {
        console.warn('Failed to evaluate requirements for passage:', entry.passage.name, error);
        return; // Skip this passage if evaluation fails
      }
      
      if (isAvailable) {
        // Add the element to the results.
        results.push(entry);
      }
    }

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
    const newPassage = globalThis.Story.getPassageByName(newName);

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
    newPriority = Number.parseInt(newPriority);

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

/* harmony default export */ const src_Storylets = (Storylets);


/***/ })

}]);