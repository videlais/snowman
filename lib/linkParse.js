/**
 * Parses Twine-style links in the given text and converts them to HTML anchor tags.
 * Supports various formats including:
 * - [[destination]]
 * - [[rename|destination]]
 * - [[rename->destination]]
 * - [[destination<-rename]]
 * @param {string} text 
 * @returns {string} The converted HTML string.
 */

export function parse (text) {
    // Throw error if input is not a string
    if (typeof text !== 'string') {
      throw new TypeError('Input must be a string');
    }

    // Regex to match Twine-style links
    const linkRegex = /\[\[([^\]|<-]+)(?:\|([^\]|<-]+)|->([^\]|<-]+)|<-([^\]|<-]+))?\]\]/g;

    text = text.replace(linkRegex, (match, p1, p2, p3, p4) => {

      // [[rename->dest]]
      if (p1 && p3 && p2 === undefined && p4 === undefined) {
        return `<a href="javascript:void(0)" data-passage="${p3}">${p1}</a>`;
      }

      // [[dest<-rename]]
      if (p1 && p4 && p2 === undefined && p3 === undefined) {
        return `<a href="javascript:void(0)" data-passage="${p4}">${p1}</a>`;
      }
      
      // [[rename|destination]]
      if(p1 && p2 && p3 === undefined && p4 === undefined) {
        return `<a href="javascript:void(0)" data-passage="${p2}">${p1}</a>`;
      }

       // [[destination]]
      if(p1 && p2 === undefined && p3 === undefined && p4 === undefined) {
        return `<a href="javascript:void(0)" data-passage="${p1}">${p1}</a>`;
      }
    });

    return text;
}
