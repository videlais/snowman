/**
 * @jest-environment jsdom
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { HTMLComparator } from '../utils/html-comparator.js';
import { BrowserTester } from '../utils/browser-tester.js';
import Story from '../../lib/Story.js';

describe('Complete HTML Comparison Suite', () => {
  let story;
  let generatedHTML;
  
  beforeAll(() => {
    // Ensure test directories exist
    if (!existsSync('test/fixtures')) {
      mkdirSync('test/fixtures', { recursive: true });
    }
    if (!existsSync('test/reports')) {
      mkdirSync('test/reports', { recursive: true });
    }
  });
  
  beforeEach(() => {
    // Set up a complete story structure
    document.body.innerHTML = `
      <tw-storydata name="Test Story" startnode="1">
        <tw-passagedata pid="1" name="Start" tags="">
          # Welcome to the Story
          
          This is **bold** text and this is *italic*.
          
          [[Continue->Second]]
          
          <div .highlight#important>
            Custom styled content
          </div>
        </tw-passagedata>
        <tw-passagedata pid="2" name="Second" tags="chapter">
          ## Chapter 2
          
          You made it to the second passage!
          
          - Item 1
          - Item 2  
          - Item 3
          
          [[Go back->Start]] | [[Finish->End]]
        </tw-passagedata>
        <tw-passagedata pid="3" name="End" tags="">
          **The End**
          
          Thanks for playing!
        </tw-passagedata>
      </tw-storydata>
      <tw-story><tw-passage></tw-passage></tw-story>
    `;
    
    // Mock jQuery
    global.$ = jest.fn(() => ({
      html: jest.fn(() => 'mocked content'),
      trigger: jest.fn(),
      on: jest.fn(),
      append: jest.fn()
    }));
    global.$.event = { trigger: jest.fn() };
    
    // Mock underscore
    global._ = {
      template: jest.fn((source) => () => source),
      unescape: jest.fn((str) => str),
      isNumber: jest.fn((x) => typeof x === 'number'),
      isString: jest.fn((x) => typeof x === 'string')
    };
    
    story = new Story();
    generatedHTML = story.render(1);
  });

  describe('DOM Structure Comparison', () => {
    test('should generate valid HTML structure', () => {
      expect(generatedHTML).toContain('<h1>');
      expect(generatedHTML).toContain('Welcome to the Story');
      expect(generatedHTML).toContain('data-passage="Second"');
      expect(generatedHTML).toContain('class="highlight"');
      expect(generatedHTML).toContain('id="important"');
    });

    test('should handle markdown correctly', () => {
      expect(generatedHTML).toContain('<strong>');
      expect(generatedHTML).toContain('<em>');
    });

    test('should process custom attributes', () => {
      expect(generatedHTML).toMatch(/class="highlight"/);
      expect(generatedHTML).toMatch(/id="important"/);
    });
  });

  describe('Reference File Comparison', () => {
    test('should match saved reference output', () => {
      const referenceFile = 'test/fixtures/expected-start-passage.html';
      
      // Create reference file if it doesn't exist (for first run)
      if (!existsSync(referenceFile)) {
        writeFileSync(referenceFile, generatedHTML, 'utf8');
        console.log(`📝 Created reference file: ${referenceFile}`);
      }
      
      const referenceHTML = readFileSync(referenceFile, 'utf8');
      const comparison = HTMLComparator.compareHTML(generatedHTML, referenceHTML);
      
      if (!comparison.identical) {
        // Write current output for inspection
        writeFileSync('test/reports/current-output.html', generatedHTML, 'utf8');
        writeFileSync('test/reports/comparison-report.json', 
          JSON.stringify(comparison, null, 2), 'utf8');
        
        console.log('❌ HTML output differs from reference');
        console.log('📊 Check test/reports/ for detailed comparison');
      }
      
      expect(comparison.identical).toBe(true);
    });

    test('should handle multiple passage rendering consistently', () => {
      const passage2HTML = story.render(2);
      const passage3HTML = story.render(3);
      
      // Save all outputs for comparison
      writeFileSync('test/reports/passage-1.html', generatedHTML, 'utf8');
      writeFileSync('test/reports/passage-2.html', passage2HTML, 'utf8');
      writeFileSync('test/reports/passage-3.html', passage3HTML, 'utf8');
      
      // Each passage should have different content but consistent structure
      expect(passage2HTML).toContain('Chapter 2');
      expect(passage3HTML).toContain('The End');
    });
  });

  describe('Cross-Browser Compatibility', () => {
    test('should generate HTML compatible with modern browsers', () => {
      // Check for proper HTML5 structure
      expect(generatedHTML).not.toContain('<!DOCTYPE');
      expect(generatedHTML).not.toContain('<html>');
      
      // Should contain proper semantic elements
      expect(generatedHTML).toMatch(/<h[1-6]>/);
      expect(generatedHTML).toMatch(/<a\s+[^>]*data-passage/);
    });

    test('should handle special characters correctly', () => {
      // Test passage with special characters
      document.body.innerHTML = `
        <tw-storydata name="Special Test" startnode="1">
          <tw-passagedata pid="1" name="Special" tags="">
            Special chars: &lt;script&gt;alert('xss')&lt;/script&gt;
            Unicode: 🎮 📚 ⚡
            Quotes: "Hello" and 'World'
          </tw-passagedata>
        </tw-storydata>
        <tw-story><tw-passage></tw-passage></tw-story>
      `;
      
      const specialStory = new Story();
      const specialHTML = specialStory.render(1);
      
      // Should not contain unescaped script tags
      expect(specialHTML).not.toContain('<script>alert');
      expect(specialHTML).toContain('🎮');
    });
  });

  describe('Performance and Optimization', () => {
    test('should generate reasonably sized HTML output', () => {
      const size = Buffer.byteLength(generatedHTML, 'utf8');
      
      // Should be reasonable size (adjust threshold as needed)
      expect(size).toBeLessThan(50000); // 50KB
      
      console.log(`📏 Generated HTML size: ${size} bytes`);
    });

    test('should not contain development artifacts', () => {
      // Should not contain debug information
      expect(generatedHTML).not.toContain('console.log');
      expect(generatedHTML).not.toContain('debugger');
      expect(generatedHTML).not.toContain('TODO');
    });
  });
});

// Utility test to create comparison files for manual inspection
describe('Manual Comparison Helpers', () => {
  test('should generate browser comparison page', async () => {
    // This test creates files for manual browser testing
    const story = new Story();
    const generatedHTML = story.render(1);
    
    // Create a reference HTML (you would replace this with your actual reference)
    const referenceHTML = `
      <h1>Welcome to the Story</h1>
      <p>This is <strong>bold</strong> text and this is <em>italic</em>.</p>
      <p><a href="javascript:void(0)" data-passage="Second">Continue</a></p>
      <div class="highlight" id="important">Custom styled content</div>
    `;
    
    const tester = new BrowserTester();
    const comparisonHTML = tester.generateComparisonPage(generatedHTML, referenceHTML);
    
    // Save comparison page
    writeFileSync('test/reports/browser-comparison.html', comparisonHTML, 'utf8');
    
    console.log('🌐 Browser comparison page created: test/reports/browser-comparison.html');
    console.log('📖 Open this file in your browser to visually compare outputs');
    
    expect(comparisonHTML).toContain('Generated Output');
    expect(comparisonHTML).toContain('Reference Output');
  });
});