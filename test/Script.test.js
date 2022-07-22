const Script = require('../src/Script.js');
const $ = require('jquery');
const Story = require('../src/Story.js');

describe('Script', () => {
  beforeEach(() => {
    $(document.body).html(`
        <tw-storydata name="Test" startnode="1" creator="jasmine" creator-version="1.2.3">
          <tw-passagedata pid="1" name="Test Passage" tags="">Hello world</tw-passagedata>
          <tw-passagedata pid="2" name="Test Passage 2" tags=""></tw-passagedata>
          <script type="text/twine-javascript"></script>
          <style type="text/twine-css"></style>
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
  describe('run()', () => {
    it('Should throw error if render() does', () => {
      expect(() => Script.run('<% !=; %>', window.Story));
    });
  });
});
