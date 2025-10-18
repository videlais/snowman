(self["webpackChunksnowman"] = self["webpackChunksnowman"] || []).push([[114],{

/***/ 24:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 72:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
if (62 == __webpack_require__.j) {
	/* harmony import */ var _DOMUtils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(719);
}


/**
 * Utilities class providing helper functions
 */
class Utilities {
  /**
   * Accepts a function, wait, and optional set of arguments.
   * After the wait, the function will run with the passed arguments.
   * @function delay
   * @param {Function}    func    Function to run.
   * @param {number}      wait    Number of milliseconds to wait.
   * @param {any}         [args]  Optional arguments to pass to the function.
   * @returns {number}            Identification of timer returned from setTimeout().
   */
  static delay (func, wait, ...args) {
    const boundFunction = func.bind(func);
    return setTimeout(boundFunction, wait, ...args);
  }

  /**
   * Accepts mixed input of arrays or comma-separated list of values and returns a random entry.
   * Will return null when given no arguments.
   *
   * Examples:
   * - either(1,2,3);
   * - either(1,[2],[4,5]);
   * @function either
   * @param   {object|Array} args Array or comma-separated list.
   * @returns {object|null}       Random entry or null.
   */
  static either (...args) {
    let tempArray = [];
    let result = null;

    // For every entry...
    for (const entry of args) {
      // If it is an array...
      if (Array.isArray(entry)) {
        // Spread out any subentries and add them to temporary array.
        tempArray = [...tempArray, ...entry];
      } else {
        // push the entry into the temporary array.
        tempArray.push(entry);
      }
    }

    // Check if any entries were added.
    if (tempArray.length > 0) {
      // If they were, grab one of them.
      result = tempArray[Math.floor(Math.random() * tempArray.length)];
    }

    // Return either null (no entries) or random entry.
    return result;
  }

  /**
   * Applies external CSS files.
   * @function applyExternalStyles
   * @param {Array} files Array of one or more external files to load.
   */
  static applyExternalStyles (files) {
    if (Array.isArray(files)) {
      for (const location of files) {
        const link = _DOMUtils_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.createElement('link', {
          attributes: {
            rel: 'stylesheet',
            type: 'text/css',
            href: location
          }
        });
        _DOMUtils_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.append('head', link);
      }
    } else {
      throw new TypeError('Method only accepts an array!');
    }
  }

  /**
   * Return random integer within range.
   * @function randomInt
   * @param   {number}  min   Start of range (default 0).
   * @param   {number}  max   End of range (default 0).
   * @returns {number}        Number in range.
   */
  static randomInt (min = 0, max = 0) {
    // Round up to min.
    min = Math.ceil(min);
    // Round down to max.
    max = Math.floor(max);

    // Is min greater than max?
    if (min > max) {
      max = min;
      min = 0;
    }

    return Math.floor(Math.random() * (max - min)) + min;
  }

  /**
   * Return random decimal number within range.
   * @function randomFloat
   * @param   {number}  min   Start of range (default 0).
   * @param   {number}  max   End of range (default 0).
   * @returns {number}        Decimal number in range.
   */
  static randomFloat (min = 0, max = 0) {
    // Is min greater than max?
    if (min > max) {
      max = min;
      min = 0;
    }

    return Math.random() * (max - min) + min;
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((/* runtime-dependent pure expression or super */ 62 == __webpack_require__.j ? (Utilities) : null));


/***/ }),

/***/ 204:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * An object representing a passage. The current passage will be `window.passage`.
 * @class Passage
 */

class Passage {
  constructor (name = 'Default', tags = [], source = '') {
    /**
     * @property {string} name - The name of passage
     * @type {string}
     */

    this.name = name;

    /**
     * @property {Array} tags - The tags of the passage.
     * @type {Array}
     */

    this.tags = tags;

    /**
     * @property {string} source - The passage source code.
     * @type {string}
     */

    this.source = source;
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((/* runtime-dependent pure expression or super */ 62 == __webpack_require__.j ? (Passage) : null));


/***/ }),

/***/ 280:
/***/ (() => {

/* (ignored) */

/***/ }),

/***/ 421:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var events__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(events__WEBPACK_IMPORTED_MODULE_0__);


const handler = {
  get: (target, property) => {
    return target[property];
  },
  set: (target, property, value) => {
    // Make change.
    target[property] = value;
    // Emit change.
    State.events.emit('change', property, value);
    // Return true.
    return true;
  },
  ownKeys (target) {
    return Object.keys(target);
  },
  has (target, prop) {
    return prop in target;
  },
  deleteProperty (target, prop) {
    // Test for inclusion as property.
    if (prop in target) {
      // Emit deletion event.
      State.events.emit('deletion', prop);
      // Delete via Reflection.
      return Reflect.deleteProperty(target, prop);
    }

    // If property doesn't exist, deletion is considered successful
    return true;
  }
};

/**
 * @class State
 */
class State {
  static events = new events__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
  static store = new Proxy({}, handler);
  /**
   * Update current state properties to previous state values.
   * @param {object} state - Object containing state properties.
   */
  static updateState (state) {
    for (const property in state) {
      this.store[property] = state[property];
    }
  }

  /**
   * Resets State properties to default values.
   */
  static reset () {
    this.events = new events__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    this.store = new Proxy({}, handler);
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((/* runtime-dependent pure expression or super */ 62 == __webpack_require__.j ? (State) : null));


/***/ }),

/***/ 719:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Lightweight DOM utility module to gradually replace jQuery functionality
 * with modern vanilla JavaScript equivalents for better performance and smaller bundle size.
 * @class DOMUtils
 */
class DOMUtils {
  /**
   * Select a single element by CSS selector
   * @param {string} selector - CSS selector
   * @returns {Element|null} First matching element or null
   */
  static select(selector) {
    return document.querySelector(selector);
  }

  /**
   * Select all elements by CSS selector
   * @param {string} selector - CSS selector
   * @returns {NodeList} All matching elements
   */
  static selectAll(selector) {
    return document.querySelectorAll(selector);
  }

  /**
   * Create a new element with optional attributes and properties
   * @param {string} tagName - HTML tag name
   * @param {Object} options - Element attributes and properties
   * @returns {Element} Created element
   */
  static createElement(tagName, options = {}) {
    const element = document.createElement(tagName);
    
    // Set attributes
    if (options.attributes) {
      for (const [key, value] of Object.entries(options.attributes)) {
        element.setAttribute(key, value);
      }
    }
    
    // Set properties directly
    if (options.properties) {
      Object.assign(element, options.properties);
    }
    
    // Set text content
    if (options.textContent) {
      element.textContent = options.textContent;
    }
    
    // Set HTML content
    if (options.innerHTML) {
      element.innerHTML = options.innerHTML;
    }
    
    return element;
  }

  /**
   * Add event listener to element(s)
   * @param {Element|NodeList|string} target - Element(s) or selector
   * @param {string} event - Event type
   * @param {Function} handler - Event handler
   * @param {Object} options - Event listener options
   */
  static on(target, event, handler, options = {}) {
    const elements = typeof target === 'string' 
      ? this.selectAll(target) 
      : target instanceof NodeList ? target : [target];
    
    for (const element of elements) {
      if (element && element.addEventListener) {
        element.addEventListener(event, handler, options);
      }
    }
  }

  /**
   * Remove event listener from element(s)
   * @param {Element|NodeList|string} target - Element(s) or selector
   * @param {string} event - Event type
   * @param {Function} handler - Event handler
   */
  static off(target, event, handler) {
    const elements = typeof target === 'string' 
      ? this.selectAll(target) 
      : target instanceof NodeList ? target : [target];
    
    for (const element of elements) {
      if (element && element.removeEventListener) {
        element.removeEventListener(event, handler);
      }
    }
  }

  /**
   * Set or get HTML content of element(s)
   * @param {Element|string} target - Element or selector
   * @param {string} [content] - HTML content to set
   * @returns {string|undefined} Current HTML content if getting, undefined if setting
   */
  static html(target, content) {
    const element = typeof target === 'string' ? this.select(target) : target;
    
    if (!element) return;
    
    if (content !== undefined) {
      element.innerHTML = content;
    } else {
      return element.innerHTML;
    }
  }

  /**
   * Set or get text content of element(s)
   * @param {Element|string} target - Element or selector
   * @param {string} [content] - Text content to set
   * @returns {string|undefined} Current text content if getting, undefined if setting
   */
  static text(target, content) {
    const element = typeof target === 'string' ? this.select(target) : target;
    
    if (!element) return;
    
    if (content !== undefined) {
      element.textContent = content;
    } else {
      return element.textContent;
    }
  }

  /**
   * Set or get CSS styles
   * @param {Element|string} target - Element or selector
   * @param {string|Object} property - CSS property name or object of properties
   * @param {string} [value] - CSS property value
   * @returns {string|undefined} Current style value if getting, undefined if setting
   */
  static css(target, property, value) {
    const element = typeof target === 'string' ? this.select(target) : target;
    
    if (!element) return;
    
    if (typeof property === 'object') {
      // Set multiple properties
      Object.assign(element.style, property);
    } else if (value !== undefined) {
      // Set single property
      element.style[property] = value;
    } else {
      // Get property
      return getComputedStyle(element)[property];
    }
  }

  /**
   * Get attribute value or set attribute
   * @param {Element|string} target - Element or selector
   * @param {string} name - Attribute name
   * @param {string} [value] - Attribute value to set
   * @returns {string|null|undefined} Attribute value if getting, undefined if setting
   */
  static attr(target, name, value) {
    const element = typeof target === 'string' ? this.select(target) : target;
    
    if (!element) return;
    
    if (value !== undefined) {
      element.setAttribute(name, value);
    } else {
      return element.getAttribute(name);
    }
  }

  /**
   * Append element to target
   * @param {Element|string} target - Target element or selector
   * @param {Element|string} content - Element to append or HTML string
   */
  static append(target, content) {
    const element = typeof target === 'string' ? this.select(target) : target;
    
    if (!element) return;
    
    if (typeof content === 'string') {
      element.insertAdjacentHTML('beforeend', content);
    } else {
      element.appendChild(content);
    }
  }

  /**
   * Remove element(s) from DOM
   * @param {Element|string} target - Element or selector
   */
  static remove(target) {
    const elements = typeof target === 'string' 
      ? this.selectAll(target) 
      : [target];
    
    for (const element of elements) {
      if (element && element.remove) {
        element.remove();
      }
    }
  }

  /**
   * Iterate over elements matching selector or provided elements
   * @param {string|NodeList|Element} target - CSS selector, NodeList, or single element
   * @param {Function} callback - Function to call for each element
   */
  static each(target, callback) {
    let elements;
    
    if (typeof target === 'string') {
      elements = this.selectAll(target);
    } else if (target instanceof NodeList || Array.isArray(target)) {
      elements = target;
    } else if (target instanceof Element) {
      elements = [target];
    } else {
      return;
    }
    
    Array.from(elements).forEach((element, index) => {
      callback.call(element, index, element);
    });
  }

  /**
   * Get children elements of target
   * @param {Element|string} target - Element or selector
   * @param {string} [childSelector] - Optional selector to filter children
   * @returns {Array} Array of child elements
   */
  static children(target, childSelector) {
    const element = typeof target === 'string' ? this.select(target) : target;
    
    if (!element) return [];
    
    const children = Array.from(element.children);
    
    if (childSelector) {
      return children.filter(child => this.matches(child, childSelector));
    }
    
    return children;
  }

  /**
   * Check if element matches selector
   * @param {Element} element - Element to check
   * @param {string} selector - CSS selector
   * @returns {boolean} True if element matches selector
   */
  static matches(element, selector) {
    return element && element.matches && element.matches(selector);
  }

  /**
   * Find elements within target element
   * @param {Element|string} target - Target element or selector
   * @param {string} selector - CSS selector to find
   * @returns {NodeList} Matching elements
   */
  static find(target, selector) {
    const element = typeof target === 'string' ? this.select(target) : target;
    return element ? element.querySelectorAll(selector) : [];
  }

  /**
   * Get the closest ancestor element matching selector
   * @param {Element} element - Starting element
   * @param {string} selector - CSS selector
   * @returns {Element|null} Closest matching ancestor or null
   */
  static closest(element, selector) {
    return element && element.closest ? element.closest(selector) : null;
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((/* runtime-dependent pure expression or super */ 62 == __webpack_require__.j ? (DOMUtils) : null));

/***/ }),

/***/ 726:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {

"use strict";

;// ./src/ServiceContainer.js
/**
 * Service Container for dependency injection
 * Manages service instances and their dependencies
 * @class ServiceContainer
 */
class ServiceContainer {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
    this.factories = new Map();
  }

  /**
   * Register a service constructor
   * @param {string} name - Service name
   * @param {Function} constructor - Service constructor function
   * @param {Array<string>} dependencies - Array of dependency names
   */
  register(name, constructor, dependencies = []) {
    this.services.set(name, {
      constructor,
      dependencies,
      isSingleton: false
    });
  }

  /**
   * Register a singleton service
   * @param {string} name - Service name
   * @param {Function} constructor - Service constructor function
   * @param {Array<string>} dependencies - Array of dependency names
   */
  singleton(name, constructor, dependencies = []) {
    this.services.set(name, {
      constructor,
      dependencies,
      isSingleton: true
    });
  }

  /**
   * Register a factory function
   * @param {string} name - Service name
   * @param {Function} factory - Factory function
   * @param {Array<string>} dependencies - Array of dependency names
   */
  factory(name, factory, dependencies = []) {
    this.factories.set(name, { factory, dependencies });
  }

  /**
   * Register an instance directly
   * @param {string} name - Service name
   * @param {*} instance - Service instance
   */
  instance(name, instance) {
    this.singletons.set(name, instance);
  }

  /**
   * Resolve a service by name
   * @param {string} name - Service name
   * @returns {*} Service instance
   */
  resolve(name) {
    // Check for existing singleton
    if (this.singletons.has(name)) {
      return this.singletons.get(name);
    }

    // Check for factory
    if (this.factories.has(name)) {
      const { factory, dependencies } = this.factories.get(name);
      const resolvedDeps = dependencies.map(dep => this.resolve(dep));
      return factory(...resolvedDeps);
    }

    // Check for registered service
    if (this.services.has(name)) {
      const service = this.services.get(name);
      const resolvedDeps = service.dependencies.map(dep => this.resolve(dep));
      const instance = new service.constructor(...resolvedDeps);

      // Store singleton if needed
      if (service.isSingleton) {
        this.singletons.set(name, instance);
      }

      return instance;
    }

    throw new Error(`Service '${name}' not found in container`);
  }

  /**
   * Check if a service is registered
   * @param {string} name - Service name
   * @returns {boolean}
   */
  has(name) {
    return this.services.has(name) || 
           this.singletons.has(name) || 
           this.factories.has(name);
  }

  /**
   * Get all registered service names
   * @returns {Array<string>}
   */
  getServiceNames() {
    return [
      ...this.services.keys(),
      ...this.singletons.keys(),
      ...this.factories.keys()
    ];
  }

  /**
   * Clear all services (useful for testing)
   */
  clear() {
    this.services.clear();
    this.singletons.clear();
    this.factories.clear();
  }
}

/* harmony default export */ const src_ServiceContainer = (ServiceContainer);
// EXTERNAL MODULE: ./src/DOMUtils.js
var DOMUtils = __webpack_require__(719);
// EXTERNAL MODULE: ./src/Passage.js
var Passage = __webpack_require__(204);
// EXTERNAL MODULE: ./node_modules/markdown-it/index.mjs + 75 modules
var markdown_it = __webpack_require__(557);
;// ./src/Markdown.js


const md = (0,markdown_it/* default */.A)({
  html: true, // Enable HTML tags in source
  xhtmlOut: true, // Use '/' to close single tags (<br />).
  breaks: true // Convert \n into <br />
});

class Markdown {
  static parse (text) {
    const rules = [
      // [[rename|destination][onclick]]
      [/\[\[(.*?)\|(.*?)\](?:\[(.*?)\])?\]/g, (m, p1, p2, p3 = '') => `<tw-link role="link" onclick="${p3.replaceAll('s.', 'window.Story.state.')}" data-passage="${p2}">${p1}</tw-link>`],
      // [[rename|destination]]
      // [/\[\[(.*?)\|(.*?)\]\]/g, '<tw-link role="link" data-passage="$2">$1</tw-link>'],
      // [[rename->dest][onclick]]
      [/\[\[(.*?)->(.*?)\](?:\[(.*?)\])?\]/g, (m, p1, p2, p3 = '') => `<tw-link role="link" onclick="${p3.replaceAll('s.', 'window.Story.state.')}" data-passage="${p2}">${p1}</tw-link>`],
      // [[rename->dest]]
      // [/\[\[(.*?)->(.*?)\]\]/g, '<tw-link role="link" data-passage="$2">$1</tw-link>'],
      // [[dest<-rename][onclick]]
      [/\[\[(.*?)<-(.*?)\](?:\[(.*?)\])?\]/g, (m, p1, p2, p3 = '') => `<tw-link role="link" onclick="${p3.replaceAll('s.', 'window.Story.state.')}" data-passage="${p1}">${p2}</tw-link>`],
      // [[dest<-rename]]
      // [/\[\[(.*?)<-(.*?)\]\]/g, '<tw-link role="link" data-passage="$1">$2</tw-link>'],
      // [[destination][onclick]]
      [/\[\[(.*?)\](?:\[(.*?)\])?\]/g, (m, p1, p2 = '') => `<tw-link role="link" onclick="${p2.replaceAll('s.', 'window.Story.state.')}" data-passage="${p1}">${p1}</tw-link>`]
      // [[destination]]
      // [/\[\[(.*?)\]\]/g, '<tw-link role="link" data-passage="$1">$1</tw-link>']
    ];

    rules.forEach(([rule, template]) => {
      text = text.replaceAll(rule, template);
    });

    return text;
  }

  static convert (text) {
    return md.render(text);
  }

  static unescape (text) {
    const unescapeSequences = [
      ['&amp;', '&'],
      ['&lt;', '<'],
      ['&gt;', '>'],
      ['&quot;', '"'],
      ['&#x27;', "'"],
      ['&#x60;', '`']
    ];

    unescapeSequences.forEach(([rule, template]) => {
      text = text.replaceAll(rule, template);
    });

    return text;
  }
}

/* harmony default export */ const src_Markdown = (Markdown);

// EXTERNAL MODULE: ./src/State.js
var State = __webpack_require__(421);
;// ./src/History.js


/**
 * @namespace History
 * @property {Array}    history   Array of passages and previous state.
 * @property {number}   position  Current position in the array.
 */

class History {
  static history = [];
  static position = 0;
  /**
   * Add a passage name to the history array.
   * @function add
   * @param {string} name - Name of the passage to add.
   */
  static add (name) {
    // Append to the end
    this.history.push({
      passageName: name,
      state: Object.assign({}, State/* default */.A.store)
    });

    // Reset the position to entry at the end.
    this.position = this.history.length - 1;
  }

  /**
   * Step back one index in the history array.
   * @function undo
   * @returns {string | null} Name of now current passage; null if undo not possible.
   */
  static undo () {
    let result = null;

    if (this.position >= 1 && this.history.length >= 1) {
      // Decrease position
      this.position -= 1;
      // Find state.
      const state = this.history[this.position].state;
      // Have State update itself.
      State/* default */.A.updateState(state);
      // Return current passage name
      result = this.history[this.position].passageName;
    }

    return result;
  }

  /**
   * Step forward in history array, if possible.
   * @function Redo
   * @returns {string | null} Name of now current passage; null if redo not possible.
   */
  static redo () {
    let result = null;

    if (this.position >= 0 && this.position < this.history.length - 1) {
      // Increase position
      this.position += 1;
      // Find state.
      const state = this.history[this.position].state;
      // Have State update itself.
      State/* default */.A.updateState(state);
      // Return current passage name
      result = this.history[this.position].passageName;
    }

    return result;
  }

  /**
   * Returns true if the named passage exists within the history array.
   * @function hasVisited
   * @param {string | Array} passageName - Name(s) of passage to check.
   * @returns {boolean} True if passage(s) in history; false otherwise.
   */
  static hasVisited (passageName = null) {
    let result = false;

    if (Array.isArray(passageName)) {
      result = passageName.every((passageName) => {
        return this.history.some(entry => {
          return entry.passageName === passageName;
        });
      });
    } else {
      result = this.history.some((p) => {
        return p.passageName === passageName;
      });
    }

    return result;
  }

  /**
   * Returns number of visits for a single passage.
   * @function visited
   * @param   {string} passageName  Passage name to check.
   * @returns {number}              Number of visits to passage.
   */
  static visited (passageName) {
    let searchResults = [];
    searchResults = this.history.filter(entry => entry.passageName === passageName);
    return searchResults.length;
  }

  /**
   * Resets History values to defaults.
   * @function reset
   */
  static reset () {
    this.history = [];
    this.position = 0;
  }
}

/* harmony default export */ const src_History = (History);

// EXTERNAL MODULE: ./src/Storylets.js + 1 modules
var Storylets = __webpack_require__(704);
// EXTERNAL MODULE: ./node_modules/ejs/lib/ejs.js
var ejs = __webpack_require__(155);
var ejs_default = /*#__PURE__*/__webpack_require__.n(ejs);
// EXTERNAL MODULE: ./src/Screen.js
var Screen = __webpack_require__(990);
// EXTERNAL MODULE: ./src/Utilities.js
var Utilities = __webpack_require__(72);
;// ./src/Script.js





/**
 * @external Story
 * @see {@link Story}
 */

class Script {
  /**
   * Render JavaScript within a templated sandbox and return possible output.
   * Will throw error if code does.
   * @function run
   * @param {string} script - Code to run.
   * @param {Story} story - Current story object.
   * @returns {string} Any output, if produced.
   */
  static run (script, story) {
    let result = '';

    try {
      // Send in pseudo-global properties.
      result = ejs_default().render(script,
        {
          s: story.store,
          Storage: story.storage,
          Storylets: story.storylets,
          History: {
            hasVisited: src_History.hasVisited.bind(src_History),
            visited: src_History.visited.bind(src_History),
            length: src_History.history.length
          },
          Screen: {
            lock: Screen/* default */.A.lock.bind(),
            unlock: Screen/* default */.A.unlock.bind()
          },
          Sidebar: {
            hide: story.sidebar.hide.bind(),
            show: story.sidebar.show.bind()
          },
          Utils: {
            delay: Utilities/* default */.A.delay.bind(),
            either: Utilities/* default */.A.either.bind(),
            applyExternalStyles: Utilities/* default */.A.applyExternalStyles.bind(),
            randomInt: Utilities/* default */.A.randomInt.bind()
          }
        },
        {
          outputFunctionName: 'print'
        }
      );
    } catch (e) {
      // Throw error if rendering fails.
      throw new Error(`Error compiling template code: ${e}`);
    }

    return result;
  }
}

/* harmony default export */ const src_Script = (Script);

// EXTERNAL MODULE: ./node_modules/jquery/dist/jquery.js
var jquery = __webpack_require__(692);
var jquery_default = /*#__PURE__*/__webpack_require__.n(jquery);
;// ./src/Sidebar.js




class Sidebar {
  constructor () {
    /**
     * Reference to undo icon.
     * @property {Element} undoIcon - Undo element.
     * @type {Element}
     */
    this.undoIcon = DOMUtils/* default */.A.select('tw-icon[title="Undo"]');

    /**
     * Reference to redo icon.
     * @property {Element} redoIcon - Redo element.
     * @type {Element}
     */
    this.redoIcon = DOMUtils/* default */.A.select('tw-icon[title="Redo"]');

    // For backward compatibility with tests, add jQuery methods to elements
    if (this.undoIcon) {
      const $undoIcon = jquery_default()(this.undoIcon);
      this.undoIcon.css = $undoIcon.css.bind($undoIcon);
      this.undoIcon.trigger = $undoIcon.trigger.bind($undoIcon);
    }

    if (this.redoIcon) {
      const $redoIcon = jquery_default()(this.redoIcon);
      this.redoIcon.css = $redoIcon.css.bind($redoIcon);
      this.redoIcon.trigger = $redoIcon.trigger.bind($redoIcon);
    }

    // Listen for user click interactions.
    DOMUtils/* default */.A.on(this.undoIcon, 'click', () => {
      // If undo is ever used, redo becomes available.
      this.showRedo();
      // Emit 'undo'
      State/* default */.A.events.emit('undo');
    });

    // Listen for user click interactions.
    DOMUtils/* default */.A.on(this.redoIcon, 'click', () => {
      State/* default */.A.events.emit('redo');
    });

    // Start with undo hidden.
    this.hideUndo();

    // Start with redo hidden.
    this.hideRedo();
  }

  /**
   * Show undo icon.
   * @function showUndo
   */
  showUndo () {
    DOMUtils/* default */.A.css(this.undoIcon, 'visibility', 'visible');
  }

  /**
   * Hide undo icon.
   * @function hideUndo
   */
  hideUndo () {
    DOMUtils/* default */.A.css(this.undoIcon, 'visibility', 'hidden');
  }

  /**
   * Show redo icon.
   * @function showRedo
   */
  showRedo () {
    DOMUtils/* default */.A.css(this.redoIcon, 'visibility', 'visible');
  }

  /**
   * Hide redo icon.
   * @function hideRedo
   */
  hideRedo () {
    DOMUtils/* default */.A.css(this.redoIcon, 'visibility', 'hidden');
  }

  /**
   * Trigger undo event.
   * @function undo
   */
  undo () {
    State/* default */.A.events.emit('undo');
  }

  /**
   * Trigger redo event.
   * @function redo
   */
  redo () {
    State/* default */.A.events.emit('redo');
  }

  /**
   * Shows sidebar.
   * @function show
   */
  show () {
    // Show tw-sidebar.
    DOMUtils/* default */.A.css(DOMUtils/* default */.A.select('tw-sidebar'), 'visibility', 'visible');
  }

  /**
   * Hides sidebar.
   * @function hide
   */
  hide () {
    // Hide tw-sidebar.
    DOMUtils/* default */.A.css(DOMUtils/* default */.A.select('tw-sidebar'), 'visibility', 'hidden');
  }
}

/* harmony default export */ const src_Sidebar = (Sidebar);

;// ./src/Storage.js



class Storage {
  /**
   * Remove save by name from the localStorage.
   * @function removeSave
   * @param {string} save Name of save string.
   * @returns {boolean} True if remove was successful.
   */
  static removeSave (save = 'default') {
    let result = false;

    if (Storage.available()) {
      globalThis.localStorage.removeItem(`${save}.snowman.history`);
      result = true;
    }

    return result;
  }

  /**
   * Returns if save string exists in localStorage
   * @function doesSaveExist
   * @param {string} save Name of save string
   * @returns {boolean} True if save string exists
   */
  static doesSaveExist (save = 'default') {
    let history = null;

    if (Storage.available()) {
      history = globalThis.localStorage.getItem(`${save}.snowman.history`);
    }

    return (history !== null);
  }

  /**
   * Save history using optional string prefix
   * @function createSave
   * @param {string} save Optional name of save string
   * @returns {boolean} Returns true if save was successful
   */
  static createSave (save = 'default') {
    let result = false;

    if (Storage.available()) {
      const saveData = {
        history: src_History.history,
        position: src_History.position
      };
      globalThis.localStorage.setItem(`${save}.snowman.history`, JSON.stringify(saveData));
      result = true;
    }

    return result;
  }

  /**
   * Parses and normalizes save data format
   * @private
   * @param {any} parsedData - The parsed JSON data
   * @returns {object} Normalized history data with history array and position
   */
  static _normalizeSaveData (parsedData) {
    if (Array.isArray(parsedData)) {
      // Old format: just an array of history entries
      return {
        history: parsedData,
        position: Math.max(0, parsedData.length - 1)
      };
    }
    
    if (parsedData && typeof parsedData === 'object' && 'history' in parsedData) {
      // New format: object with history and position properties
      return {
        history: parsedData.history || [],
        position: typeof parsedData.position === 'number' ? parsedData.position : 0
      };
    }
    
    // Fallback for unexpected formats
    return { history: [], position: 0 };
  }

  /**
   * Resets history to safe state
   * @private
   */
  static _resetToSafeState () {
    src_History.history = [];
    src_History.position = 0;
  }

  /**
   * Attempts to restore the history and store based on optional save name
   * @function restoreSave
   * @param {string} save Optional name of save string
   * @returns {boolean} Returns true if restore was successful
   */
  static restoreSave (save = 'default') {
    if (!Storage.available()) {
      return false;
    }

    const historyData = globalThis.localStorage.getItem(`${save}.snowman.history`);
    if (historyData === null) {
      return true;
    }

    try {
      const parsedData = JSON.parse(historyData);
      const { history, position } = Storage._normalizeSaveData(parsedData);
      
      src_History.history = history;
      src_History.position = Math.min(position, Math.max(0, history.length - 1));
      
      // Restore state if we have valid history
      if (history.length > 0 && src_History.position >= 0) {
        const state = history[src_History.position].state;
        State/* default */.A.updateState(state);
      }
      
      return true;
    } catch (error) {
      console.warn('Warning: Failed to parse save data, resetting to safe state:', error.message);
      Storage._resetToSafeState();
      return false;
    }
  }

  /**
   * Returns if localStorage is available or not in browser context.
   * @function available
   * @returns {boolean} Returns true if localStorage can be used.
   */
  static available () {
    // Set default value to false.
    let result = false;

    try {
      globalThis.localStorage.setItem('testKey', 'test');
      globalThis.localStorage.removeItem('testKey');
      result = true;
    } catch(error) {
      console.info('Info: localStorage is not available. Error:', error);
    }

    // Return result
    return result;
  }

  /**
   * Clears localStorage, if available.
   * @function removeAll
   * @returns {boolean} Returns true if removal was possible.
   */
  static removeAll () {
    // Set default value to false.
    let result = false;
    // Is localStorage available?
    if (Storage.available()) {
      // Clear the localStorage
      globalThis.localStorage.clear();
      // Record result
      result = true;
    }
    // Return result
    return result;
  }
}

/* harmony default export */ const src_Storage = (Storage);

;// ./src/ServiceRegistry.js
/**
 * Service Registry - configures the dependency injection container
 * @module ServiceRegistry
 */












/**
 * Create and configure the service container
 * @returns {ServiceContainer} Configured service container
 */
function createServiceContainer() {
  const container = new src_ServiceContainer();

  // Register utility services as singletons
  container.instance('domUtils', DOMUtils/* default */.A);
  container.instance('markdown', src_Markdown);
  container.instance('state', State/* default */.A);
  container.instance('history', src_History);
  container.instance('storylets', Storylets/* default */.A);
  container.instance('script', src_Script);
  container.instance('screen', Screen/* default */.A);
  container.instance('storage', src_Storage);

  // Register Passage as a factory (since we create multiple instances)
  container.factory('passage', (name, tags, source) => {
    return new Passage/* default */.A(name, tags, source);
  });

  // Register Sidebar as singleton (since we create an instance)
  container.singleton('sidebar', src_Sidebar, []);

  return container;
}

/**
 * Global service container instance
 */
let globalContainer = null;

/**
 * Get the global service container
 * @returns {ServiceContainer} Global service container
 */
function getServiceContainer() {
  if (!globalContainer) {
    globalContainer = createServiceContainer();
  }
  return globalContainer;
}

/**
 * Set the global service container (useful for testing)
 * @param {ServiceContainer} container - Service container to set as global
 */
function setServiceContainer(container) {
  globalContainer = container;
}

/**
 * Reset the global service container
 */
function resetServiceContainer() {
  globalContainer = null;
}

/* harmony default export */ const ServiceRegistry = ({
  createServiceContainer,
  getServiceContainer,
  setServiceContainer,
  resetServiceContainer
});
;// ./src/Story.js
/**
 * @external Element
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element|Element}
 */




/**
 * An object representing the entire story. After the document has completed
 * loading, an instance of this class will be available at `window.Story`.
 * @class Story
 */
class Story {
  /**
   * Create a Story object based on tw-storydata element.
   * @param {ServiceContainer} container - Optional service container for dependency injection
   */
  constructor (container = null) {
    // Get service container (use provided or global)
    this.container = container || getServiceContainer();
    
    // Inject dependencies
    this.domUtils = this.container.resolve('domUtils');
    this.markdown = this.container.resolve('markdown');
    this.state = this.container.resolve('state');
    this.history = this.container.resolve('history');
    this.storyletsModule = this.container.resolve('storylets');
    this.script = this.container.resolve('script');
    this.screen = this.container.resolve('screen');
    this.storage = this.container.resolve('storage');

    /**
     * @property {string} name - The name of the story.
     * @type {string}
     * @readonly
     */
    this.name = this.domUtils.attr('tw-storydata', 'name');

    /**
     * An array of all passages.
     * @property {Array} passages - Passages array.
     * @type {Array}
     */
    this.passages = [];

    // For each child element of the `<tw-storydata>` element,
    //  create a new Passage object based on its attributes.
    this.domUtils.each(this.domUtils.children('tw-storydata', 'tw-passagedata'), (index, element) => {
      // Access any potential tags.
      let tags = this.domUtils.attr(element, 'tags');

      // Does the 'tags' attribute exist?
      if (tags !== '' && tags !== undefined) {
        // Attempt to split by space.
        tags = tags.split(' ');
      } else {
        // It did not exist, so we create it as an empty array.
        tags = [];
      }

      // Push the new passage.
      this.passages.push(new Passage/* default */.A(
        this.domUtils.attr(element, 'name'),
        tags,
        this.markdown.unescape(this.domUtils.html(element))
      ));
    });

    /**
     * Passage element.
     * @property {Element} passageElement Passage element.
     * @type {Element}
     */
    this.passageElement = this.domUtils.select('tw-passage');

    /**
     * Sidebar.
     * @property {Element} sidebar Sidebar instance.
     * @type {Element}
     */
    this.sidebar = this.container.resolve('sidebar');

    // Reset History.
    this.history.reset();

    /**
     * History reference.
     * @property {History} history Reference to History.
     * @type {History}
     */
    // this.history already set above

    /**
     * Screen reference.
     * @property {Screen} screen Reference to Screen.
     * @type {Screen}
     */
    // this.screen already set above

    /**
     * Storage reference.
     * @property {Storage} storage Reference to Storage.
     * @type {Storage}
     */
    // this.storage already set above

    // Reset State.
    this.state.reset();

    /**
     * State.events reference.
     * @property {EventEmitter} events Reference to State.events.
     * @type {EventEmitter}
     */
    this.events = this.state.events;

    /**
     * State.store reference.
     * @property {Proxy} store Reference to State.store.
     * @type {Proxy}
     */
    this.store = this.state.store;

    // Listen for redo events.
    this.state.events.on('redo', () => {
      // Attempt to redo history.
      const passageName = this.history.redo();
      // If redo failed, name will be null.
      if (passageName !== null) {
        // Check if at end of collection.
        if (this.history.position === this.history.history.length - 1) {
          // Hide redo.
          this.sidebar.hideRedo();
          // Show undo.
          this.sidebar.showUndo();
        }
        // Not null, show previous passage.
        this.show(passageName);
      }
    });

    // Listen for undo events.
    this.state.events.on('undo', () => {
      // Show redo if undo is clicked.
      this.sidebar.showRedo();
      // Attempt to undo history.
      const passageName = this.history.undo();
      // If undo failed, name will be null.
      if (passageName !== null) {
        // Check if at beginning of collection.
        if (this.history.position === 0) {
          // Hide undo
          this.sidebar.hideUndo();
        }
        // Not null, show previous passage.
        this.show(passageName);
      }
    });

    /**
     * The current passage.
     * @property {Passage|null} currentPassage Currently showing passage, if any.
     * @type {Passage|null}
     */
    this.currentPassage = null;

    /**
     * Reference to internal Storylets object.
     *
     * Starts as null. During Story.start(), a new object is
     * created based on initial passages.
     * @property {Storylets} storylets Internal reference to Storylets
     * @type {Storylets|null}
     */
    this.storylets = null;
  }

  /**
   * Begins playing this story based on data from tw-storydata.
   * 1. Apply all user styles
   * 2. Run all user scripts
   * 3. Find starting passage
   * 4. Add to starting passage to History.history
   * 5. Show starting passage
   * 6. Trigger 'start' event
   * @function start
   */
  start () {
    // Find all passages with the tag 'storylet'.
    const passageList = this.getPassagesByTag('storylet');
    // Generate initial Storylets collection.
    this.storylets = new Storylets/* default */.A(passageList);

    // For each Twine style, add them to the body as extra style elements.
    this.domUtils.each('*[type="text/twine-css"]', (index, element) => {
      // Append a new `<style>` with text from old.
      this.domUtils.append(document.body, `<style>${this.domUtils.text(element)}</style>`);
    });

    /**
     * Note: Browsers prevent error catching from scripts
     *  added after the initial loading.
     *
     * window.onerror will have error, but it cannot
     *  be caught.
     */
    this.domUtils.each('*[type="text/twine-javascript"]', (index, element) => {
      // Create a new `<script>`.
      const newScriptElement = this.domUtils.createElement('script');
      // Set the text of new from old.
      this.domUtils.text(newScriptElement, this.domUtils.text(element));
      // Append the new `<script>` with text to document body.
      this.domUtils.append(document.body, newScriptElement);
    });

    // Get the startnode value (which is a number).
    const startingPassageID = Number.parseInt(this.domUtils.attr('tw-storydata', 'startnode'));
    // Use the PID to find the name of the starting passage based on elements.
    const startPassage = this.domUtils.attr(`[pid="${startingPassageID}"]`, 'name');
    // Search for the starting passage.
    const passage = this.getPassageByName(startPassage);

    // Does the starting passage exist?
    if (passage === null) {
      // It does not exist.
      // Throw an error.
      throw new Error('Starting passage does not exist!');
    }

    // Add to the history.
    this.history.add(passage.name);

    // Set the global passage to the one about to be shown.
    this.currentPassage = passage;

    // Overwrite current tags
    this.domUtils.attr(this.passageElement, 'tags', passage.tags);

    // Get passage source.
    const passageSource = this.include(passage.name);

    // Overwrite the parsed with the rendered.
    this.domUtils.html(this.passageElement, passageSource);

    // Listen for any reader clicking on `<tw-link>`.
    this.domUtils.on('tw-link[data-passage]', 'click', (event) => {
      // Retrieve data-passage value.
      const passageName = this.domUtils.attr(event.target, 'data-passage');
      // Add to the history.
      this.history.add(passageName);
      // Hide the redo icon.
      this.sidebar.hideRedo();
      // Show the undo icon.
      this.sidebar.showUndo();
      // Show the passage by name.
      this.show(passageName);
    });

    /**
     * Triggered when the story starts.
     * @event State#start
     * @type {string}
     */
    this.state.events.emit('start', passage.name);
  }

  /**
   * Returns an array of none, one, or many passages matching a specific tag.
   * @function getPassagesByTag
   * @param {string} tag - Tag to search for.
   * @returns {Array} Array containing none, one, or many passage objects.
   */
  getPassagesByTag (tag) {
    // Search internal passages
    return this.passages.filter((p) => {
      return p.tags.includes(tag);
    });
  }

  /**
   * Returns a Passage object by name from internal collection. If none exists, returns null.
   * The Twine editor prevents multiple passages from having the same name, so
   * this always returns the first search result.
   * @function getPassageByName
   * @param {string} name - name of the passage
   * @returns {Passage|null} Passage object or null
   */
  getPassageByName (name) {
    // Create default value
    let passage = null;

    // Search for any passages with the name
    const result = this.passages.filter((p) => p.name === name);

    // Were any found?
    if (result.length !== 0) {
      // Grab the first result.
      passage = result[0];
    }

    // Return either null or first result found.
    return passage;
  }

  /**
   * Replaces current passage shown to reader with rendered source of named passage.
   * If the named passage does not exist, an error is thrown.
   * @function show
   * @param {string} name name of the passage.
   */
  show (name) {
    // Look for passage by name.
    const passage = this.getPassageByName(name);

    // passage will be null if it was not found.
    if (passage === null) {
      // Passage was not found.
      // Throw error.
      throw new Error(`There is no passage with the name ${name}`);
    }

    // Set currentPassage to the one about to be shown.
    this.currentPassage = passage;

    // Overwrite current tags.
    this.domUtils.attr(this.passageElement, 'tags', passage.tags);

    // Get passage source by name.
    const passageSource = this.include(passage.name);

    // Overwrite any existing HTML.
    this.domUtils.html(this.passageElement, passageSource);

    // Listen for any reader clicking on `<tw-link>`.
    this.domUtils.on('tw-link[data-passage]', 'click', (event) => {
      // Retrieve data-passage value.
      const passageName = this.domUtils.attr(event.target, 'data-passage');
      // Add to the history.
      this.history.add(passageName);
      // Hide the redo icon.
      this.sidebar.hideRedo();
      // Show the undo icon.
      this.sidebar.showUndo();
      // Show the passage by name.
      this.show(passageName);
    });

    /**
     * Triggered when a passage is shown.
     * @event State#show
     * @type {string}
     */
    this.state.events.emit('show', passage.name);
  }

  /**
   * Returns the rendered source of a passage by name.
   * @function include
   * @param {string} name - name of the passage.
   * @returns {string} Rendered passage source.
   */
  include (name) {
    // Search for passage by name.
    const passage = this.getPassageByName(name);

    // Does this passage exist?
    if (passage === null) {
      // It does not exist.
      // Throw error.
      throw new Error('There is no passage with name ' + name);
    }

    // Get passage source.
    let passageSource = passage.source;

    // Run any script.
    passageSource = this.script.run(passageSource, this);

    // Parse any Markdown.
    passageSource = this.markdown.parse(passageSource);

    // Run the Markdown conversion.
    passageSource = this.markdown.convert(passageSource);

    // Return the passage source.
    return passageSource;
  }

  /**
   * Render a passage by name to a CSS selector.
   * @function renderPassageToSelector
   * @param {string} passageName - Name of passage to include.
   * @param {string} selector - CSS selector to use.
   */
  renderPassageToSelector (passageName, selector) {
    // Get passage source
    const passageSource = this.include(passageName);

    // Replace the HTML of the selector (if valid).
    this.domUtils.html(selector, passageSource);
  }

  /**
   * Add a new passage to the story.
   * @function addPassage
   * @param {string} name name
   * @param {Array} tags tags
   * @param {string} source source
   */
  addPassage (name = '', tags = [], source = '') {
    // Look for name.
    const nameSearch = this.getPassageByName(name);

    // Confirm name does not already exist.
    if (nameSearch !== null) {
      throw new Error('Cannot add two passages with the same name!');
    }

    // Confirm tags is an array.
    if (!Array.isArray(tags)) {
      // Ignore and set to empty array.
      tags = [];
    }

    // Confirm if source is string.
    if (Object.prototype.toString.call(source) !== '[object String]') {
      // Ignore and set to empty string.
      source = '';
    }

    // Add to the existing passages.
    this.passages.push(new Passage/* default */.A(
      name,
      tags,
      this.markdown.unescape(source)
    ));
  }

  /**
   * Remove a passage from the story internal collection.
   * Removing a passage and then attempting to visit the passage will
   * throw an error.
   *
   * Note: Does not affect HTML elements.
   * @function removePassage
   * @param {string} name name
   */
  removePassage (name = '') {
    this.passages = this.passages.filter(passage => {
      return passage.name !== name;
    });
  }

  /**
   * Go to an existing passage in the story. Unlike `Story.show()`, this will add to the history.
   *
   * Throws error if passage does not exist.
   * @function goto
   * @param {string} name name of passage
   */
  goto (name = '') {
    // Look for passage.
    const passage = this.getPassageByName(name);

    // Does passage exist?
    if (passage === null) {
      // Throw error.
      throw new Error(`There is no passage with the name ${name}`);
    }

    // Add to the history.
    this.history.add(name);

    // Hide the redo icon.
    this.sidebar.hideRedo();

    // Show the passage by name.
    this.show(name);
  }
}

/* harmony default export */ const src_Story = (Story);

;// ./src/index.js
// Require normalize.css.

// Require local CSS.

// Import Story.

// Require jQuery for end-user story scripts.

// Setup global jQuery for story creators.
globalThis.$ = (jquery_default());
globalThis.jQuery = (jquery_default());
// Create new Story instance.
globalThis.Story = new src_Story();
// Create global store shortcut.
globalThis.s = globalThis.Story.store;
// Start story.
globalThis.Story.start();


/***/ }),

/***/ 916:
/***/ (() => {

(function () {
// Create an element
  const test = document.createElement('p');
  test.innerHTML = 'Future toolbar area!';

  // Watch the body for the loading of CodeMirror
  const targetNode = document.querySelector('body');

  // Options for the observer (which mutations to observe)
  const config = { attributes: false, childList: true, subtree: true };

  // Create an observer instance linked to the callback function
  const observer = new MutationObserver(function (mutationList) {
    for (const mutation of mutationList) {
      const target = mutation.target;
      if (target.className === 'CodeMirror-code') {
        const el = document.querySelector('.passageTags');
        el.after(test);
        break;
      }
    }
  });

  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
})();


/***/ }),

/***/ 990:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
if (62 == __webpack_require__.j) {
	/* harmony import */ var _DOMUtils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(719);
}


class Screen {
  /**
   * Trigger screen-lock event.
   * @function lock
   */
  static lock () {
    // Append an element filling screen with CSS loading spinner.
    _DOMUtils_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.append(document.body, '<tw-screenlock><div class="loading"></div></tw-screenlock>');
  }

  /**
   * Trigger screen-unlock event.
   * @function unlock
   */
  static unlock () {
    // Remove tw-screenlock element, if there is one.
    _DOMUtils_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.remove('tw-screenlock');
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((/* runtime-dependent pure expression or super */ 62 == __webpack_require__.j ? (Screen) : null));


/***/ })

}]);