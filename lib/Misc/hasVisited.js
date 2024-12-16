/**
 * hasVisited - Checks if a passage has been visited based on its name or ID.
 * @file Misc.js
 * @function
 * @param {Array<string|number>} - An array of name or ID of the passage to check.
 * @returns {boolean} - Returns true if the passage has been visited, false if it has not.
 */
function hasVisited (search = []) {

    // Check if the search parameter is an array.
    if(!Array.isArray(search)) {
      // If the search parameter is not an array, convert it to an array.
      search = [search];
    }

    // Initialize the result to false.
    let result = false;
  
    // Perform sanity check: if no arguments are passed, return false.
    if(search.length == 0) {
      return false;
    }
  
    // Perform sanity check: if window.story is not defined, return false.
    if(typeof window.story == 'undefined') {
      return false;
    }
  
    // Perform sanity check: if window.story.history is not defined, return false.
    if(typeof window.story.history == 'undefined') {
      return false;
    }

    // Perform sanity check: if window.story.passage is not defines, return false.
    if(typeof window.story.passage == 'undefined') {
        return false
      }
  
    // Perform sanity check: if window.story.history is not an array, return false.
    if(!Array.isArray(window.story.history)) {
      return false;
    }
  
    // If only one argument is passed, check if the passage has been visited.
    if(arguments.length == 1) {
        // Look up the passage name by ID or name.
        const passage = window.story.passage(search[0]);

        // Check if passage is null.
        if(passage != null) {
            // Check if the passage name is in the history.
            result = window.story.history.includes(passage.id);
        } else {
            // If the passage is null, return false.
            result = false;
        }
    } else {
        // If multiple arguments are passed, check if all passages have been visited.
        result = search.every((entry) => {
            // Look up the passage name by ID or name.
            const passage = window.story.passage(entry);

            // Check if passage is null.
            if(passage !== null) {
                // Check if the passage name is in the history.
                return window.story.history.includes(passage.id);
            } else {
                // If the passage is null, return false.
                return false;
            }
          }
        );
      }
  
    // Return the result.
    return result;
};

export default hasVisited;