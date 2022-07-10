const Markdown = require('../src/Markdown.js');

describe('Markdown', () => {
  describe('parse()', () => {
    it('Should produce classic link', () => {
      expect(Markdown.parse('[[dest]]')).toBe('<tw-link role="link" onclick="" data-passage="dest">dest</tw-link>');
    });

    it('Should produce classic link with custom onclick', () => {
      expect(Markdown.parse('[[dest][onclick]]')).toBe('<tw-link role="link" onclick="onclick" data-passage="dest">dest</tw-link>');
    });

    it('Should produce classic link both simple and with custom onclick', () => {
      expect(Markdown.parse('... [[dest]] ... [[dest][onclick]]')).toBe('... <tw-link role="link" onclick="" data-passage="dest">dest</tw-link> ... <tw-link role="link" onclick="onclick" data-passage="dest">dest</tw-link>');
    });

    it('Should produce classic link with custom onclick with state reference', () => {
      expect(Markdown.parse('[[dest][s.onclick=1]]')).toBe('<tw-link role="link" onclick="window.story.state.onclick=1" data-passage="dest">dest</tw-link>');
    });

    it('Should produce bar link', () => {
      expect(Markdown.parse('[[rename|dest]]')).toBe('<tw-link role="link" onclick="" data-passage="dest">rename</tw-link>');
    });

    it('Should produce bar link with custom onclick', () => {
      expect(Markdown.parse('[[rename|dest][onclick]]')).toBe('<tw-link role="link" onclick="onclick" data-passage="dest">rename</tw-link>');
    });

    it('Should produce bar link both simple and with custom onclick', () => {
      expect(Markdown.parse('... [[rename|dest]] ... [[rename|dest][onclick]]')).toBe('... <tw-link role="link" onclick="" data-passage="dest">rename</tw-link> ... <tw-link role="link" onclick="onclick" data-passage="dest">rename</tw-link>');
    });

    it('Should produce bar link with custom onclick with state reference', () => {
      expect(Markdown.parse('[[rename|dest][s.onclick=1]]')).toBe('<tw-link role="link" onclick="window.story.state.onclick=1" data-passage="dest">rename</tw-link>');
    });

    it('Should produce right arrow link', () => {
      expect(Markdown.parse('[[rename->dest]]')).toBe('<tw-link role="link" onclick="" data-passage="dest">rename</tw-link>');
    });

    it('Should produce right arrow link with custom onclick', () => {
      expect(Markdown.parse('[[rename->dest][onclick]]')).toBe('<tw-link role="link" onclick="onclick" data-passage="dest">rename</tw-link>');
    });

    it('Should produce right link both simple and with custom onclick', () => {
      expect(Markdown.parse('... [[rename->dest]] ... [[rename->dest][onclick]]')).toBe('... <tw-link role="link" onclick="" data-passage="dest">rename</tw-link> ... <tw-link role="link" onclick="onclick" data-passage="dest">rename</tw-link>');
    });

    it('Should produce right arrow link with custom onclick with state reference', () => {
      expect(Markdown.parse('[[rename->dest][s.onclick=1]]')).toBe('<tw-link role="link" onclick="window.story.state.onclick=1" data-passage="dest">rename</tw-link>');
    });

    it('Should produce left arrow link', () => {
      expect(Markdown.parse('[[dest<-rename]]')).toBe('<tw-link role="link" onclick="" data-passage="dest">rename</tw-link>');
    });

    it('Should produce left arrow link with custom onclick', () => {
      expect(Markdown.parse('[[dest<-rename][onclick]]')).toBe('<tw-link role="link" onclick="onclick" data-passage="dest">rename</tw-link>');
    });

    it('Should produce left link both simple and with custom onclick', () => {
      expect(Markdown.parse('... [[dest<-rename]] ... [[dest<-rename][onclick]]')).toBe('... <tw-link role="link" onclick="" data-passage="dest">rename</tw-link> ... <tw-link role="link" onclick="onclick" data-passage="dest">rename</tw-link>');
    });

    it('Should produce left arrow link with custom onclick with state reference', () => {
      expect(Markdown.parse('[[dest<-rename][s.onclick=1]]')).toBe('<tw-link role="link" onclick="window.story.state.onclick=1" data-passage="dest">rename</tw-link>');
    });
  });

  describe('unescape()', () => {
    it('Should pass through HTML', () => {
      expect(Markdown.unescape('&lt;p&gt;Test&lt;/p&gt;')).toBe('<p>Test</p>');
    });
  });
});
