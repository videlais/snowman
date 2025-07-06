import jquery from 'jquery';

/**
 * getStyles - Loads remote CSS and appends it to the document head.
 * @file Misc.js
 * @function
 * @param {Array<string>} - The URLs of the CSS files to load.
 * @returns {null|Promise} - Returns a Promise if the function is successful, otherwise null.
 */
export default function getStyles(files) {
    if (!Array.isArray(files)) {
        throw new TypeError('getStyles: Argument must be an array of file URLs.');
    }
    if (files.length === 0) {
        return null;
    }

    const head = document.head || document.getElementsByTagName('head')[0];
    if (!head) {
        return null;
    }

    const loadPromises = files.map((file) => new Promise((resolve, reject) => {
        // Use jQuery to fetch the CSS file
        jquery.get(file, (data) => {
            // Create a style element
            const style = document.createElement('style');
            style.type = 'text/css';
            style.appendChild(document.createTextNode(data));
            // Append the style element to the head
            head.appendChild(style);
            resolve();
        }).fail(() => {
            reject(new Error(`Failed to load CSS file: ${file}`));
        });
    }));

    // Return a promise that resolves when all files are loaded
    return Promise.allSettled(loadPromises).then((results) => {
        const failed = results.filter(r => r.status === 'rejected');
        if (failed.length === results.length) {
            // All failed
            return null;
        }
        return undefined; // Indicate at least one succeeded
    });
}
