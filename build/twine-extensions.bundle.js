/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["SnowmanExtensions"] = factory();
	else
		root["SnowmanExtensions"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/twine-extensions/codemirror-commands.js":
/*!*****************************************************!*\
  !*** ./src/twine-extensions/codemirror-commands.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   commands: () => (/* binding */ commands)\n/* harmony export */ });\nfunction makeInsertTextCommands(commandMap) {\n  const result = {};\n  \n  for (const commandName of Object.keys(commandMap)) {\n    result[commandName] = (editor) => {\n      editor.replaceSelection(commandMap[commandName]);\n      editor.focus();\n    };\n  }\n  \n  return result;\n}\n\nfunction makeWrapTextCommands(commandMap) {\n  const result = {};\n  \n  for (const commandName of Object.keys(commandMap)) {\n    const { matcher, wrapper } = commandMap[commandName];\n    \n    result[commandName] = (editor) => {\n      const selections = editor.getSelections();\n      const newSelections = selections.map(selection => {\n        if (matcher.test(selection)) {\n          return selection.replace(matcher, '$1');\n        } else {\n          return wrapper(selection);\n        }\n      });\n      \n      editor.replaceSelections(newSelections, 'around');\n      editor.focus();\n    };\n  }\n  \n  return result;\n}\n\nconst commands = {\n  // Text wrapping commands\n  ...makeWrapTextCommands({\n    boldText: {\n      matcher: /^<strong>(.*)<\\/strong>$/,\n      wrapper: (text) => `<strong>${text}</strong>`\n    },\n    italicText: {\n      matcher: /^<em>(.*)<\\/em>$/,\n      wrapper: (text) => `<em>${text}</em>`\n    },\n    underlineText: {\n      matcher: /^<u>(.*)<\\/u>$/,\n      wrapper: (text) => `<u>${text}</u>`\n    },\n    // Header commands\n    header1: {\n      matcher: /^# (.*)$/,\n      wrapper: (text) => `# ${text}`\n    },\n    header2: {\n      matcher: /^## (.*)$/,\n      wrapper: (text) => `## ${text}`\n    },\n    header3: {\n      matcher: /^### (.*)$/,\n      wrapper: (text) => `### ${text}`\n    },\n    header4: {\n      matcher: /^#### (.*)$/,\n      wrapper: (text) => `#### ${text}`\n    },\n    header5: {\n      matcher: /^##### (.*)$/,\n      wrapper: (text) => `##### ${text}`\n    }\n  }),\n\n  // Snowman-specific insertion commands\n  ...makeInsertTextCommands({\n    // JavaScript blocks\n    insertJavaScriptBlock: '<%  %>',\n    insertJavaScriptExpression: '<%= %>',\n    \n    // Story functions\n    insertStoryRender: \"<% window.Story.render('passage-name') %>\",\n    insertStoryGoTo: \"<% window.Story.goTo('passage-name') %>\",\n    insertStoryStart: '<% window.Story.start() %>',\n    \n    // Common Snowman patterns\n    insertConditional: '<% if (condition) { %>\\n\\n<% } %>',\n    insertConditionalElse: '<% if (condition) { %>\\n\\n<% } else { %>\\n\\n<% } %>',\n    insertLoop: '<% for (let i = 0; i < array.length; i++) { %>\\n\\n<% } %>',\n    \n    // Variable operations\n    insertVariableSet: '<% s.variableName = value %>',\n    insertVariableGet: '<%= s.variableName %>',\n    insertVariableIncrement: '<% s.variableName++ %>',\n    \n    // Links\n    insertPassageLink: \"[[Link Text->Passage Name]]\",\n    insertConditionalLink: '<% if (condition) { %>[[Link Text->Passage Name]]<% } %>',\n    \n    // HTML elements\n    insertDiv: '<div class=\"\">\\n\\n</div>',\n    insertSpan: '<span class=\"\"></span>',\n    insertParagraph: '<p></p>',\n    \n    // CSS\n    insertStyleBlock: '<style>\\n\\n</style>',\n    insertCSSClass: '.class-name {\\n  \\n}',\n    \n    // Comments\n    insertComment: '<!-- Comment -->',\n    insertJSComment: '<% // Comment %>',\n    \n    // Common Snowman utilities\n    insertRandomChoice: '<%= [\"option1\", \"option2\", \"option3\"][Math.floor(Math.random() * 3)] %>',\n    insertCurrentDate: '<%= new Date().toLocaleDateString() %>',\n    insertCurrentTime: '<%= new Date().toLocaleTimeString() %>',\n    \n    // Utilities class methods\n    insertDelay: '<% Utilities.delay(() => { /* code */ }, 1000) %>',\n    insertEither: '<%= Utilities.either(\"option1\", \"option2\", \"option3\") %>',\n    insertRandomInt: '<%= Utilities.randomInt(1, 10) %>',\n    insertRandomFloat: '<%= Utilities.randomFloat(0, 1) %>'\n  })\n};\n\n//# sourceURL=webpack://SnowmanExtensions/./src/twine-extensions/codemirror-commands.js?\n}");

/***/ }),

/***/ "./src/twine-extensions/codemirror-mode.js":
/*!*************************************************!*\
  !*** ./src/twine-extensions/codemirror-mode.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   mode: () => (/* binding */ mode)\n/* harmony export */ });\nfunction mode() {\n  return {\n    startState() {\n      return {\n        inScriptBlock: false,\n        inStyleBlock: false,\n        scriptNesting: 0\n      };\n    },\n\n    token(stream, state) {\n      // Handle Snowman's JavaScript blocks: <%...%>\n      if (stream.match(/^<%/)) {\n        state.inScriptBlock = true;\n        state.scriptNesting = 1;\n        return 'keyword';\n      }\n\n      if (state.inScriptBlock) {\n        // Handle nested <% blocks\n        if (stream.match(/^<%/)) {\n          state.scriptNesting++;\n          return 'keyword';\n        }\n        \n        // Handle closing %>\n        if (stream.match(/^%>/)) {\n          state.scriptNesting--;\n          if (state.scriptNesting === 0) {\n            state.inScriptBlock = false;\n          }\n          return 'keyword';\n        }\n\n        // Inside JavaScript block - highlight as JavaScript\n        if (stream.match(/^\\/\\/.*$/)) {\n          return 'comment';\n        }\n        \n        if (stream.match(/^\\/\\*[\\s\\S]*?\\*\\//)) {\n          return 'comment';\n        }\n\n        if (stream.match(/^(var|let|const|function|if|else|for|while|return|new|this|window|document)\\b/)) {\n          return 'keyword';\n        }\n\n        if (stream.match(/^(true|false|null|undefined)\\b/)) {\n          return 'atom';\n        }\n\n        if (stream.match(/^\"([^\"\\\\]|\\\\.)*\"/)) {\n          return 'string';\n        }\n\n        if (stream.match(/^'([^'\\\\]|\\\\.)*'/)) {\n          return 'string';\n        }\n\n        if (stream.match(/^`([^`\\\\]|\\\\.)*`/)) {\n          return 'string';\n        }\n\n        if (stream.match(/^\\d+(\\.\\d+)?/)) {\n          return 'number';\n        }\n\n        // Default JavaScript token\n        stream.next();\n        return 'variable';\n      }\n\n      // Handle HTML-style comments\n      if (stream.match(/^<!--[\\s\\S]*?-->/)) {\n        return 'comment';\n      }\n\n      // Handle Twine links [[...]]\n      if (stream.match(/^\\[\\[[^\\]]+?\\]\\]/)) {\n        return 'link';\n      }\n\n      // Handle HTML tags\n      if (stream.match(/^<\\/?[a-zA-Z][^>]*>/)) {\n        return 'tag';\n      }\n\n      // Handle CSS in <style> blocks\n      if (stream.match(/^<style[^>]*>/)) {\n        state.inStyleBlock = true;\n        return 'tag';\n      }\n\n      if (state.inStyleBlock) {\n        if (stream.match(/^<\\/style>/)) {\n          state.inStyleBlock = false;\n          return 'tag';\n        }\n        \n        // Basic CSS highlighting\n        if (stream.match(/^[a-zA-Z-]+(?=\\s*:)/)) {\n          return 'property';\n        }\n        \n        if (stream.match(/^[^;{}]+/)) {\n          return 'string';\n        }\n      }\n\n      // Default text\n      if (stream.eatWhile(/[^<[%]/)) {\n        return 'text';\n      }\n\n      stream.next();\n      return 'text';\n    }\n  };\n}\n\n//# sourceURL=webpack://SnowmanExtensions/./src/twine-extensions/codemirror-mode.js?\n}");

/***/ }),

/***/ "./src/twine-extensions/codemirror-toolbar.js":
/*!****************************************************!*\
  !*** ./src/twine-extensions/codemirror-toolbar.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   toolbar: () => (/* binding */ toolbar)\n/* harmony export */ });\n// Import icons (using simple SVG strings for now)\nconst codeIcon = '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"16,18 22,12 16,6\"></polyline><polyline points=\"8,6 2,12 8,18\"></polyline></svg>';\nconst textIcon = '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2-2V8z\"></path><polyline points=\"14,2 14,8 20,8\"></polyline><line x1=\"16\" y1=\"13\" x2=\"8\" y2=\"13\"></line><line x1=\"16\" y1=\"17\" x2=\"8\" y2=\"17\"></line><polyline points=\"10,9 9,9 8,9\"></polyline></svg>';\nconst headerIcon = '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M6 12h12\"></path><path d=\"M6 20V4\"></path><path d=\"M18 20V4\"></path></svg>';\nconst linkIcon = '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\"></path><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\"></path></svg>';\nconst variableIcon = '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"2\" y=\"3\" width=\"20\" height=\"14\" rx=\"2\" ry=\"2\"></rect><line x1=\"8\" y1=\"21\" x2=\"16\" y2=\"21\"></line><line x1=\"12\" y1=\"17\" x2=\"12\" y2=\"21\"></line></svg>';\nconst utilityIcon = '<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 20h9\"></path><path d=\"M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z\"></path></svg>';\n\nfunction iconSource(svgSource, color) {\n  return `data:image/svg+xml;base64,${btoa(\n    svgSource.replaceAll('currentColor', color)\n  )}`;\n}\n\nfunction toolbar(editor, { foregroundColor }) {\n  const hasSelection = editor.getDoc().somethingSelected();\n\n  return [\n    {\n      type: 'menu',\n      icon: iconSource(textIcon, foregroundColor),\n      label: 'Style',\n      items: [\n        {\n          type: 'button',\n          label: 'Bold',\n          command: 'boldText',\n          disabled: !hasSelection\n        },\n        {\n          type: 'button',\n          label: 'Italic',\n          command: 'italicText',\n          disabled: !hasSelection\n        },\n        {\n          type: 'button',\n          label: 'Underline',\n          command: 'underlineText',\n          disabled: !hasSelection\n        },\n        { type: 'separator' },\n        {\n          type: 'button',\n          label: 'Comment',\n          command: 'insertComment',\n          disabled: hasSelection\n        }\n      ]\n    },\n    {\n      type: 'menu',\n      icon: iconSource(headerIcon, foregroundColor),\n      label: 'Headers',\n      items: [\n        {\n          type: 'button',\n          label: 'Header 1',\n          command: 'header1',\n          disabled: !hasSelection\n        },\n        {\n          type: 'button',\n          label: 'Header 2',\n          command: 'header2',\n          disabled: !hasSelection\n        },\n        {\n          type: 'button',\n          label: 'Header 3',\n          command: 'header3',\n          disabled: !hasSelection\n        },\n        {\n          type: 'button',\n          label: 'Header 4',\n          command: 'header4',\n          disabled: !hasSelection\n        },\n        {\n          type: 'button',\n          label: 'Header 5',\n          command: 'header5',\n          disabled: !hasSelection\n        }\n      ]\n    },\n    {\n      type: 'menu',\n      icon: iconSource(codeIcon, foregroundColor),\n      label: 'Snowman Code',\n      disabled: hasSelection,\n      items: [\n        {\n          type: 'button',\n          label: 'JavaScript Block',\n          command: 'insertJavaScriptBlock'\n        },\n        {\n          type: 'button',\n          label: 'JavaScript Expression',\n          command: 'insertJavaScriptExpression'\n        },\n        {\n          type: 'button',\n          label: 'JavaScript Comment',\n          command: 'insertJSComment'\n        },\n        { type: 'separator' },\n        {\n          type: 'button',\n          label: 'If Statement',\n          command: 'insertConditional'\n        },\n        {\n          type: 'button',\n          label: 'If/Else Statement',\n          command: 'insertConditionalElse'\n        },\n        {\n          type: 'button',\n          label: 'For Loop',\n          command: 'insertLoop'\n        },\n        { type: 'separator' },\n        {\n          type: 'button',\n          label: 'Style Block',\n          command: 'insertStyleBlock'\n        },\n        {\n          type: 'button',\n          label: 'CSS Class',\n          command: 'insertCSSClass'\n        }\n      ]\n    },\n    {\n      type: 'menu',\n      icon: iconSource(variableIcon, foregroundColor),\n      label: 'Variables',\n      disabled: hasSelection,\n      items: [\n        {\n          type: 'button',\n          label: 'Set Variable',\n          command: 'insertVariableSet'\n        },\n        {\n          type: 'button',\n          label: 'Get Variable',\n          command: 'insertVariableGet'\n        },\n        {\n          type: 'button',\n          label: 'Increment Variable',\n          command: 'insertVariableIncrement'\n        },\n        { type: 'separator' },\n        {\n          type: 'button',\n          label: 'Random Choice',\n          command: 'insertRandomChoice'\n        },\n        {\n          type: 'button',\n          label: 'Current Date',\n          command: 'insertCurrentDate'\n        },\n        {\n          type: 'button',\n          label: 'Current Time',\n          command: 'insertCurrentTime'\n        }\n      ]\n    },\n    {\n      type: 'menu',\n      icon: iconSource(linkIcon, foregroundColor),\n      label: 'Story',\n      disabled: hasSelection,\n      items: [\n        {\n          type: 'button',\n          label: 'Passage Link',\n          command: 'insertPassageLink'\n        },\n        {\n          type: 'button',\n          label: 'Conditional Link',\n          command: 'insertConditionalLink'\n        },\n        { type: 'separator' },\n        {\n          type: 'button',\n          label: 'Render Passage',\n          command: 'insertStoryRender'\n        },\n        {\n          type: 'button',\n          label: 'Go To Passage',\n          command: 'insertStoryGoTo'\n        },\n        {\n          type: 'button',\n          label: 'Start Story',\n          command: 'insertStoryStart'\n        },\n        { type: 'separator' },\n        {\n          type: 'button',\n          label: 'Div Element',\n          command: 'insertDiv'\n        },\n        {\n          type: 'button',\n          label: 'Span Element',\n          command: 'insertSpan'\n        },\n        {\n          type: 'button',\n          label: 'Paragraph',\n          command: 'insertParagraph'\n        }\n      ]\n    },\n    {\n      type: 'menu',\n      icon: iconSource(utilityIcon, foregroundColor),\n      label: 'Utilities',\n      disabled: hasSelection,\n      items: [\n        {\n          type: 'button',\n          label: 'Delay Function',\n          command: 'insertDelay'\n        },\n        {\n          type: 'button',\n          label: 'Random Choice (either)',\n          command: 'insertEither'\n        },\n        {\n          type: 'button',\n          label: 'Random Integer',\n          command: 'insertRandomInt'\n        },\n        {\n          type: 'button',\n          label: 'Random Float',\n          command: 'insertRandomFloat'\n        }\n      ]\n    }\n  ];\n}\n\n//# sourceURL=webpack://SnowmanExtensions/./src/twine-extensions/codemirror-toolbar.js?\n}");

/***/ }),

/***/ "./src/twine-extensions/index.js":
/*!***************************************!*\
  !*** ./src/twine-extensions/index.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   commands: () => (/* reexport safe */ _codemirror_commands__WEBPACK_IMPORTED_MODULE_1__.commands),\n/* harmony export */   mode: () => (/* reexport safe */ _codemirror_mode__WEBPACK_IMPORTED_MODULE_0__.mode),\n/* harmony export */   parsePassageText: () => (/* reexport safe */ _parse_references__WEBPACK_IMPORTED_MODULE_3__.parsePassageText),\n/* harmony export */   toolbar: () => (/* reexport safe */ _codemirror_toolbar__WEBPACK_IMPORTED_MODULE_2__.toolbar)\n/* harmony export */ });\n/* harmony import */ var _codemirror_mode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./codemirror-mode */ \"./src/twine-extensions/codemirror-mode.js\");\n/* harmony import */ var _codemirror_commands__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./codemirror-commands */ \"./src/twine-extensions/codemirror-commands.js\");\n/* harmony import */ var _codemirror_toolbar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./codemirror-toolbar */ \"./src/twine-extensions/codemirror-toolbar.js\");\n/* harmony import */ var _parse_references__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./parse-references */ \"./src/twine-extensions/parse-references.js\");\n// Export the components for Twine integration using export...from pattern\n\n\n\n\n\n//# sourceURL=webpack://SnowmanExtensions/./src/twine-extensions/index.js?\n}");

/***/ }),

/***/ "./src/twine-extensions/parse-references.js":
/*!**************************************************!*\
  !*** ./src/twine-extensions/parse-references.js ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   parsePassageText: () => (/* binding */ parsePassageText)\n/* harmony export */ });\nfunction parsePassageText(text) {\n  const matchers = [\n    // Twine links: [[Link Text->Passage Name]] or [[Passage Name]]\n    /\\[\\[(?:[^\\]]+->)?([^\\]]+)\\]\\]/g,\n    \n    // Snowman Story.render calls: window.Story.render('passage-name')\n    /window\\.Story\\.render\\(\\s*['\"`]([^'\"`]+)['\"`]\\s*\\)/g,\n    \n    // Snowman Story.goTo calls: window.Story.goTo('passage-name')  \n    /window\\.Story\\.goTo\\(\\s*['\"`]([^'\"`]+)['\"`]\\s*\\)/g,\n    \n    // Story.render calls without window: Story.render('passage-name')\n    /Story\\.render\\(\\s*['\"`]([^'\"`]+)['\"`]\\s*\\)/g,\n    \n    // Story.goTo calls without window: Story.goTo('passage-name')\n    /Story\\.goTo\\(\\s*['\"`]([^'\"`]+)['\"`]\\s*\\)/g,\n    \n    // jQuery passage references: $('tw-passage[name=\"passage-name\"]')\n    /\\$\\(\\s*['\"`]tw-passage\\[name\\s*=\\s*['\"`]([^'\"`]+)['\"`]\\][^'\"`]*['\"`]\\s*\\)/g\n  ];\n\n  const results = [];\n  const uniquePassages = new Set();\n\n  for (const matcher of matchers) {\n    let match;\n    matcher.lastIndex = 0; // Reset regex state\n    \n    while ((match = matcher.exec(text))) {\n      const passageName = match[1];\n      if (passageName && !uniquePassages.has(passageName)) {\n        uniquePassages.add(passageName);\n        results.push(passageName);\n      }\n    }\n  }\n\n  return results;\n}\n\n//# sourceURL=webpack://SnowmanExtensions/./src/twine-extensions/parse-references.js?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/twine-extensions/index.js");
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});