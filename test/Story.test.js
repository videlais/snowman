const $ = require('jquery');
const Story = require('../lib/Story.js');
const LZString = require('lz-string');

describe('Story', () => {
  let storyEl;
  let story;

  beforeEach(() => {
    document.body.innerHTML = `<tw-storydata name="Test" startnode="1" creator="jasmine" creator-version="1.2.3">
    <tw-passagedata pid="1" name="Test Passage" tags="tag1 tag2">Hello world</tw-passagedata>
    <tw-passagedata pid="2" name="Test Passage 2" tags="tag1 tag2">Hello world 2</tw-passagedata>
    <tw-passagedata pid="3" name="Test Passage 3" tags=""><div><p><span>Test</span><p></div></tw-passagedata>
    <tw-passagedata pid="4" name="Test Passage 4" tags=""><% print(; %></tw-passagedata>
    <tw-passagedata pid="5" name="Test Passage 5" tags="">[[Test Passage]]</tw-passagedata>
    <script type="text/twine-javascript">window.scriptRan = true;</script>
    <style type="text/twine-css">body { color: blue }</style>
   </tw-storydata>`;

    storyEl = $('tw-storydata');
    story = new Story(storyEl);
  });

  describe('#constructor()', () => {
    it('Should set the story name from the element attribute', () => {
      expect(story.name).toBe('Test');
    });

    it('Should set the story creator from the element attribute', () => {
      expect(story.creator).toBe('jasmine');
    });

    it('Should set the story creator version from the element attribute', () => {
      expect(story.creatorVersion).toBe('1.2.3');
    });

    it('Should set startPassage to parseInt(startNode)', () => {
      expect(story.startPassage).toBe(1);
    });

    it('Should set the story\'s scripts from the element', () => {
      expect(story.userScripts.length).toBe(1);
      expect(story.userScripts[0]).toBe('window.scriptRan = true;');
    });

    it('Should set the story\'s styles from the element', () => {
      expect(story.userStyles.length).toBe(1);
      expect(story.userStyles[0]).toBe('body { color: blue }');
    });
  });

  describe('#render()', () => {
    it('Should render a passage by ID', () => {
      window.story = { state: {} };
      expect(story.render(1)).toBe('Hello world');
    });

    it('Should render a passage by name', () => {
      window.story = { state: {} };
      expect(story.render('Test Passage')).toBe('Hello world');
    });

    it('Should throw error when name or ID is not found in passages', () => {
      window.story = { state: {} };
      expect(() => { story.render('Not Found'); }).toThrow();
    });
  });

  describe('#passage()', () => {
    it('Should find a passage by ID with passage()', () => {
      expect(story.passage(1).name).toBe('Test Passage');
    });

    it('Should find a passage by name with passage()', () => {
      expect(story.passage('Test Passage').name).toBe('Test Passage');
    });

    it('Should return null if no passage exists with that ID or name', () => {
      expect(story.passage('Testing')).toBe(null);
    });
  });

  describe('#start()', () => {
    it('Should run story scripts with start()', () => {
      window.scriptRan = false;
      story.start($('nowhere'));
      expect(window.scriptRan).toBe(true);
    });

    it('Should add story styles with start()', () => {
      const $el = $('<div></div>');

      story.start($el);

      const $styles = $el.find('style');

      expect($styles.length).toBe(1);
      expect($styles.eq(0).html()).toBe('body { color: blue }');
    });
  });

  describe('#show()', () => {
    it('Should display content in a .passage element with show()', () => {
      const $el = $('<div></div>');
      story.start($el);
      story.show('Test Passage');
      expect($el.find('.passage').html()).toBe('Hello world');
    });

    it('Should trigger a sm.passage.hidden event when show() is called', () => {
      const $el = $('<div></div>');
      let eventHappened = false;
      $el.on('sm.passage.hidden', () => { eventHappened = true; });
      story.start($el);
      story.show('Test Passage 2');
      expect(eventHappened).toBe(true);
    });

    it('Should trigger a sm.passage.showing event when show() is called', () => {
      const $el = $('<div></div>');
      let eventHappened = false;

      $el.on('sm.passage.showing', () => { eventHappened = true; });
      story.start($el);
      story.show('Test Passage 2');
      expect(eventHappened).toBe(true);
    });

    it('Should trigger a sm.passage.shown event when show() is called', () => {
      const $el = $('<div></div>');
      let eventHappened = false;
      $el.on('sm.passage.shown', () => { eventHappened = true; });
      story.start($el);
      story.show('Test Passage 2');
      expect(eventHappened).toBe(true);
    });

    it.todo('Should trigger sm.checkpoint.added when checkpoint() used before show()');

    it('Should render nested HTML into passage element correctly', () => {
      const $el = $('<div></div>');
      story.start($el);
      story.show('Test Passage 3');
      expect($el.find('.passage').children().find('span').text()).toBe('Test');
    });

    it('Should throw error if passage cannot be found', () => {
      expect(() => { story.show('Test Passage 10'); }).toThrow();
    });

    it('Should trigger error when passage contents malformed JS', () => {
      const $el = $('<div></div>');
      story.start($el);
      story.show('Test Passage 4');
    });

    it.todo('Should trigger sm.checkpoint.failed during failure');
  });

  describe('#checkpoint()', () => {
    it('Should trigger sm.checkpoint.adding event', () => {
      let eventHappened = false;
      $(window).on('sm.checkpoint.adding', () => { eventHappened = true; });
      story.checkpoint();
      expect(eventHappened).toBe(true);
    });

    it('Should change the document title when passed an argument', () => {
      story.checkpoint('Test');
      expect(document.title).toBe(story.name + ': Test');
    });

    it('Should set atCheckpoint to be true', () => {
      story.checkpoint('Test');
      expect(story.atCheckpoint).toBe(true);
    });
  });

  describe('#save()', () => {
    it('Should save the story\'s state to the location hash', () => {
      story.start($('nowhere'));
      const hash = story.saveHash();
      story.save(hash);
      expect(window.location.hash).not.toBe('');
    });

    it('Should trigger sm.story.saved event', () => {
      let eventHappened = false;
      $(window).on('sm.story.saved', () => { eventHappened = true; });
      const hash = story.saveHash();
      story.save(hash);
      expect(eventHappened).toBe(true);
    });
  });

  describe('#saveHash()', () => {
    it('Should return correct LZString', () => {
      const testHash = LZString.compressToBase64(JSON.stringify({
        state: story.state,
        history: story.history,
        checkpointName: story.checkpointName
      }));

      expect(story.saveHash()).toBe(testHash);
    });
  });

  describe('#restore()', () => {
    it('Should return false on invalid (non LZString) hash argument', () => {
      expect(story.restore()).toBe(false);
    });

    it('Should trigger sm.restore.failed event on failure', () => {
      let eventHappened = false;
      $(window).on('sm.restore.failed', () => { eventHappened = true; });
      story.restore();
      expect(eventHappened).toBe(true);
    });

    it.todo('Should return true upon successful parsing');
    it.todo('Should trigger sm.restore.success event upon successful parsing');
  });
});
