/**
 * visited - Returns the number of times a passage has been visited.
 * @function
 * @file Misc.js
 * @param {number} - The ID of the passage to check. 
 * @returns {number} - The number of times the passage has been visited.
 * @example
 * // Returns the number of times the passage with the ID of 1 has been visited.
 * visited(1);
 * @example
 * // Returns the number of times the passage with the ID of 1 has been visited.
 * visited(1, 2, 3);
 */
function visited () {

    // Perform sanity check: if no arguments are passed, return 0.
    if(arguments.length == 0) {
      return 0;
    }
  
    // Perform sanity check: if window.story is not defined, return 0.
    if(typeof window.story == 'undefined') {
      return 0;
    }
  
    // Perform sanity check: if window.story.history is not defined, return 0.
    if(typeof window.story.history == 'undefined') {
      return 0;
    }
  
    let counts = [];
    let count = [];
  
    for(var i = 0; i < arguments.length; i++) {
  
      var p = window.story.passage(arguments[i]);
  
      if( p != null) {
  
        count = window.story.history.filter(function(id) {
  
          return id == p.id;
  
        });
  
      }
  
      counts.push(count.length);
  
    }
  
    return Math.min(...counts);
  
}

module.exports = visited;