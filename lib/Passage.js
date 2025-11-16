import $ from 'jquery';
import _ from 'underscore';
import { marked } from 'marked';
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

    this.source = source;

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
    if (source === undefined || source === null) {
      // Assume that 'this.source' is the correct source
      // CRITICAL: Unescape HTML entities here, not in constructor
      // This matches Snowman 1.X behavior where entities are preserved in storage
      // and only decoded when rendering
      source = _.unescape(this.source);
    }

    // CRITICAL FIX: Process in the correct order
    // 
    // CORRECT ORDER:
    // 1. Process HTML shorthand attributes FIRST (before markdown might escape them)
    //    BUT skip tags with template markers - those will be processed after templates
    // 2. Parse passage links
    // 3. Process markdown (skip if templates present)  
    // 4. Process template rendering
    // 5. Process shorthand attributes AGAIN for tags that had templates
    //
    // WHY: Shorthand attributes like <div -> need to be converted to valid HTML
    // before markdown processing, otherwise markdown may escape invalid-looking tags.
    // BUT tags with templates need template evaluation first, then shorthand processing.

    let result = source;

    // Check if source contains template markers
    // Use simple string search instead of regex to avoid ReDoS vulnerability
    const hasTemplates = source.includes('<%');

    // Step 1: Process HTML shorthand attributes FIRST (except when source has templates)
    // Skip step 1 entirely if the source has template markers, since the regex can't handle
    // > characters inside <% %> tags properly. We'll run shorthand processing in step 5 instead.
    if (!hasTemplates) {
      // Use non-greedy quantifiers to prevent ReDoS attacks
      // Allow hyphens in tag names for custom HTML elements
      const htmlTag = /<([a-zA-Z][a-zA-Z0-9-]*?)([^>]*?)>([\s\S]*?)<\/\1>/g;
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
    }

    // Step 2: Parse passage links
    result = parse(result);

    // Step 3: Process markdown (skip if templates present)
    result = this.processMarkdown(result);

    // Step 4: Process template rendering
    try {
      result = _.template(result)({ s: window.story.state, $: $ });
    } catch(error) {
      $.event.trigger('sm.story.error', [error, "Passage.render() using _.template()"]);
    }

    // Step 5: Process shorthand attributes AGAIN for any tags that had template markers
    // Now that templates are evaluated, we can process the shorthand syntax
    // CRITICAL: Skip this step if the passage has no templates, since markdown-generated
    // HTML doesn't need shorthand processing and the regex can corrupt nested structures
    if (!hasTemplates) {
      // No templates were present, so all HTML is either:
      // 1. From markdown processing (already valid)
      // 2. Hand-written HTML (already processed in Step 1)
      // Skip Step 5 entirely to avoid corrupting markdown-generated tags
      return result;
    }
    
    // Templates were present, so we need to process shorthand attributes
    // Use non-greedy quantifiers to prevent ReDoS attacks
    // Allow hyphens in tag names for custom HTML elements
    const htmlTag2 = /<([a-zA-Z][a-zA-Z0-9-]*?)([^>]*?)>([\s\S]*?)<\/\1>/g;
    
    result = result.replace(htmlTag2, function(match, tag, attrs, content) {
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

    // Return the rendered result.
    return result;
  }

  /**
   * Process markdown content intelligently.
   * Uses marked library for markdown processing.
   * 
   * CRITICAL: Skip markdown processing entirely for passages containing Underscore template markers
   * to prevent markdown from HTML-escaping them.
   * 
   * @param {string} text - The text to process
   * @returns {string} Processed HTML
   */
  processMarkdown(text) {
    // CRITICAL FIX: If the text contains Underscore template markers, skip markdown processing entirely
    // Markdown processors will HTML-escape < and > characters, turning <%= %> into &lt;%= %&gt;
    // Use simple string search instead of regex to avoid ReDoS vulnerability
    if (text.includes('<%')) {
      // Contains template markers - return as-is without markdown processing
      return text;
    }

    // Check if text contains block-level markdown elements
    const hasHeaders = /^#{1,6}\s/m.test(text);
    const hasLists = /^[-*+]\s/m.test(text) || /^\d+\.\s/m.test(text);
    const hasBlockquotes = /^>\s/m.test(text);
    const hasCodeBlocks = text.includes('```');
    const hasHorizontalRules = /^---\s*$/m.test(text) || /^\*\*\*\s*$/m.test(text);
    
    // Check if text has any inline markdown syntax (excluding HTML tags)
    // Remove HTML tags first, then check for markdown in remaining text
    const textWithoutHtml = text.replace(/<[^>]+>/g, '');
    const hasInlineMarkdown = /[*_`]/.test(textWithoutHtml);

    // CRITICAL FIX: If no markdown syntax at all, return text as-is to preserve HTML attributes
    // This prevents marked from escaping quotes in HTML attributes like data-cycling-choices='["One","Two"]'
    if (!hasHeaders && !hasLists && !hasBlockquotes && !hasCodeBlocks && !hasHorizontalRules && !hasInlineMarkdown) {
      return text;
    }

    // Configure marked options
    const markedOptions = {
      async: false,
      breaks: false,        // Don't convert \n to <br>
      gfm: true,           // GitHub flavored markdown  
      headerIds: false,    // Don't add IDs to headers
      mangle: false,       // Don't escape HTML entities in text
      pedantic: false      // Use lenient parsing
    };

    // If content contains block-level elements, use full markdown parsing
    if (hasHeaders || hasLists || hasBlockquotes || hasCodeBlocks || hasHorizontalRules) {
      return marked.parse(text, markedOptions);
    }

    // For inline content, use parseInline which preserves HTML tags
    return marked.parseInline(text, markedOptions);
  }

}
