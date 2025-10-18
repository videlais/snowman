import markdownIt from 'markdown-it';

const md = markdownIt({
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

export default Markdown;
