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

    it('Should set startPassage to parseInt(startNode)', () => {
      expect(window.story.startPassage).toBe(1);
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

  describe('getPassageById()', () => {
    it('Should return null if passage id does not exist', () => {
      expect(window.story.getPassageById(10)).toBe(null);
    });

    it('Should return passage if id exists', () => {
      const p = window.story.getPassageById(1);
      expect(p.id).toBe(1);
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

  describe('render()', () => {
    it('Should return rendered content of named passage', () => {
      expect(window.story.render('Test Passage 5')).toBe('<tw-link role="link" data-passage="Test Passage">Test Passage</a>');
    });

    it('Should throw error if named passage does not exist', () => {
      expect(() => window.story.render('Test Passage 10')).toThrow();
    });
  });

  describe('renderToSelector()', () => {
    it('Should render to a selector', () => {
      window.story.renderToSelector('Test Passage', 'tw-passage');
      expect($('tw-passage').html()).toBe('Hello world');
    });

    it('Should throw if selector does not exist', () => {
      expect(() => window.story.renderToSelector(':yeah', '<test>')).toThrow();
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

    it('Should throw error if starting passage does not exist', () => {
      window.story.startPassage = 10;
      expect(() => window.story.start()).toThrow();
    });

    it('Should listen for navigation (click) events', () => {
      window.story.startPassage = 5;
      window.story.start();
      $('tw-link[data-passage]').trigger('click');
      expect($('tw-story').html().includes('Hello world')).toBe(true);
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
    </tw-sidebar>
    <tw-passage class="passage" aria-live="polite"></tw-passage></tw-story>`);
    // Reset story
    window.story = new Story();
    // Start a new story
    window.story.start();
  });

  it('Should emit undo event when tw-icon is clicked', () => {
    let result = false;
    State.events.emit('navigation', 'Test Passage 5');
    State.events.on('undo', () => {
      result = true;
    });
    window.story.undoIcon.trigger('click');
    expect(result).toBe(true);
  });

  it('Should listen for navigation events', () => {
    State.events.emit('navigation', 'Test Passage 3');
    expect(State.history.length).toBe(2);
  });

  it('Should trigger showing undo icon', () => {
    State.events.emit('navigation', 'Test Passage 3');
    State.events.emit('navigation', 'Test Passage 3');
    expect(window.story.undoIcon.css('visibility')).toBe('visible');
  });

  it('Should trigger navigation when a reader clicks a link', () => {
    let result = false;
    State.events.on('navigation', () => {
      result = true;
    });
    $('tw-link').trigger('click');
    expect(result).toBe(true);
  });
});
