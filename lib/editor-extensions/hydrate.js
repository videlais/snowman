// Twine 2.4+ editor extensions for Snowman.
// This file is embedded as the story format `hydrate` property.

const ICON_STYLES = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" d="M2 3h12v2H9v8H7V5H2z"/></svg>';
const ICON_CHECK = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" d="M6.2 11.3 3.4 8.5l1.1-1.1 1.7 1.7 5.3-5.3 1.1 1.1z"/></svg>';

function wrapSelection(editor, left, right) {
  const doc = editor.getDoc();
  const selection = doc.getSelection();
  doc.replaceSelection(left + selection + right, 'around');
  editor.focus();
}

function toggleHeader(editor, prefix) {
  const doc = editor.getDoc();
  const from = doc.getCursor('from');
  const to = doc.getCursor('to');
  const startLine = from.line;
  const endLine = to.line;

  let allHavePrefix = true;
  for (let line = startLine; line <= endLine; line++) {
    if (!doc.getLine(line).startsWith(prefix)) {
      allHavePrefix = false;
      break;
    }
  }

  for (let line = startLine; line <= endLine; line++) {
    const current = doc.getLine(line);
    if (allHavePrefix) {
      doc.replaceRange(current.replace(prefix, ''), { line, ch: 0 }, { line, ch: current.length });
    } else {
      doc.replaceRange(prefix + current, { line, ch: 0 }, { line, ch: current.length });
    }
  }

  editor.focus();
}

function findSyntaxIssues(text) {
  const issues = [];

  const templateStack = [];
  for (let i = 0; i < text.length; i++) {
    if (text.startsWith('<%', i)) {
      templateStack.push(i);
      i += 1;
      continue;
    }

    if (text.startsWith('%>', i)) {
      if (templateStack.length === 0) {
        issues.push('Unmatched %> at character ' + i + '.');
      } else {
        templateStack.pop();
      }
      i += 1;
    }
  }

  for (const pos of templateStack) {
    issues.push('Unclosed <% block starting at character ' + pos + '.');
  }

  const linkStack = [];
  for (let i = 0; i < text.length; i++) {
    if (text.startsWith('[[', i)) {
      linkStack.push(i);
      i += 1;
      continue;
    }

    if (text.startsWith(']]', i)) {
      if (linkStack.length === 0) {
        issues.push('Unmatched ]] at character ' + i + '.');
      } else {
        linkStack.pop();
      }
      i += 1;
    }
  }

  for (const pos of linkStack) {
    issues.push('Unclosed [[ link starting at character ' + pos + '.');
  }

  return issues;
}

this.editorExtensions = {
  twine: {
    '^2.4.0-alpha1': {
      codeMirror: {
        commands: {
          smEmphasis(editor) {
            wrapSelection(editor, '*', '*');
          },

          smStrong(editor) {
            wrapSelection(editor, '**', '**');
          },

          smHeader1(editor) {
            toggleHeader(editor, '# ');
          },

          smHeader2(editor) {
            toggleHeader(editor, '## ');
          },

          smCheckSyntax(editor) {
            const text = editor.getValue();
            const issues = findSyntaxIssues(text);

            if (issues.length === 0) {
              window.alert('Snowman syntax check: no obvious delimiter issues found.');
              return;
            }

            const lines = issues.slice(0, 8).join('\n- ');
            const summary = 'Snowman syntax check found ' + issues.length + ' issue(s):\n- ' + lines;
            window.alert(summary);
            console.warn(summary);
          }
        },

        toolbar() {
          return [
            {
              type: 'menu',
              icon: ICON_STYLES,
              label: 'Styles',
              items: [
                {
                  type: 'button',
                  command: 'smEmphasis',
                  label: 'Emphasis (*...*)'
                },
                {
                  type: 'button',
                  command: 'smStrong',
                  label: 'Strong (**...**)'
                },
                {
                  type: 'separator'
                },
                {
                  type: 'button',
                  command: 'smHeader1',
                  label: 'Header 1 (# )'
                },
                {
                  type: 'button',
                  command: 'smHeader2',
                  label: 'Header 2 (## )'
                }
              ]
            },
            {
              type: 'button',
              command: 'smCheckSyntax',
              icon: ICON_CHECK,
              label: 'Check Syntax'
            }
          ];
        },

        mode() {
          const jsKeywords = /^(?:if|else|for|while|do|switch|case|break|continue|return|const|let|var|function|class|new|this|true|false|null|undefined|try|catch|finally|throw|typeof|instanceof|in|of|await|async)\b/;

          return {
            startState() {
              return {
                inTemplate: false,
                inTwineLink: false
              };
            },

            token(stream, state) {
              if (state.inTwineLink) {
                if (stream.match(']]')) {
                  state.inTwineLink = false;
                  return 'link';
                }

                stream.next();
                stream.eatWhile(ch => ch !== ']');
                return 'link';
              }

              if (state.inTemplate) {
                if (stream.match('%>')) {
                  state.inTemplate = false;
                  return 'keyword';
                }

                if (stream.match(/\/\/.*$/)) {
                  return 'comment';
                }

                if (stream.match(/\/\*[^]*?\*\//)) {
                  return 'comment';
                }

                if (stream.match(/"(?:[^"\\]|\\.)*"/)) {
                  return 'string';
                }

                if (stream.match(/'(?:[^'\\]|\\.)*'/)) {
                  return 'string';
                }

                if (stream.match(/`(?:[^`\\]|\\.)*`/)) {
                  return 'string';
                }

                if (stream.match(jsKeywords)) {
                  return 'keyword';
                }

                if (stream.match(/^-?\d+(?:\.\d+)?/)) {
                  return 'number';
                }

                if (stream.match(/^[A-Za-z_$][\w$]*/)) {
                  return 'variable';
                }

                stream.next();
                return null;
              }

              if (stream.match('[[')) {
                state.inTwineLink = true;
                return 'link';
              }

              if (stream.match('<%=') || stream.match('<%-') || stream.match('<%')) {
                state.inTemplate = true;
                return 'keyword';
              }

              stream.next();
              return null;
            }
          };
        }
      }
    }
  }
};
