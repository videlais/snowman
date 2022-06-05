const Markdown = require('../src/Markdown.js');

describe('Markdown', () => {
  describe('parse()', () => {
    it('Should parse header level five', () => {
      expect(Markdown.parse('##### Header')).toBe('<h5>Header</h5>');
    });

    it('Should parse header level four', () => {
      expect(Markdown.parse('#### Header')).toBe('<h4>Header</h4>');
    });

    it('Should parse header level three', () => {
      expect(Markdown.parse('### Header')).toBe('<h3>Header</h3>');
    });

    it('Should parse header level two', () => {
      expect(Markdown.parse('## Header')).toBe('<h2>Header</h2>');
    });

    it('Should parse header level one', () => {
      expect(Markdown.parse('# Header')).toBe('<h1>Header</h1>');
    });

    it('Should produce bold - asterisks', () => {
      expect(Markdown.parse('**bold text**')).toBe('<strong>bold text</strong>');
    });

    it('Should produce bold - underscores', () => {
      expect(Markdown.parse('__bold text__')).toBe('<strong>bold text</strong>');
    });

    it('Should produce emphasis - underscore', () => {
      expect(Markdown.parse('_text_')).toBe('<em>text</em>');
    });

    it('Should produce emphasis - asterisk', () => {
      expect(Markdown.parse('*text*')).toBe('<em>text</em>');
    });

    it('Should produce one line item - plus', () => {
      expect(Markdown.parse('\n+text')).toBe('<ul><li>text</li></ul>');
    });

    it('Should produce one line item - minus', () => {
      expect(Markdown.parse('\n-text')).toBe('<ul><li>text</li></ul>');
    });

    it('Should produce one line item - asterisk', () => {
      expect(Markdown.parse('\n*text')).toBe('<ul><li>text</li></ul>');
    });

    it('Should produce multiple line items - plus', () => {
      expect(Markdown.parse('\n+text\n+text')).toBe('<ul><li>text</li></ul><ul><li>text</li></ul>');
    });

    it('Should produce <hr> - hyphen', () => {
      expect(Markdown.parse('---')).toBe('<hr>');
    });

    it('Should produce <hr> - equal sign', () => {
      expect(Markdown.parse('===')).toBe('<hr>');
    });

    it('Should produce classic link', () => {
      expect(Markdown.parse('[[dest]]')).toBe('<tw-link role="link" data-passage="dest">dest</a>');
    });

    it('Should produce bar link', () => {
      expect(Markdown.parse('[[rename|dest]]')).toBe('<tw-link role="link" data-passage="dest">rename</a>');
    });

    it('Should produce right arrow link', () => {
      expect(Markdown.parse('[[rename->dest]]')).toBe('<tw-link role="link" data-passage="dest">rename</a>');
    });

    it('Should produce left arrow link', () => {
      expect(Markdown.parse('[[dest<-rename]]')).toBe('<tw-link role="link" data-passage="dest">rename</a>');
    });
  });

  describe('unescape()', () => {
    it('Should pass through HTML', () => {
      expect(Markdown.unescape('&lt;p&gt;Test&lt;/p&gt;')).toBe('<p>Test</p>');
    });
  });
});
