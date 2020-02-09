/**
 * An object representing a passage. The current passage will be `window.passage`
 *
 * @class Passage
 */

class Passage {
  constructor (id, name, tags, source) {
    // Test for jQuery
    if (!(typeof $ !== 'undefined' && $ !== null)) {
      throw new Error("Global '$' not defined!");
    }

    // Test for underscore
    if (!(typeof _ !== 'undefined' && _ !== null)) {
      throw new Error("Global '_' not defined!");
    }

    // Test for marked
    if (!(typeof marked !== 'undefined' && marked !== null)) {
      throw new Error("Global 'marked' not defined!");
    }

    /**
     * @property {number} id - id number of passage
     * @type {number}
     */

    this.id = id || 1;

    /**
     * @property {string} name - The name of passage
     * @type {string}
     */

    this.name = name || 'Default';

    /**
     * @property {Array} tags - The tags of the passage.
     * @type {Array}
     */

    this.tags = tags || [];

    /**
     * @property {string} source - The passage source code.
     * @type {string}
     */

    this.source = _.unescape(source);
  }

  /**
   * Produce HTML from Markdown input
   *
   * @function render
   * @param {string} source - Source to parse
   */

  render (source) {
    // Test if 'source' is defined or not
    if (!(typeof source !== 'undefined' && source !== null)) {
      // Assume that 'this.source' is the correct source
      source = this.source;
    }

    let result = '';

    try {
      result = _.template(source)({ s: window.story.state, $: $ });
    } catch (error) {
      $.event.trigger('sm.story.error', [error, 'Passage.render() using _.template()']);
    }

    /**
     * An internal helper function that converts markup like #id.class into HTML
     * attributes.
     *
     * @function renderAttrs
     * @private
     * @param {string} attrs - an attribute shorthand, i.e. #myId.className. There are
     *  two special leading prefixes: - (minus) will hide an element, and 0 will
     *  give it a href property that does nothing.
     * @returns {string} HTML source code
     */
    function renderAttrs (attrs) {
      var result = '';

      for (var i = 0; attrs[i] === '-' || attrs[i] === '0'; i++) {
        switch (attrs[i]) {
          case '-':
            result += 'style="display:none" ';
            break;

          case '0':
            result += 'href="javascript:void(0)" ';
            break;
        }
      }

      var classes = [];
      var id = null;
      /* eslint-disable no-useless-escape */
      var classOrId = /([#\.])([^#\.]+)/g;
      /* eslint-enable no-useless-escape */
      var matches = classOrId.exec(attrs);

      while (matches !== null) {
        switch (matches[1]) {
          case '#':
            id = matches[2];
            break;

          case '.':
            classes.push(matches[2]);
            break;
        }

        matches = classOrId.exec(attrs);
      }

      if (id !== null) {
        result += 'id="' + id + '" ';
      }

      if (classes.length > 0) {
        result += 'class="' + classes.join(' ') + '"';
      }

      return result.trim();
    }

    /**
     * Transform class, ID, hidden, and link shorthands in HTML tags.
     * <a-0.class#id> becomes
     * <a href="javascript:void(0)" style="display: none" class="class" id="id">
     */

    /* eslint-disable no-useless-escape */
    result = result.replace(
      /<([a-z]+)([\.#\-0].*?)(?=[\s>])/gi,
      function (match, tagName, attrs) {
        return '<' + tagName + ' ' + renderAttrs(attrs);
      }
    );
    /* eslint-enable no-useless-escape */

    /* [[links]] with extra markup {#id.class} */
    result = result.replace(/\[\[(.*?)\]\]\{(.*?)\}/g, function (match, target, attrs) {
      var display = target;

      /* display|target format */

      var barIndex = target.indexOf('|');

      if (barIndex !== -1) {
        display = target.substr(0, barIndex);
        target = target.substr(barIndex + 1);
      } else {
        /* display->target format */

        var rightArrIndex = target.indexOf('->');

        if (rightArrIndex !== -1) {
          display = target.substr(0, rightArrIndex);
          target = target.substr(rightArrIndex + 2);
        } else {
          /* target<-display format */

          var leftArrIndex = target.indexOf('<-');

          if (leftArrIndex !== -1) {
            display = target.substr(leftArrIndex + 2);
            target = target.substr(0, leftArrIndex);
          }
        }
      }

      return '<a href="javascript:void(0)" data-passage="' +
        target + '" ' + renderAttrs(attrs) + '>' + display + '</a>';
    });

    /* Classic [[links]]  */
    result = result.replace(/\[\[(.*?)\]\]/g, function (match, target) {
      var display = target;

      /* display|target format */
      var barIndex = target.indexOf('|');

      if (barIndex !== -1) {
        display = target.substr(0, barIndex);
        target = target.substr(barIndex + 1);
      } else {
        /* display->target format */
        var rightArrIndex = target.indexOf('->');

        if (rightArrIndex !== -1) {
          display = target.substr(0, rightArrIndex);
          target = target.substr(rightArrIndex + 2);
        } else {
          /* target<-display format */

          var leftArrIndex = target.indexOf('<-');

          if (leftArrIndex !== -1) {
            display = target.substr(leftArrIndex + 2);
            target = target.substr(0, leftArrIndex);
          }
        }
      }

      return '<a href="javascript:void(0)" data-passage="' +
      target + '">' + display + '</a>';
    });

    // Prevent template() from triggering markdown code blocks
    // Skip producing code blocks completely
    const renderer = new marked.Renderer();
    renderer.code = function (code) {
      return code;
    };

    marked.setOptions({ smartypants: true, renderer: renderer });
    let newResult = marked(result);

    // Test for new <p> tags from Marked
    if (!result.endsWith('</p>\n') && newResult.endsWith('</p>\n')) {
      newResult = newResult.replace(/^<p>|<\/p>$|<\/p>\n$/g, '');
    }

    return newResult;
  }
}

module.exports = Passage;
