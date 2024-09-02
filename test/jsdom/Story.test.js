const $ = require('jquery');
const Story = require('../../src/Story.js');
const State = require('../../src/State.js');

describe('Story', () => {
  beforeEach(() => {
    $(document.body).html(`
    <tw-storydata name="Test" startnode="1" creator="jasmine" creator-version="1.2.3">
      <tw-passagedata pid="1" name="Test Passage" tags="tag1 tag2">Hello world</tw-passagedata>
      <tw-passagedata pid="2" name="Test Passage 2" tags="tag2">Hello world 2</tw-passagedata>
      <tw-passagedata pid="3" name="Test Passage 3" tags=""><div><p><span>Test</span><p></div></tw-passagedata>
      <tw-passagedata pid="4" name="Test Passage 4" tags=""></tw-passagedata>
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
    // Setup global jQuery.
    window.$ = $;
    // Create new Story instance.
    window.Story = new Story();
    // Start story.
    window.Story.start();
  });

  describe('constructor()', () => {
    it('Should record all passages', () => {
      expect(window.Story.passages.length).toBe(5);
    });
  });

  describe('include()', () => {
    it('Should include a passage by name', () => {
      expect(window.Story.include('Test Passage')).toBe('<p>Hello world</p>\n');
    });

    it('Should throw error when name is not found in passages', () => {
      expect(() => { window.Story.include('Not Found'); }).toThrow();
    });
  });

  describe('getPassageByTag()', () => {
    it('Should return empty array if tag does not exist in story', () => {
      expect(window.Story.getPassagesByTag('tag3').length).toBe(0);
    });

    it('Should return array of one entry if tag is only used once', () => {
      expect(window.Story.getPassagesByTag('tag1').length).toBe(1);
    });

    it('Should return array of two entry if tag is used twice', () => {
      expect(window.Story.getPassagesByTag('tag2').length).toBe(2);
    });
  });

  describe('getPassageByName()', () => {
    it('Should return null if passage name does not exist', () => {
      expect(window.Story.getPassageByName('Nope')).toBe(null);
    });

    it('Should return passage if name exists', () => {
      const p = window.Story.getPassageByName('Test Passage 3');
      expect(p.name).toBe('Test Passage 3');
    });
  });

  describe('include()', () => {
    it('Should return rendered content of named passage', () => {
      expect(window.Story.include('Test Passage 5')).toBe('<p><tw-link role="link" onclick="" data-passage="Test Passage">Test Passage</tw-link></p>\n');
    });

    it('Should throw error if named passage does not exist', () => {
      expect(() => window.Story.include('Test Passage 10')).toThrow();
    });
  });

  describe('renderPassageToSelector()', () => {
    it('Should render to a selector', () => {
      window.Story.renderPassageToSelector('Test Passage', 'tw-passage');
      expect($('tw-passage').html()).toBe('<p>Hello world</p>\n');
    });

    it('Should throw error if passage does not exist', () => {
      expect(() => window.Story.renderPassageToSelector(':yeah', '<test>')).toThrow();
    });
  });

  describe('start()', () => {
    it('Should add story styles with start()', () => {
      window.Story.start();
      const storyStyles = $('style');
      expect(storyStyles.length).toBe(3);
    });

    it('Should run story scripts with start()', () => {
      window.scriptRan = false;
      window.Story.start();
      expect(window.scriptRan).toBe(true);
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
      window.Story = new Story();
      // Create global store shortcut.
      window.s = window.Story.store;
      // The starting passage does not exist.
      // This will throw an error.
      expect(() => { window.Story.start(); }).toThrow();
    });
  });

  describe('show()', () => {
    it('Should replace the current passage content', () => {
      window.Story.show('Test Passage');
      expect($('tw-passage').html()).toBe('<p>Hello world</p>\n');
    });

    it('Should throw error if passage does not exist', () => {
      expect(() => window.Story.show('Nope')).toThrow();
    });

    it('Should emit show event', () => {
      let result = false;
      State.events.on('show', async () => {
        result = true;
        await expect(result).toBe(true);
      });
      window.Story.show('Test Passage');
    });
  });

  describe('goto()', () => {
    it('Should replace the current passage content', () => {
      window.Story.goto('Test Passage');
      expect($('tw-passage').text()).toBe('Hello world\n');
    });

    it('Should throw error if passage does not exist', () => {
      expect(() => window.Story.goto('Nope')).toThrow();
    });

    it('Should assume default values', () => {
      expect(() => window.Story.goto()).toThrow();
    });

    it('Should emit show event', () => {
      let result = false;
      State.events.on('show', async () => {
        result = true;
        await expect(result).toBe(true);
      });
      window.Story.goto('Test Passage');
    });
  });

  describe('addPassage()', () => {
    it('Should add a new passage and increase length of passage array', () => {
      const currentLength = window.Story.passages.length;
      window.Story.addPassage('Example');
      expect(window.Story.passages.length).toBe(currentLength + 1);
    });

    it('Should throw error if passage name already exists', () => {
      window.Story.addPassage('Example');
      expect(() => { window.Story.addPassage('Example'); }).toThrow();
    });

    it('Should ignore non-array data for tags', () => {
      window.Story.addPassage('Example', 'test');
      const passage = window.Story.getPassageByName('Example');
      expect(passage.tags.length).toBe(0);
    });

    it('Should ignore non-string data for source', () => {
      window.Story.addPassage('Example', [], null);
      const passage = window.Story.getPassageByName('Example');
      expect(passage.source.length).toBe(0);
    });

    it('Should assume default values', () => {
      window.Story.addPassage();
      const passage = window.Story.getPassageByName('');
      expect(passage.name).toBe('');
      expect(passage.tags.length).toBe(0);
      expect(passage.source).toBe('');
    });
  });

  describe('removePassage()', () => {
    it('Should do nothing if passage does not exist', () => {
      const passageCount = window.Story.passages.length;
      window.Story.removePassage('Nah');
      expect(window.Story.passages.length).toBe(passageCount);
    });

    it('Should remove passage by name', () => {
      window.Story.removePassage('Test Passage 5');
      expect(window.Story.getPassageByName('Test Passage 5')).toBe(null);
    });

    it('Should assume default value', () => {
      const passageCount = window.Story.passages.length;
      window.Story.removePassage();
      expect(window.Story.passages.length).toBe(passageCount);
    });
  });
});

describe('Story Navigation', () => {
  beforeEach(() => {
    /*
     * :hidden and :visible will never work in JSDOM.
     * Solution via https://github.com/jsdom/jsdom/issues/1048
     */
    window.Element.prototype.getClientRects = function () {
      let node = this;
      while (node) {
        if (node === document) {
          break;
        }
        if (!node.style || node.style.display === 'none' || node.style.visibility === 'hidden') {
          return [];
        }
        node = node.parentNode;
      }
      return [{ width: 10, height: 10 }];
    };

    $(document.body).html(`
    <tw-storydata name="Test" startnode="1" creator="jasmine" creator-version="1.2.3">
      <tw-passagedata pid="1" name="Test Passage" tags="">[[Test Passage 2]]</tw-passagedata>
      <tw-passagedata pid="2" name="Test Passage 2" tags="">Hello world 2</tw-passagedata>
      <tw-passagedata pid="3" name="Test Passage 3" tags="">[[Test Passage]]</tw-passagedata>
      <script type="text/twine-javascript"></script>
      <style type="text/twine-css"></style>
   </tw-storydata>
   <tw-story>
   <tw-sidebar>
      <tw-icon tabindex="0" alt="Undo" title="Undo">↶</tw-icon>
      <tw-icon tabindex="1" alt="Redo" title="Redo">↷</tw-icon>
    </tw-sidebar>
    <tw-passage aria-live="polite"></tw-passage></tw-story>`);
    // Setup global jQuery.
    window.$ = $;
    // Create new Story instance.
    window.Story = new Story();

    // Start story.
    window.Story.start();
  });

  it('Should replace content when reader clicks a story link', () => {
    $('tw-link').trigger('click');
    expect($('tw-passage').text()).toBe('Hello world 2\n');
  });

  it('Should undo content after a navigation event by function call', () => {
    $('tw-link').trigger('click');
    window.Story.sidebar.undo();
    expect($('tw-passage').text()).toBe('Test Passage 2\n');
  });

  it('Should undo content after a navigation event', () => {
    $('tw-link').trigger('click');
    State.events.emit('undo');
    expect($('tw-passage').text()).toBe('Test Passage 2\n');
  });

  it('Should redo content by function call', () => {
    $('tw-link').trigger('click');
    window.Story.sidebar.undo();
    window.Story.sidebar.redo();
    expect($('tw-passage').text()).toBe('Hello world 2\n');
  });

  it('Should redo content by State.events', () => {
    $('tw-link').trigger('click');
    State.events.emit('undo');
    State.events.emit('redo');
    expect($('tw-passage').text()).toBe('Hello world 2\n');
  });

  it('Should undo content after a navigation event by click event', () => {
    $('tw-link').trigger('click');
    window.Story.sidebar.undoIcon.trigger('click');
    expect($('tw-passage').text()).toBe('Test Passage 2\n');
  });

  it('Should redo content by click event', () => {
    $('tw-link').trigger('click');
    window.Story.sidebar.undoIcon.trigger('click');
    window.Story.sidebar.redoIcon.trigger('click');
    expect($('tw-passage').text()).toBe('Hello world 2\n');
  });

  it('Should be back at position 0 in History', () => {
    $('tw-link').trigger('click');
    window.Story.sidebar.undo();
    expect(window.Story.history.position).toBe(0);
  });

  it('Should never exceed history length when redoing', () => {
    $('tw-link').trigger('click');
    window.Story.sidebar.undo();
    window.Story.sidebar.redo();
    window.Story.sidebar.redo();
    expect(window.Story.history.position).toBe(window.Story.history.history.length - 1);
  });
});
