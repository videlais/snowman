// Import icons (using simple SVG strings for now)
const codeIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16,18 22,12 16,6"></polyline><polyline points="8,6 2,12 8,18"></polyline></svg>';
const textIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10,9 9,9 8,9"></polyline></svg>';
const headerIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12h12"></path><path d="M6 20V4"></path><path d="M18 20V4"></path></svg>';
const linkIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';
const variableIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>';

function iconSource(svgSource, color) {
  return `data:image/svg+xml;base64,${btoa(
    svgSource.replace(/currentColor/g, color)
  )}`;
}

export function toolbar(editor, { foregroundColor }) {
  const hasSelection = editor.getDoc().somethingSelected();

  return [
    {
      type: 'menu',
      icon: iconSource(textIcon, foregroundColor),
      label: 'Style',
      items: [
        {
          type: 'button',
          label: 'Bold',
          command: 'boldText',
          disabled: !hasSelection
        },
        {
          type: 'button',
          label: 'Italic',
          command: 'italicText',
          disabled: !hasSelection
        },
        {
          type: 'button',
          label: 'Underline',
          command: 'underlineText',
          disabled: !hasSelection
        },
        { type: 'separator' },
        {
          type: 'button',
          label: 'Comment',
          command: 'insertComment',
          disabled: hasSelection
        }
      ]
    },
    {
      type: 'menu',
      icon: iconSource(headerIcon, foregroundColor),
      label: 'Headers',
      items: [
        {
          type: 'button',
          label: 'Header 1',
          command: 'header1',
          disabled: !hasSelection
        },
        {
          type: 'button',
          label: 'Header 2',
          command: 'header2',
          disabled: !hasSelection
        },
        {
          type: 'button',
          label: 'Header 3',
          command: 'header3',
          disabled: !hasSelection
        },
        {
          type: 'button',
          label: 'Header 4',
          command: 'header4',
          disabled: !hasSelection
        },
        {
          type: 'button',
          label: 'Header 5',
          command: 'header5',
          disabled: !hasSelection
        }
      ]
    },
    {
      type: 'menu',
      icon: iconSource(codeIcon, foregroundColor),
      label: 'Snowman Code',
      disabled: hasSelection,
      items: [
        {
          type: 'button',
          label: 'JavaScript Block',
          command: 'insertJavaScriptBlock'
        },
        {
          type: 'button',
          label: 'JavaScript Expression',
          command: 'insertJavaScriptExpression'
        },
        {
          type: 'button',
          label: 'JavaScript Comment',
          command: 'insertJSComment'
        },
        { type: 'separator' },
        {
          type: 'button',
          label: 'If Statement',
          command: 'insertConditional'
        },
        {
          type: 'button',
          label: 'If/Else Statement',
          command: 'insertConditionalElse'
        },
        {
          type: 'button',
          label: 'For Loop',
          command: 'insertLoop'
        },
        { type: 'separator' },
        {
          type: 'button',
          label: 'Style Block',
          command: 'insertStyleBlock'
        },
        {
          type: 'button',
          label: 'CSS Class',
          command: 'insertCSSClass'
        }
      ]
    },
    {
      type: 'menu',
      icon: iconSource(variableIcon, foregroundColor),
      label: 'Variables',
      disabled: hasSelection,
      items: [
        {
          type: 'button',
          label: 'Set Variable',
          command: 'insertVariableSet'
        },
        {
          type: 'button',
          label: 'Get Variable',
          command: 'insertVariableGet'
        },
        {
          type: 'button',
          label: 'Increment Variable',
          command: 'insertVariableIncrement'
        },
        { type: 'separator' },
        {
          type: 'button',
          label: 'Random Choice',
          command: 'insertRandomChoice'
        },
        {
          type: 'button',
          label: 'Current Date',
          command: 'insertCurrentDate'
        },
        {
          type: 'button',
          label: 'Current Time',
          command: 'insertCurrentTime'
        }
      ]
    },
    {
      type: 'menu',
      icon: iconSource(linkIcon, foregroundColor),
      label: 'Story',
      disabled: hasSelection,
      items: [
        {
          type: 'button',
          label: 'Passage Link',
          command: 'insertPassageLink'
        },
        {
          type: 'button',
          label: 'Conditional Link',
          command: 'insertConditionalLink'
        },
        { type: 'separator' },
        {
          type: 'button',
          label: 'Render Passage',
          command: 'insertStoryRender'
        },
        {
          type: 'button',
          label: 'Go To Passage',
          command: 'insertStoryGoTo'
        },
        {
          type: 'button',
          label: 'Start Story',
          command: 'insertStoryStart'
        },
        { type: 'separator' },
        {
          type: 'button',
          label: 'Div Element',
          command: 'insertDiv'
        },
        {
          type: 'button',
          label: 'Span Element',
          command: 'insertSpan'
        },
        {
          type: 'button',
          label: 'Paragraph',
          command: 'insertParagraph'
        }
      ]
    }
  ];
}