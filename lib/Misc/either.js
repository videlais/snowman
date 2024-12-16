// Import underscore
import _ from 'underscore';

/**
 * either - Randomly selects a value from a list of values.
 * @file Misc.js
 * @function
 * @returns {string} - A randomly selected value from the list of values passed to it.
 * @example
 * // Returns one of the values passed to it
 * either("A", "B", "C", "D");
 * @example
 * // Returns one of the values passed to it
 * either("A", "B", "C", "D", ["E", "F"]);
 */
function either() {

    let tempArray = [];
    let tPosition = 0;
  
    for(let i = 0; i < arguments.length; i++) {
  
      if(!(arguments[i] instanceof Array) ) {
  
        tempArray.push(arguments[i]);
  
      } else {
  
        for(let k = 0; k < arguments[i].length; k++) {
          tempArray.push(arguments[i][k]);
        }
      }
    }
  
    // Randomly select a value from the list of values.
    tPosition = _.random(tempArray.length - 1);

    // Return the selected value.
    return tempArray[tPosition];
}

export default either;