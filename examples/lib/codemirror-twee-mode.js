/**
 * CodeMirror mode for Twee notation syntax highlighting
 * Provides syntax highlighting for Snowman Twee files
 */

(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
        mod(require("../../lib/codemirror"));
    else if (typeof define == "function" && define.amd) // AMD
        define(["../../lib/codemirror"], mod);
    else // Plain browser env
        mod(CodeMirror);
})(function(CodeMirror) {
    "use strict";

    CodeMirror.defineMode("twee", function(config, parserConfig) {
        // We implement our own simple JavaScript-like highlighting
        // instead of trying to integrate the complex JavaScript mode

        function inText(stream, state) {
            function chain(parser) {
                state.tokenize = parser;
                return parser(stream, state);
            }

            var ch = stream.next();

            // Passage headers (:: PassageName [tags])
            if (stream.sol() && ch === ':' && stream.peek() === ':') {
                stream.next(); // consume second ':'
                stream.eatSpace();
                return "header";
            }

            // Template tags
            if (ch === '<' && stream.peek() === '%') {
                stream.next(); // consume '%'
                
                // Check for different template tag types
                var next = stream.peek();
                if (next === '=') {
                    stream.next(); // consume '='
                    return chain(inJavaScriptInterpolation);
                } else if (next === '-') {
                    stream.next(); // consume '-'
                    return chain(inJavaScriptEscaped);
                } else {
                    return chain(inJavaScript);
                }
            }

            // Twine links [[text->target]] or [[target]]
            if (ch === '[' && stream.peek() === '[') {
                stream.next(); // consume second '['
                return chain(inLink);
            }

            // Markdown-style headers
            if (stream.sol() && ch === '#') {
                stream.eatWhile(/[#]/);
                stream.eatSpace();
                stream.skipToEnd();
                return "header";
            }

            // Bold **text**
            if (ch === '*' && stream.peek() === '*') {
                stream.next(); // consume second '*'
                return chain(inBold);
            }

            // Italic *text*
            if (ch === '*') {
                return chain(inItalic);
            }

            // Regular text
            return null;
        }

        function inJavaScript(stream, state) {
            var ch = stream.next();
            if (ch === '%' && stream.peek() === '>') {
                stream.next(); // consume '>'
                state.tokenize = inText;
                return "keyword";
            }
            
            // Simple JavaScript-like highlighting without full mode integration
            stream.backUp(1);
            
            // Keywords
            if (stream.match(/\b(var|let|const|if|else|for|while|function|return|true|false|null|undefined)\b/)) {
                return "keyword";
            }
            
            // Strings
            if (stream.match(/^"([^"\\]|\\.)*"/)) {
                return "string";
            }
            if (stream.match(/^'([^'\\]|\\.)*'/)) {
                return "string";
            }
            if (stream.match(/^`([^`\\]|\\.)*`/)) {
                return "string";
            }
            
            // Numbers
            if (stream.match(/^\d+(\.\d+)?/)) {
                return "number";
            }
            
            // Comments
            if (stream.match(/^\/\/.*$/)) {
                return "comment";
            }
            if (stream.match(/^\/\*[\s\S]*?\*\//)) {
                return "comment";
            }
            
            // Operators
            if (stream.match(/^(\+|\-|\*|\/|=|<|>|!|&|\|)/)) {
                return "operator";
            }
            
            // Default: consume one character
            stream.next();
            return "variable";
        }

        function inJavaScriptInterpolation(stream, state) {
            var ch = stream.next();
            if (ch === '%' && stream.peek() === '>') {
                stream.next(); // consume '>'
                state.tokenize = inText;
                return "keyword";
            }
            
            // Reuse the same logic as inJavaScript
            stream.backUp(1);
            return inJavaScript(stream, state);
        }

        function inJavaScriptEscaped(stream, state) {
            var ch = stream.next();
            if (ch === '%' && stream.peek() === '>') {
                stream.next(); // consume '>'
                state.tokenize = inText;
                return "keyword";
            }
            
            // Reuse the same logic as inJavaScript
            stream.backUp(1);
            return inJavaScript(stream, state);
        }

        function inLink(stream, state) {
            var ch = stream.next();
            if (ch === ']' && stream.peek() === ']') {
                stream.next(); // consume second ']'
                state.tokenize = inText;
                return "link";
            }
            if (ch === '-' && stream.peek() === '>') {
                stream.next(); // consume '>'
                return "operator";
            }
            return "link";
        }

        function inBold(stream, state) {
            var ch = stream.next();
            if (ch === '*' && stream.peek() === '*') {
                stream.next(); // consume second '*'
                state.tokenize = inText;
                return "strong";
            }
            return "strong";
        }

        function inItalic(stream, state) {
            var ch = stream.next();
            if (ch === '*') {
                state.tokenize = inText;
                return "em";
            }
            return "em";
        }

        return {
            startState: function() {
                return {
                    tokenize: inText,
                    context: null
                };
            },

            token: function(stream, state) {
                if (stream.eatSpace()) return null;
                var style = state.tokenize(stream, state);
                return style;
            },

            electricChars: ">}",

            fold: "brace",

            closeBrackets: "()[]{}''\"\"``"
        };
    });

    CodeMirror.defineMIME("text/twee", "twee");
    CodeMirror.defineMIME("text/x-twee", "twee");
});

// Add custom CSS for Twee syntax highlighting
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        .cm-header {
            color: #d73a49;
            font-weight: bold;
        }
        
        .cm-link {
            color: #0366d6;
            text-decoration: underline;
        }
        
        .cm-operator {
            color: #d73a49;
            font-weight: bold;
        }
        
        .cm-strong {
            font-weight: bold;
            color: #24292e;
        }
        
        .cm-em {
            font-style: italic;
            color: #6f42c1;
        }
        
        .cm-keyword {
            color: #d73a49;
            font-weight: bold;
        }
        
        /* Template tag styling */
        .cm-template-tag {
            background-color: #f6f8fa;
            border: 1px solid #e1e4e8;
            border-radius: 3px;
            padding: 0 2px;
        }
    `;
    document.head.appendChild(style);
}