/**
 * @jest-environment jsdom
 */

import Passage from '../lib/Passage.js';

describe('Custom HTML Elements', () => {
  beforeEach(() => {
    // Set up a minimal DOM and story state
    document.body.innerHTML = '<tw-story><tw-passage></tw-passage></tw-story>';
    global.window.story = {
      state: {}
    };
    
    // Mock jQuery
    global.$ = jest.fn(() => ({
      html: jest.fn()
    }));
    global.$.event = { trigger: jest.fn() };
    
    // Mock underscore template
    global._ = {
      template: jest.fn((source) => () => source),
      unescape: jest.fn((str) => str)
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('custom elements without attributes should render correctly', () => {
    const passage = new Passage(1, 'test', [], '<custom-elem>content</custom-elem>');
    const result = passage.render();
    
    // Should not have style="display:none" added
    expect(result).toContain('<custom-elem>content</custom-elem>');
    expect(result).not.toContain('style="display:none"');
  });

  test('custom elements with attributes should render correctly', () => {
    const passage = new Passage(1, 'test', [], '<custom-elem id="test">content</custom-elem>');
    const result = passage.render();
    
    // Should preserve the id attribute and not break parsing
    expect(result).toContain('id="test"');
    expect(result).toContain('<custom-elem');
    expect(result).toContain('content</custom-elem>');
  });

  test('custom elements with dash shorthand should render correctly', () => {
    const passage = new Passage(1, 'test', [], '<custom-elem ->hidden content</custom-elem>');
    const result = passage.render();
    
    // Should apply the hidden style to custom-elem, not create <custom>
    expect(result).toContain('<custom-elem');
    expect(result).toContain('style="display:none"');
    expect(result).toContain('hidden content</custom-elem>');
    expect(result).not.toContain('<custom>'); // Should not turn into <custom> (without -elem)
  });

  test('multiple custom elements should render correctly', () => {
    const passage = new Passage(1, 'test', [], '<my-widget>widget1</my-widget><another-element ->hidden widget</another-element>');
    const result = passage.render();
    
    expect(result).toContain('<my-widget>widget1</my-widget>');
    expect(result).toContain('<another-element');
    expect(result).toContain('style="display:none"');
    expect(result).toContain('hidden widget</another-element>');
  });

  // Note: Nested custom elements with shorthand attributes are not currently supported
  // This is a limitation of the current regex-based parsing approach
  test('nested elements support is limited', () => {
    const passage = new Passage(1, 'test', [], '<outer-elem><inner-elem>nested content</inner-elem></outer-elem>');
    const result = passage.render();
    
    // Outer element should be processed
    expect(result).toContain('<outer-elem>');
    expect(result).toContain('</outer-elem>');
    // Inner element may not be processed due to parsing limitations
    expect(result).toContain('nested content');
  });

  test('standard HTML elements should still work with shorthands', () => {
    const passage = new Passage(1, 'test', [], '<div ->hidden div</div><span .highlight>highlighted</span>');
    const result = passage.render();
    
    expect(result).toContain('<div');
    expect(result).toContain('style="display:none"');
    expect(result).toContain('hidden div</div>');
    expect(result).toContain('<span');
    expect(result).toContain('class="highlight"');
    expect(result).toContain('highlighted</span>');
  });
});
