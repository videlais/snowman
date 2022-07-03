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
    // Setup global jQuery
    window.$ = $;
    // Create new Story instance
    window.story = new Story();
  });

  describe('constructor()', () => {
    it('Should set the story name from the element attribute', () => {
      expect(window.story.name).toBe('Test');
    });

    it('Should set the story creator from the element attribute', () => {
      expect(window.story.creator).toBe('jasmine');
    });

    it('Should set the story creator version from the element attribute', () => {
      expect(window.story.creatorVersion).toBe('1.2.3');
    });

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

    it('Should have read-only access to history', () => {
      expect(window.story.history.length).toBe(0);
      window.story.start();
      expect(window.story.history.length).toBe(1);
    });
  });

  describe('render()', () => {
    it('Should render a passage by name', () => {
      expect(window.story.render('Test Passage')).toBe('Hello world');
    });

    it('Should throw error when name is not found in passages', () => {
      expect(() => { window.story.render('Not Found'); }).toThrow();
    });
  });

  describe('getPassageByTags()', () => {
    it('Should return empty array if tag does not exist in story', () => {
      expect(window.story.getPassagesByTags('tag3').length).toBe(0);
    });

    it('Should return array of one entry if tag is only used once', () => {
      expect(window.story.getPassagesByTags('tag1').length).toBe(1);
    });

    it('Should return array of two entry if tag is used twice', () => {
      expect(window.story.getPassagesByTags('tag2').length).toBe(2);
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

  describe('passage()', () => {
    it('Should return null if passage name does not exist', () => {
      expect(window.story.passage('Nope')).toBe(null);
    });

    it('Should return passage if name exists', () => {
      const p = window.story.passage('Test Passage 3');
      expect(p.name).toBe('Test Passage 3');
    });
  });

  describe('render()', () => {
    it('Should return rendered content of named passage', () => {
      expect(window.story.render('Test Passage 5')).toBe('<tw-link role="link" data-passage="Test Passage">Test Passage</a>');
    });

    it('Should throw error if named passage does not exist', () => {
      expect(() => window.story.render('Test Passage 10')).toThrow();
    });
  });

  describe('renderPassageToSelector()', () => {
    it('Should render to a selector', () => {
      window.story.renderPassageToSelector('Test Passage', 'tw-passage');
      expect($('tw-passage').html()).toBe('Hello world');
    });

    it('Should throw if selector does not exist', () => {
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

  describe('applyExternalStyles()', () => {
    it('Should append a remote CSS file', () => {
      window.story.applyExternalStyles(['https://twinery.org/homepage/css/homepage.css', 'https://twinery.org/homepage/css/homepage-responsive.css']);
      expect($('link').length).toBe(2);
    });

    it('Should throw error if argument is not array', () => {
      expect(() => window.story.applyExternalStyles(2)).toThrow();
    });
  });

  describe('either()', () => {
    it('Should return null if given nothing', () => {
      expect(window.story.either()).toBe(null);
    });

    it('Should return single entry when only given one number', () => {
      expect(window.story.either(1)).toBe(1);
    });

    it('Should return single entry when only given one number in an array', () => {
      expect(window.story.either([1])).toBe(1);
    });

    it('Should return single entry when given mixed input', () => {
      expect(window.story.either([1], 2, [3], [4])).toBeLessThan(5);
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

describe('Story events', () => {
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
      <tw-passagedata pid="1" name="Test Passage" tags="tag1 tag2">[[Test Passage 2]]</tw-passagedata>
      <tw-passagedata pid="2" name="Test Passage 2" tags="tag2">Hello world 2</tw-passagedata>
      <tw-passagedata pid="3" name="Test Passage 5" tags="">[[Test Passage]]</tw-passagedata>
      <script type="text/twine-javascript">window.scriptRan = true;</script>
      <style type="text/twine-css">body { color: blue }</style>
   </tw-storydata>
   <tw-story>
   <tw-sidebar>
      <tw-icon tabindex="0" alt="Undo" title="Undo">↶</tw-icon>
      <tw-icon tabindex="1" alt="Redo" title="Redo">↷</tw-icon>
    </tw-sidebar>
    <tw-passage class="passage" aria-live="polite"></tw-passage></tw-story>`);
    // Reset story
    window.story = new Story();
    // Start a new story
    window.story.start();
  });

  it('Should emit undo event when tw-icon is clicked', () => {
    let result = false;
    $('tw-link').trigger('click');
    State.events.on('undo', () => {
      result = true;
    });
    window.story.undoIcon.trigger('click');
    expect(result).toBe(true);
  });

  it('Should emit undo event when undo() is called', () => {
    let result = false;
    $('tw-link').trigger('click');
    State.events.on('undo', () => {
      result = true;
    });
    window.story.undo();
    expect(result).toBe(true);
  });

  it('Should move back one in History.history when undo is clicked', () => {
    $('tw-link').trigger('click');
    window.story.undoIcon.trigger('click');
    expect(window.passage.name).toBe('Test Passage');
  });

  it('Should do nothing when at the bottom of history when undo is clicked', () => {
    window.story.undoIcon.trigger('click');
    window.story.undoIcon.trigger('click');
    expect(window.passage.name).toBe('Test Passage');
  });

  it('Should do nothing when at the bottom of history when redo is clicked', () => {
    $('tw-link').trigger('click');
    window.story.undoIcon.trigger('click');
    window.story.redoIcon.trigger('click');
    window.story.redoIcon.trigger('click');
    expect(window.passage.name).toBe('Test Passage 2');
  });

  it('Should move forward one in History.history when redo is clicked', () => {
    $('tw-link').trigger('click');
    window.story.undoIcon.trigger('click');
    window.story.redoIcon.trigger('click');
    expect(window.passage.name).toBe('Test Passage 2');
  });

  it('Should emit redo event when tw-icon is clicked', () => {
    let result = false;
    State.events.on('redo', () => {
      result = true;
    });
    window.story.redoIcon.trigger('click');
    expect(result).toBe(true);
  });

  it('Should emit redo event when redo() is called', () => {
    let result = false;
    State.events.on('redo', () => {
      result = true;
    });
    window.story.redo();
    expect(result).toBe(true);
  });

  it('Should show undo icon after at least one user click', () => {
    $('tw-link').trigger('click');
    expect(window.story.undoIcon.css('visibility')).toBe('visible');
  });

  it('Should trigger show when a reader clicks a link', () => {
    let result = false;
    State.events.on('show', () => {
      result = true;
    });
    $('tw-link').trigger('click');
    expect(result).toBe(true);
  });

  it('Should trigger adding the tw-screenlock element when "screen-lock" event happens', () => {
    State.events.emit('screen-lock');
    expect($('tw-screenlock').length).toBe(1);
  });

  it('Should trigger "screen-lock" when screenLock() is called', () => {
    window.story.screenLock();
    expect($('tw-screenlock').length).toBe(1);
  });

  it('Should remove tw-screenlock element if previously locked using events', () => {
    State.events.emit('screen-lock');
    State.events.emit('screen-unlock');
    expect($('tw-screenlock').length).toBe(0);
  });

  it('Should remove tw-screenlock element if previously locked using function calls', () => {
    window.story.screenLock();
    window.story.screenUnlock();
    expect($('tw-screenlock').length).toBe(0);
  });

  it('Should do nothing if not locked when trying to unlock', () => {
    State.events.emit('screen-unlock');
    expect($('tw-screenlock').length).toBe(0);
  });

  it('Should hide tw-sidebar by event', () => {
    State.events.emit('sidebar-hide');
    expect($('tw-sidebar').css('visibility')).toBe('hidden');
  });

  it('Should hide tw-sidebar by function call', () => {
    window.story.sidebarHide();
    expect($('tw-sidebar').css('visibility')).toBe('hidden');
  });

  it('Should show tw-sidebar by event', () => {
    State.events.emit('sidebar-show');
    expect($('tw-sidebar').css('visibility')).toBe('visible');
  });

  it('Should show tw-sidebar by function call', () => {
    window.story.sidebarShow();
    expect($('tw-sidebar').css('visibility')).toBe('visible');
  });
});
