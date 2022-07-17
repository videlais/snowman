const Sidebar = require('../src/Sidebar.js');
const State = require('../src/State.js');
const $ = require('jquery');

let sidebar = null;

describe('Sidebar', () => {
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
   <tw-story>
    <tw-sidebar>
        <tw-icon tabindex="0" alt="Undo" title="Undo">↶</tw-icon>
        <tw-icon tabindex="1" alt="Redo" title="Redo">↷</tw-icon>
      </tw-sidebar>
      <tw-passage class="passage" aria-live="polite"></tw-passage>
    </tw-story>`);
    // Reset State.
    State.reset();
    // Reset Sidebar.
    sidebar = new Sidebar();
  });

  it('Should show tw-sidebar by function call', () => {
    sidebar.show();
    expect($('tw-sidebar').css('visibility')).toBe('visible');
  });

  it('Should hide tw-sidebar by function call', () => {
    sidebar.hide();
    expect($('tw-sidebar').css('visibility')).toBe('hidden');
  });

  it('Should emit undo event when undo() is called', () => {
    let result = false;
    State.events.on('undo', () => {
      result = true;
      expect(result).toBe(true);
    });
    sidebar.undo();
  });

  it('Should emit redo event when redo() is called', () => {
    let result = false;
    State.events.on('redo', () => {
      result = true;
      expect(result).toBe(true);
    });
    sidebar.redo();
  });
});
