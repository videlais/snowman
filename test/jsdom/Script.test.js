const Script = require('../../src/Script.js');
const $ = require('jquery');
const Story = require('../../src/Story.js');

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
    globalThis.$ = $;
    // Create new Story instance.
    globalThis.Story = new Story();
    // Start story.
    globalThis.Story.start();
  });
  describe('run()', () => {
    it('Should throw error if render() does', () => {
      expect(() => Script.run('<% !=; %>', globalThis.Story)).toThrow('Error compiling template code:');
    });

    it('Should successfully run valid script', () => {
      const result = Script.run('<%= "Hello World" %>', globalThis.Story);
      expect(result).toBe('Hello World');
    });

    it('Should provide access to story context', () => {
      globalThis.Story.store.testValue = 42;
      const result = Script.run('<%= s.testValue %>', globalThis.Story);
      expect(result).toBe('42');
    });
  });
});
