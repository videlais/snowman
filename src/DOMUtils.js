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

export default DOMUtils;