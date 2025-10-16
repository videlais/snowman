/**
 * @jest-environment jsdom
 */

import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';
import Story from '../../lib/Story.js';

describe('HTML Output Comparison', () => {
  let story;
  
  beforeEach(() => {
    // Set up a minimal story structure
    document.body.innerHTML = `
      <tw-storydata name="Test Story" startnode="1">
        <tw-passagedata pid="1" name="Start" tags="">
          <p>Hello, world!</p>
          <p>[[Next->Second]]</p>
        </tw-passagedata>
        <tw-passagedata pid="2" name="Second" tags="">
          <p>This is the second passage.</p>
        </tw-passagedata>
      </tw-storydata>
      <tw-story><tw-passage></tw-passage></tw-story>
    `;
    
    global.$ = require('jquery')(window);
    global.$.event = { trigger: jest.fn() };
    
    story = new Story();
  });

  test('should generate HTML matching reference structure', () => {
    // Render the first passage
    const renderedHTML = story.render(1);
    
    // Load reference HTML file
    const referenceHTML = readFileSync('test/fixtures/expected-output.html', 'utf8');
    
    // Parse both HTML structures
    const renderedDOM = new JSDOM(renderedHTML);
    const referenceDOM = new JSDOM(referenceHTML);
    
    // Compare DOM structures
    expect(renderedDOM.window.document.body.innerHTML.trim())
      .toBe(referenceDOM.window.document.body.innerHTML.trim());
  });

  test('should generate consistent link structure', () => {
    const renderedHTML = story.render(1);
    
    // Check for expected link structure
    const dom = new JSDOM(renderedHTML);
    const links = dom.window.document.querySelectorAll('a[data-passage]');
    
    expect(links).toHaveLength(1);
    expect(links[0].getAttribute('data-passage')).toBe('Second');
    expect(links[0].textContent).toBe('Next');
  });

  test('should match CSS class structure', () => {
    // Test passage with CSS classes
    document.body.innerHTML = `
      <tw-storydata name="Test Story" startnode="1">
        <tw-passagedata pid="1" name="Start" tags="">
          <div class="container">
            <p .highlight#important>Styled content</p>
          </div>
        </tw-passagedata>
      </tw-storydata>
      <tw-story><tw-passage></tw-passage></tw-story>
    `;
    
    const newStory = new Story();
    const renderedHTML = newStory.render(1);
    const dom = new JSDOM(renderedHTML);
    
    const styledP = dom.window.document.querySelector('p');
    expect(styledP.className).toBe('highlight');
    expect(styledP.id).toBe('important');
  });
});