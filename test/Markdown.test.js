const Markdown = require('../src/Markdown.js');

describe('Markdown', () => {
  describe('parse()', () => {
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
