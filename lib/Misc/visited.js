/**
 * visited - Returns the number of times a passage has been visited.
 * @function
 * @file Misc.js
 * @param {string|number} - The name or ID of the passage to check. 
 * @returns {number} - The number of times the passage has been visited.
 * @example
 * // Returns the number of times the passage with the ID of 1 has been visited.
 * visited(1);
 */
function visited (search = "") {
  
    // Perform sanity check: if window.story is not defined, return 0.
    if(typeof window.story == 'undefined') {
      return 0;
    }
  
    // Perform sanity check: if window.story.history is not defined, return 0.
    if(typeof window.story.history == 'undefined') {
      return 0;
    }

    // Search for the passage by name or ID.
    let passage = window.story.passage(search);

    // If the passage is not found, return 0.
    if(passage == null) {
        return 0;
    }

    // Return the number of times the passage has been visited.
    return window.story.history.filter(id => id == passage.id).length;
  
}

export default visited;