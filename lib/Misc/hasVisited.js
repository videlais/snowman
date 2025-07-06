/**
 * hasVisited - Checks if a passage has been visited based on its name or ID.
 * @file Misc.js
 * @function
 * @param {Array<string|number>} - An array of name or ID of the passage to check.
 * @returns {boolean} - Returns true if the passage has been visited, false if it has not.
 */
export default function hasVisited(search) {
    if (!globalThis.window || !window.story || !Array.isArray(window.story.history) || typeof window.story.passage !== 'function') {
        return false;
    }
    if (search === undefined || search === null) return false;
    const searchArr = Array.isArray(search) ? search : [search];
    if (searchArr.length === 0) return false;

    return searchArr.every(item => {
        const passage = window.story.passage(item);
        if (!passage) return false;
        return window.story.history.includes(passage.id);
    });
}