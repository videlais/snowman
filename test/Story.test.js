const $ = require('jquery');
const Story = require('../src/Story.js');
const State = require('../src/State.js');

describe('Story', () => {
  beforeEach(() => {
    $(document.body).html(`
    <tw-storydata name="Test" startnode="1" creator="jasmine" creator-version="1.2.3">
      <tw-passagedata pid="1" name="Test Passage" tags="tag1 tag2">Hello world</tw-passagedata>
      <tw-passagedata pid="2" name="Test Passage 2" tags="tag2">Hello world 2</tw-passagedata>
      <tw-passagedata pid="3" name="Test Passage 3" tags=""><div><p><span>Test</span><p></div></tw-passagedata>
      <tw-passagedata pid="4" name="Test Passage 4" tags=""><% print(; %></tw-passagedata>
      <tw-passagedata pid="5" name="Test Passage 5" tags="">[[Test Passage]]</tw-passagedata>
      <script type="text/twine-javascript">window.scriptRan = true;</script>
      <style type="text/twine-css">body { color: blue }</style>
   </tw-storydata>
   <tw-story>
   <tw-sidebar>
      <tw-icon tabindex="0" alt="Undo" title="Undo">↶</tw-icon>
      <tw-icon tabindex="1" alt="Redo" title="Redo">↷</tw-icon>
    </tw-sidebar>
    <tw-passage class="passage" aria-live="polite"></tw-passage></tw-story>`);
    // Reset State
    State.reset();
    // Setup global jQuery
    window.$ = $;
    // Create new Story instance
    window.story = new Story();
  });

  describe('constructor()', () => {
    it('Should set the story\'s scripts from the element', () => {
      expect(window.story.userScripts.length).toBe(1);
      expect(window.story.userScripts[0]).toBe('window.scriptRan = true;');
    });

    it('Should set the story\'s styles from the element', () => {
      expect(window.story.userStyles.length).toBe(1);
      expect(window.story.userStyles[0]).toBe('body { color: blue }');
    });

    it('Should record all passages', () => {
      expect(window.story.passages.length).toBe(5);
    });
  });

  describe('include()', () => {
    it('Should include a passage by name', () => {
      expect(window.story.include('Test Passage')).toBe('Hello world');
    });

    it('Should throw error when name is not found in passages', () => {
      expect(() => { window.story.include('Not Found'); }).toThrow();
    });
  });

  describe('getPassageByTag()', () => {
    it('Should return empty array if tag does not exist in story', () => {
      expect(window.story.getPassagesByTag('tag3').length).toBe(0);
    });

    it('Should return array of one entry if tag is only used once', () => {
      expect(window.story.getPassagesByTag('tag1').length).toBe(1);
    });

    it('Should return array of two entry if tag is used twice', () => {
      expect(window.story.getPassagesByTag('tag2').length).toBe(2);
    });
  });

  describe('getPassageByName()', () => {
    it('Should return null if passage name does not exist', () => {
      expect(window.story.getPassageByName('Nope')).toBe(null);
    });

    it('Should return passage if name exists', () => {
      const p = window.story.getPassageByName('Test Passage 3');
      expect(p.name).toBe('Test Passage 3');
    });
  });

  describe('include()', () => {
    it('Should return rendered content of named passage', () => {
      expect(window.story.include('Test Passage 5')).toBe('<tw-link role="link" onclick="" data-passage="Test Passage">Test Passage</tw-link>');
    });

    it('Should throw error if named passage does not exist', () => {
      expect(() => window.story.include('Test Passage 10')).toThrow();
    });
  });

  describe('renderPassageToSelector()', () => {
    it('Should render to a selector', () => {
      window.story.renderPassageToSelector('Test Passage', 'tw-passage');
      expect($('tw-passage').html()).toBe('Hello world');
    });

    it('Should throw error if passage does not exist', () => {
      expect(() => window.story.renderPassageToSelector(':yeah', '<test>')).toThrow();
    });
  });

  describe('start()', () => {
    it('Should add story styles with start()', () => {
      window.story.start();
      const storyStyles = $('style');
      expect(storyStyles.length).toBe(2);
    });

    it('Should run story scripts with start()', () => {
      window.scriptRan = false;
      window.story.start();
      expect(window.scriptRan).toBe(true);
    });

    it('Should throw error if any user scripts cause errors', () => {
      window.story.userScripts[0] = '!=;';
      expect(() => window.story.start()).toThrow();
    });

    it('Should throw error if starting passage cannot be found', () => {
      $(document.body).html(`
        <tw-storydata name="Test" startnode="3" creator="jasmine" creator-version="1.2.3">
          <tw-passagedata pid="1" name="Test Passage" tags="tag1 tag2">Hello world</tw-passagedata>
          <script type="text/twine-javascript"></script>
          <style type="text/twine-css"></style>
      </tw-storydata>
      <tw-story>
      <tw-sidebar>
          <tw-icon tabindex="0" alt="Undo" title="Undo">↶</tw-icon>
          <tw-icon tabindex="1" alt="Redo" title="Redo">↷</tw-icon>
        </tw-sidebar>
        <tw-passage class="passage" aria-live="polite"></tw-passage></tw-story>`);
      // Setup global jQuery
      window.$ = $;
      // Create new Story instance
      window.story = new Story();
      // The starting passage does not exist.
      // This will throw an error.
      expect(() => { window.story.start(); }).toThrow();
    });
  });

  describe('show()', () => {
    it('Should replace the current passage content', () => {
      window.story.show('Test Passage');
      expect($('tw-passage').html()).toBe('Hello world');
    });

    it('Should throw error if passage does not exist', () => {
      expect(() => window.story.show('Nope')).toThrow();
    });

    it('Should emit show event', () => {
      let result = false;
      State.events.on('show', async () => {
        result = true;
        await expect(result).toBe(true);
      });
      window.story.show('Test Passage');
    });
  });

  describe('goto()', () => {
    it('Should replace the current passage content', () => {
      window.story.goto('Test Passage');
      expect($('tw-passage').html()).toBe('Hello world');
    });

    it('Should throw error if passage does not exist', () => {
      expect(() => window.story.goto('Nope')).toThrow();
    });

    it('Should assume default values', () => {
      expect(() => window.story.goto()).toThrow();
    });

    it('Should emit show event', () => {
      let result = false;
      State.events.on('show', async () => {
        result = true;
        await expect(result).toBe(true);
      });
      window.story.goto('Test Passage');
    });
  });

  describe('addPassage()', () => {
    it('Should add a new passage and increase length of passage array', () => {
      const currentLength = window.story.passages.length;
      window.story.addPassage('Example');
      expect(window.story.passages.length).toBe(currentLength + 1);
    });

    it('Should throw error if passage name already exists', () => {
      window.story.addPassage('Example');
      expect(() => { window.story.addPassage('Example'); }).toThrow();
    });

    it('Should ignore non-array data for tags', () => {
      window.story.addPassage('Example', 'test');
      const passage = window.story.getPassageByName('Example');
      expect(passage.tags.length).toBe(0);
    });

    it('Should ignore non-string data for source', () => {
      window.story.addPassage('Example', [], null);
      const passage = window.story.getPassageByName('Example');
      expect(passage.source.length).toBe(0);
    });

    it('Should assume default values', () => {
      window.story.addPassage();
      const passage = window.story.getPassageByName('');
      expect(passage.name).toBe('');
      expect(passage.tags.length).toBe(0);
      expect(passage.source).toBe('');
    });
  });

  describe('removePassage()', () => {
    it('Should do nothing if passage does not exist', () => {
      const passageCount = window.story.passages.length;
      window.story.removePassage('Nah');
      expect(window.story.passages.length).toBe(passageCount);
    });

    it('Should remove passage by name', () => {
      window.story.removePassage('Test Passage 5');
      expect(window.story.getPassageByName('Test Passage 5')).toBe(null);
    });

    it('Should assume default value', () => {
      const passageCount = window.story.passages.length;
      window.story.removePassage();
      expect(window.story.passages.length).toBe(passageCount);
    });
  });
});
