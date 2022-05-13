// Load additional functions
const $ = require('jquery');
const Story = require('../lib/Story.js');
require('../lib/Misc.js');

describe('Misc', () => {
  describe('#either()', () => {
    it('Should return nothing when given nothing', () => {
      expect(window.either()).toBe();
    });

    it('Should non-Array single value', () => {
      expect(window.either(1)).toBe(1);
    });

    it('Should return value within single Array', () => {
      expect(window.either([1])).toBe(1);
    });

    it('Should return one of the arguments passed to it', () => {
      expect(window.either('A', 'B', 'C', 'D')).toEqual(expect.anything());
    });

    it('Should return one of the arguments passed to it with arrays', () => {
      expect(window.either('A', 'B', 'C', 'D', ['E', 'F'])).toEqual(expect.anything());
    });
  });

  describe('#hasVisited()', () => {
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

      const storyEl = $('tw-storydata');
      const story = new Story(storyEl);
      window.story = story;
    });

    it('Should return true if passage id visited', () => {
      window.story.history = [1];
      expect(window.hasVisited(1)).toBe(true);
    });

    it('Should return false if passage id not visited', () => {
      window.story.history = [];
      expect(window.hasVisited(1)).toBe(false);
    });

    it('Should return false if passage name not visited', () => {
      window.story.history = [];
      expect(window.hasVisited('Random')).toBe(false);
    });

    it('Should return true if passage name visited', () => {
      window.story.history = [1];
      expect(window.hasVisited('Test Passage')).toBe(true);
    });

    it('Should return true if multiple passage names visited', () => {
      window.story.history = [1, 4];
      expect(window.hasVisited('Test Passage', 'Test Passage 4')).toBe(true);
    });

    it('Should return false if any multiple passage names not visited', () => {
      window.story.history = [1, 4];
      expect(window.hasVisited('Random', 'Another')).toBe(false);
    });
  });

  describe('#visited()', () => {
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

      const storyEl = $('tw-storydata');
      const story = new Story(storyEl);
      window.story = story;
    });

    it('Should return 0 if passage does not exist', () => {
      window.story.history = [1, 1];
      expect(window.visited(7)).toBe(0);
    });

    it('Should return number of passage visits for single id', () => {
      window.story.history = [1, 1];
      expect(window.visited(1)).toBe(2);
    });

    it('Should return number of passage visits for single name', () => {
      window.story.history = [1, 1];
      expect(window.visited('Test Passage')).toBe(2);
    });

    it('Should return lowest number of passage visits for multiple ids', () => {
      window.story.history = [1, 1, 1, 2, 2];
      expect(window.visited(1, 2)).toBe(2);
    });

    it('Should return lowest number of passage visits for multiple names', () => {
      window.story.history = [1, 1, 1, 2, 2];
      expect(window.visited('Test Passage', 'Test Passage 2')).toBe(2);
    });
  });

  describe('#renderToSelector()', () => {
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

      const storyEl = $('tw-storydata');
      const story = new Story(storyEl);
      window.story = story;
    });

    it('Should do nothing when passed nothing', () => {
      expect(window.renderToSelector()).toBe();
    });

    it('Should do nothing when selector does not exist', () => {
      expect(window.renderToSelector(null)).toBe();
    });

    it('Should do nothing when selector and passage do not exist', () => {
      expect(window.renderToSelector(null, null)).toBe();
    });

    it('Should overwrite HTML content with passage content', () => {
      window.renderToSelector('[name="Test Passage 2"]', 'Test Passage');
      expect($('[name="Test Passage 2"]').html()).toBe('Hello world');
    });
  });

  describe('getStyles()', () => {
    test.todo('Should load single CSS file');
    test.todo('Should load multiple CSS files');
  });
});
