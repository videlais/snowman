import $ from 'jquery';
import _ from 'underscore';
import markdownit from 'markdown-it';
import { renderAttrs } from './renderAttrs.js';
import { parse } from './linkParse.js';

export default class Passage {

  constructor(id, name, tags, source) {
    /**
  	 The numeric ID of the passage.
  	 @property name
  	 @type Number
  	 @readonly
  	**/

    this.id = id || 1;

    /**
  	 The name of the passage.
  	 @property name
  	 @type String
  	**/

    this.name = name || "Default";

    /**
  	 The tags of the passage.
  	 @property tags
  	 @type Array
  	**/

    this.tags = tags || [];

    /**
  	 The passage source code.
  	 @property source
  	 @type String
  	**/

    this.source = _.unescape(source);

  }

  /**
   * Renders the passage content.
   * Uses Underscore's template function to process any embedded JavaScript.
   * Uses markdown-it to convert Markdown to HTML.
   * @param {string} source.
   * @returns {string} HTML content.
   */
  render(source) {

    // Test if 'source' is defined or not. If not, use this.source.
    if (!(typeof source !== 'undefined' && source !== null)) {
      // Assume that 'this.source' is the correct source
      source = this.source;
    }

    let result = "";

    try {
      result = _.template(source)({ s: window.story.state, $: $ });
    } catch(error) {
      $.event.trigger('sm.story.error', [error, "Passage.render() using _.template()"]);
    }

    // Look for HTML and process them using renderAttrs().
    const htmlTag = /<([a-zA-Z][-a-zA-Z0-9]*)(.*?)>(.*?)<\/\1>/g; // Matches <tag attrs>content</tag> including custom elements
    result = result.replace(htmlTag, function(match, tag, attrs, content) {
      // To prevent accidentally adding a space when there are no attrs
      attrs = attrs.trim();
      if (attrs.length === 0) {
        return '<' + tag + '>' + content + '</' + tag + '>';
      }
      
      // Check if attrs contains standard HTML attributes (contains = sign)
      if (attrs.includes('=')) {
        // Parse standard HTML attributes and preserve them
        const standardAttrs = [];
        const shorthandParts = [];
        
        // Split by spaces, but be careful with quoted values
        const parts = attrs.match(/\S+="[^"]*"|\S+='[^']*'|\S+/g) || [attrs];
        
        for (const part of parts) {
          if (part.includes('=')) {
            standardAttrs.push(part);
          } else {
            shorthandParts.push(part);
          }
        }
        
        // Process shorthand attributes
        let processedShorthands = '';
        if (shorthandParts.length > 0) {
          processedShorthands = renderAttrs(shorthandParts.join(' ')).trim();
        }
        
        // Combine all attributes
        let allAttrs = standardAttrs.join(' ');
        if (processedShorthands) {
          allAttrs += (allAttrs ? ' ' : '') + processedShorthands;
        }
        
        return '<' + tag + ' ' + allAttrs + '>' + content + '</' + tag + '>';
      } else {
        // No standard attributes, process everything as shorthand
        const processedAttrs = renderAttrs(attrs).trim();
        if (processedAttrs) {
          return '<' + tag + ' ' + processedAttrs + '>' + content + '</' + tag + '>';
        } else {
          return '<' + tag + '>' + content + '</' + tag + '>';
        }
      }
    });

    // Parse passage links and other custom markdown
    result = parse(result);

    // Prevent template() from triggering markdown code blocks
    const md = markdownit({
       html: true
    });
    
    // Use renderInline to prevent paragraph tags around the whole passage.
    let newResult = md.renderInline(result);

    // Return the rendered result.
    return newResult;
  }

}
