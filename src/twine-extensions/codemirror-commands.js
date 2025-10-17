function makeInsertTextCommands(commandMap) {
  const result = {};
  
  Object.keys(commandMap).forEach(commandName => {
    result[commandName] = (editor) => {
      editor.replaceSelection(commandMap[commandName]);
      editor.focus();
    };
  });
  
  return result;
}

function makeWrapTextCommands(commandMap) {
  const result = {};
  
  Object.keys(commandMap).forEach(commandName => {
    const { matcher, wrapper } = commandMap[commandName];
    
    result[commandName] = (editor) => {
      const selections = editor.getSelections();
      const newSelections = selections.map(selection => {
        if (matcher.test(selection)) {
          return selection.replace(matcher, '$1');
        } else {
          return wrapper(selection);
        }
      });
      
      editor.replaceSelections(newSelections, 'around');
      editor.focus();
    };
  });
  
  return result;
}

export const commands = {
  // Text wrapping commands
  ...makeWrapTextCommands({
    boldText: {
      matcher: /^\*\*(.*)\*\*$/,
      wrapper: (text) => `**${text}**`
    },
    italicText: {
      matcher: /^\*(.*)\*$/,
      wrapper: (text) => `*${text}*`
    },
    underlineText: {
      matcher: /^<u>(.*)<\/u>$/,
      wrapper: (text) => `<u>${text}</u>`
    }
  }),

  // Snowman-specific insertion commands
  ...makeInsertTextCommands({
    // JavaScript blocks
    insertJavaScriptBlock: '<%  %>',
    insertJavaScriptExpression: '<%= %>',
    
    // Story functions
    insertStoryRender: "<% window.Story.render('passage-name') %>",
    insertStoryGoTo: "<% window.Story.goTo('passage-name') %>",
    insertStoryStart: '<% window.Story.start() %>',
    
    // Common Snowman patterns
    insertConditional: '<% if (condition) { %>\n\n<% } %>',
    insertConditionalElse: '<% if (condition) { %>\n\n<% } else { %>\n\n<% } %>',
    insertLoop: '<% for (let i = 0; i < array.length; i++) { %>\n\n<% } %>',
    
    // Variable operations
    insertVariableSet: '<% s.variableName = value %>',
    insertVariableGet: '<%= s.variableName %>',
    insertVariableIncrement: '<% s.variableName++ %>',
    
    // Links
    insertPassageLink: "[[Link Text->Passage Name]]",
    insertConditionalLink: '<% if (condition) { %>[[Link Text->Passage Name]]<% } %>',
    
    // HTML elements
    insertDiv: '<div class="">\n\n</div>',
    insertSpan: '<span class=""></span>',
    insertParagraph: '<p></p>',
    
    // CSS
    insertStyleBlock: '<style>\n\n</style>',
    insertCSSClass: '.class-name {\n  \n}',
    
    // Comments
    insertComment: '<!-- Comment -->',
    insertJSComment: '<% // Comment %>',
    
    // Common Snowman utilities
    insertRandomChoice: '<%= ["option1", "option2", "option3"][Math.floor(Math.random() * 3)] %>',
    insertCurrentDate: '<%= new Date().toLocaleDateString() %>',
    insertCurrentTime: '<%= new Date().toLocaleTimeString() %>'
  })
};