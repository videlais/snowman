/**
 * Convert a string of shorthand attributes into HTML attributes.
 * Shorthands:
 * - `-` (minus) will hide an element.
 * - `0` will give it a href property that does nothing.
 * - `#id` will set the element's ID.
 * - `.class` will add a class to the element.
 * @param {string} attrs
 * @returns {string} HTML attributes
 */

export function renderAttrs(attrs) {
    let result = '';

    let i = 0;
    while (i < attrs.length && (attrs[i] === '-' || attrs[i] === '0')) {
        switch (attrs[i]) {
            case '-':
                result += 'style="display:none" ';
                break;

            case '0':
                result += 'href="javascript:void(0)" ';
                break;
        }
        i++;
    }

    let classes = [];
    let id = null;

    const classOrId = /([#.])([^#.]+)/g;
    classOrId.lastIndex = 0; // Reset regex state in case of reuse

    let matches;
    while ((matches = classOrId.exec(attrs)) !== null) {
        switch (matches[1]) {
            case '#':
                id = matches[2];
                break;

            case '.':
                classes.push(matches[2]);
                break;
        }
    }

    if (id !== null) {
        result += `id="${id}" `;
    }

    if (classes.length > 0) {
        result += `class="${classes.join(' ')}" `;
    }

    return result.trim();
}