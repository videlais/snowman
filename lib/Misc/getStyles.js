import jquery from 'jquery';

/**
 * getStyles - Loads CSS files into the DOM.
 * @file Misc.js
 * @function
 * @param {Array<string>} - The URLs of the CSS files to load.
 * @returns {null|Promise} - Returns a Promise if the function is successful, otherwise null.
 */
function getStyles (files = []) {
  // Check if files is an array
  if (!Array.isArray(files)) {
    throw new TypeError('Must pass an array!');
  }

  // Perform sanity check: if no arguments are passed, return.
  if(files.length == 0) {
    return null;
  }
  
  // Create a Promise to return.
    return new Promise((resolve, reject) => {

        // Loop through the arguments passed to the function.
        for(let i = 0; i < files.length; i++) {

            // Load the CSS file into the DOM.
            jquery.get(files[i], function(css) {
                jquery("<style>" + css + "</style>").appendTo("head");
            });
        }

        // Resolve the Promise.
        resolve();
    });
}

export default getStyles;
