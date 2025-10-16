/**
 * @jest-environment jsdom
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import Passage from '../../lib/Passage.js';

describe('HTML Comparison with Reference Files', () => {
  
  beforeEach(() => {
    // Set up a test story structure
    document.body.innerHTML = `
      <tw-storydata name="Test Story" startnode="1">
        <tw-passagedata pid="1" name="Start" tags="">
          # Welcome
          
          This is **bold** text.
          
          [[Continue->Second]]
        </tw-passagedata>
        <tw-passagedata pid="2" name="Second" tags="">
          ## Second Page
          
          You made it here!
        </tw-passagedata>
      </tw-storydata>
      <tw-story><tw-passage></tw-passage></tw-story>
    `;
    
    // Mock jQuery with more complete functionality
    global.$ = jest.fn((selector) => {
      // Handle different selectors that Story constructor uses
      if (selector === '*[type="text/twine-javascript"]') {
        return [];  // No scripts for this test
      }
      if (selector === '*[type="text/twine-css"]') {
        return [];  // No styles for this test
      }
      if (typeof selector === 'object') {
        // Handle $(window).on() calls
        return {
          on: jest.fn()
        };
      }
      
      return {
        html: jest.fn((content) => {
          if (content !== undefined) return this;
          return 'mocked content';
        }),
        trigger: jest.fn(),
        on: jest.fn(),
        append: jest.fn()
      };
    });
    global.$.event = { trigger: jest.fn() };
    
    // Mock underscore with functional template processing
    global._ = {
      template: jest.fn((source) => {
        return (data) => {
          // Simple template processing - replace <%= variable %> patterns
          let result = source;
          if (data) {
            Object.keys(data).forEach(key => {
              const pattern = new RegExp(`<%=\\s*${key}\\s*%>`, 'g');
              result = result.replace(pattern, data[key]);
            });
          }
          return result;
        };
      }),
      unescape: jest.fn((str) => str),
      isNumber: jest.fn((x) => typeof x === 'number'),
      isString: jest.fn((x) => typeof x === 'string')
    };
    
    // Set up window.story mock for Passage.render()
    global.window = global.window || {};
    global.window.story = {
      state: { playerName: 'Hero', score: 100 }
    };
  });

  test('should generate consistent HTML output', () => {
    // Test Passage.render() directly instead of Story.render() to avoid complex Story setup
    const passage = new Passage(1, 'Start', [], '# Welcome\n\nThis is **bold** text.\n\n[[Continue->Second]]');
    const generatedHTML = passage.render();
    
    // Basic structure validation
    expect(generatedHTML).toContain('Welcome');
    expect(generatedHTML).toContain('bold');
    expect(generatedHTML).toContain('data-passage="Second"');
  });

  test('should create and compare with reference file', () => {
    const passage = new Passage(1, 'Start', [], '# Welcome\n\nThis is **bold** text.\n\n[[Continue->Second]]');
    const generatedHTML = passage.render();
    const referenceFile = 'test/fixtures/jest-reference.html';
    
    // Create reference file if it doesn't exist
    if (!existsSync(referenceFile)) {
      writeFileSync(referenceFile, generatedHTML, 'utf8');
      console.log(`📝 Created reference file: ${referenceFile}`);
    }
    
    // Compare with reference
    const referenceHTML = readFileSync(referenceFile, 'utf8');
    expect(generatedHTML).toBe(referenceHTML);
  });

  test('should handle multiple passages consistently', () => {
    const passage1 = new Passage(1, 'Start', [], '# Welcome\n\nThis is **bold** text.\n\n[[Continue->Second]]');
    const passage2 = new Passage(2, 'Second', [], '## Second Page\n\nYou made it here!');
    
    const passage1HTML = passage1.render();
    const passage2HTML = passage2.render();
    
    // Save to files for inspection
    writeFileSync('test/reports/jest-passage-1.html', passage1HTML, 'utf8');
    writeFileSync('test/reports/jest-passage-2.html', passage2HTML, 'utf8');
    
    expect(passage1HTML).toContain('Welcome');
    expect(passage2HTML).toContain('Second Page');
    
    // Both should have consistent structure
    expect(typeof passage1HTML).toBe('string');
    expect(typeof passage2HTML).toBe('string');
    expect(passage1HTML.length).toBeGreaterThan(0);
    expect(passage2HTML.length).toBeGreaterThan(0);
  });

  test('should validate HTML structure', () => {
    const passage = new Passage(1, 'Start', [], '# Welcome\n\nThis is **bold** text.\n\n[[Continue->Second]]');
    const generatedHTML = passage.render();
    
    // HTML validation checks
    const validationTests = [
      { name: 'Contains text content', test: generatedHTML.length > 10 },
      { name: 'Contains passage links', test: /data-passage/.test(generatedHTML) },
      { name: 'No unescaped script tags', test: !/<script[^>]*>(?!.*<\/script>)/.test(generatedHTML) },
      { name: 'Contains markup', test: /<\w+>/.test(generatedHTML) || /\*\*/.test(generatedHTML) }
    ];
    
    validationTests.forEach(test => {
      expect(test.test).toBe(true);
      console.log(`✅ ${test.name}: ${test.test ? 'PASS' : 'FAIL'}`);
    });
  });

  test('should generate size-appropriate output', () => {
    const passage = new Passage(1, 'Start', [], '# Welcome\n\nThis is **bold** text.\n\n[[Continue->Second]]');
    const generatedHTML = passage.render();
    const size = Buffer.byteLength(generatedHTML, 'utf8');
    
    console.log(`📏 Generated HTML size: ${size} bytes`);
    
    // Reasonable size expectations
    expect(size).toBeGreaterThan(10); // Should have some content
    expect(size).toBeLessThan(10000); // Should not be enormous for simple passage
  });
});

describe('Cross-Passage Comparison', () => {
  test('should maintain consistency across different passage types', () => {
    // Test with different types of content
    const testCases = [
      {
        name: 'Simple text',
        content: 'Just some simple text.',
        expected: ['simple text']
      },
      {
        name: 'Markdown formatting',
        content: 'This has **bold** and *italic* text.',
        expected: ['bold', 'italic']
      },
      {
        name: 'Links',
        content: 'Go to [[Another Page]]',
        expected: ['data-passage']
      },
      {
        name: 'Mixed content',
        content: '# Heading\n\nParagraph with [[Link->Target]]',
        expected: ['Heading', 'Paragraph', 'data-passage']
      }
    ];
    
    testCases.forEach((testCase, index) => {
      // Set up DOM for this test case
      document.body.innerHTML = `
        <tw-storydata name="Test" startnode="${index + 1}">
          <tw-passagedata pid="${index + 1}" name="Test${index}" tags="">
            ${testCase.content}
          </tw-passagedata>
        </tw-storydata>
        <tw-story><tw-passage></tw-passage></tw-story>
      `;
      
      // Mock setup
      global.$ = jest.fn(() => ({
        html: () => 'mock',
        trigger: () => {},
        on: () => {},
        append: () => {}
      }));
      global.$.event = { trigger: () => {} };
      
      global._ = {
        template: (source) => () => source,
        unescape: (str) => str,
        isNumber: (x) => typeof x === 'number',
        isString: (x) => typeof x === 'string'
      };
      
      const passage = new Passage(index + 1, testCase.name, [], testCase.content);
      const output = passage.render();
      
      // Check expected content
      testCase.expected.forEach(expectedText => {
        expect(output.toLowerCase()).toContain(expectedText.toLowerCase());
      });
      
      // Save for inspection
      writeFileSync(`test/reports/testcase-${index}-${testCase.name.replace(/\s+/g, '-').toLowerCase()}.html`, 
                   output, 'utf8');
      
      console.log(`✅ Test case "${testCase.name}": ${output.length} bytes`);
    });
  });
});