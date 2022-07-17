const Screen = require('../src/Screen.js');
const $ = require('jquery');

describe('Screen', () => {
  beforeEach(() => {
    $(document.body).html(`
    <tw-storydata name="Test" startnode="1" creator="jasmine" creator-version="1.2.3">
      <tw-passagedata pid="1" name="Test Passage" tags="tag1 tag2"></tw-passagedata>
      <script type="text/twine-javascript"></script>
      <style type="text/twine-css"></style>
   </tw-storydata>
   <tw-story>
   <tw-sidebar>
      <tw-icon tabindex="0" alt="Undo" title="Undo">↶</tw-icon>
      <tw-icon tabindex="1" alt="Redo" title="Redo">↷</tw-icon>
    </tw-sidebar>
    <tw-passage class="passage" aria-live="polite"></tw-passage></tw-story>`);
  });

  describe('lock()', () => {
    it('Should create tw-screenlock element when called', () => {
      Screen.lock();
      expect($('tw-screenlock').length).toBe(1);
    });
  });

  describe('unlock()', () => {
    it('Should remove tw-screenlock element if it exists', () => {
      Screen.lock();
      Screen.unlock();
      expect($('tw-screenlock').length).toBe(0);
    });
  });
});
