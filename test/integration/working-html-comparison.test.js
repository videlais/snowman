/**
 * @jest-environment jsdom
 */

import { writeFileSync } from 'fs';
import Passage from '../../lib/Passage.js';
import $ from 'jquery';

describe('HTML Output Comparison Tests', () => {
  beforeEach(() => {
    // Clear any existing mocks
    jest.clearAllMocks();
    
    // Set up global window.story state  
    global.window = global.window || {};
    window.story = { state: { playerName: 'Hero', score: 100 } };
    
    // Mock jQuery event trigger
    $.event = { trigger: jest.fn() };
  });

  test('should generate HTML that can be compared with reference files', () => {
    // Create a passage directly and test its rendering
    const passage = new Passage(1, 'TestPassage', ['test'], 'Hello **world**! [[Next Page->Second]]');
    const renderedHTML = passage.render();
    
    console.log('📝 Rendered HTML:', renderedHTML);
    
    // Save current output for comparison
    const outputFile = 'test/reports/direct-passage-output.html';
    writeFileSync(outputFile, renderedHTML, 'utf8');
    
    // Basic structure validation
    expect(renderedHTML).toContain('Hello');
    expect(renderedHTML).toContain('world');
    expect(renderedHTML.length).toBeGreaterThan(10);
    
    console.log(`✅ Generated ${renderedHTML.length} bytes of HTML`);
  });

  test('should handle passage with template variables', () => {
    // Test with template variables from story state
    const passage = new Passage(2, 'TemplateTest', [], 'Welcome <%= s.playerName %>! Score: <%= s.score %>');
    const renderedHTML = passage.render();
    
    console.log('📝 Template rendered HTML:', renderedHTML);
    
    // Save for inspection
    writeFileSync('test/reports/template-output.html', renderedHTML, 'utf8');
    
    expect(renderedHTML).toContain('Welcome Hero');
    expect(renderedHTML).toContain('Score: 100');
  });

  test('should handle custom HTML attributes', () => {
    const passage = new Passage(3, 'AttributeTest', [], '<div .highlight#main -0>Custom attributes</div>');
    const renderedHTML = passage.render();
    
    console.log('📝 Attribute test HTML:', renderedHTML);
    
    // Save for inspection
    writeFileSync('test/reports/attribute-output.html', renderedHTML, 'utf8');
    
    expect(renderedHTML).toContain('div');
    expect(renderedHTML).toContain('Custom attributes');
  });

  test('should create reference files for comparison', () => {
    // Create several test passages
    const testCases = [
      {
        name: 'simple-text',
        passage: new Passage(1, 'Simple', [], 'Just plain text.'),
        expected: ['plain text']
      },
      {
        name: 'markdown-formatting', 
        passage: new Passage(2, 'Markdown', [], '**Bold** and *italic* text.'),
        expected: ['Bold', 'italic']
      },
      {
        name: 'passage-links',
        passage: new Passage(3, 'Links', [], 'Go to [[Another Page]] or [[Home->Start]]'),
        expected: ['data-passage']
      }
    ];
    
    const results = {};
    
    testCases.forEach(testCase => {
      const html = testCase.passage.render();
      
      // Save individual outputs
      const filename = `test/reports/${testCase.name}.html`;
      writeFileSync(filename, html, 'utf8');
      
      // Collect results
      results[testCase.name] = {
        html: html,
        size: html.length,
        contains: testCase.expected.every(text => 
          html.toLowerCase().includes(text.toLowerCase())
        )
      };
      
      console.log(`📋 ${testCase.name}: ${html.length} bytes, contains expected: ${results[testCase.name].contains}`);
    });
    
    // Save summary report
    writeFileSync('test/reports/comparison-summary.json', 
                 JSON.stringify(results, null, 2), 'utf8');
    
    // All test cases should have some content
    Object.values(results).forEach(result => {
      expect(result.size).toBeGreaterThan(0);
    });
  });

  test('should provide baseline for visual comparison', () => {
    // Create a more complex passage for visual testing
    const complexSource = `
# Story Comparison Test

This passage contains **various** *formatting* elements:

1. Numbered lists
2. With multiple items
3. Including **bold** text

- Bullet points
- With [external links](https://example.com)
- And [[internal links->NextPage]]

> Block quotes for emphasis

\`\`\`
Code blocks for technical content
\`\`\`

<div .custom-class#unique-id>
  Custom HTML with shorthand attributes
</div>
    `.trim();
    
    const passage = new Passage(99, 'ComplexTest', ['visual', 'comparison'], complexSource);
    const html = passage.render();
    
    // Create a complete HTML document for browser testing
    const fullHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Snowman Passage Output</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .custom-class { border: 1px solid #ccc; padding: 10px; background: #f9f9f9; }
        a { color: #0066cc; }
        code { background: #f0f0f0; padding: 2px 4px; }
        blockquote { border-left: 4px solid #ccc; margin: 0; padding-left: 20px; }
    </style>
</head>
<body>
    <h1>📊 Snowman HTML Output Test</h1>
    <div id="passage-content">
        ${html}
    </div>
    <hr>
    <p><em>Generated by Snowman story format</em></p>
</body>
</html>`;
    
    writeFileSync('test/reports/visual-test-page.html', fullHTML, 'utf8');
    
    console.log('🌐 Visual test page created: test/reports/visual-test-page.html');
    console.log('📊 Open this file in a browser to see rendered output');
    
    expect(html.length).toBeGreaterThan(100);
    expect(html).toContain('Story Comparison Test');
  });

  test('should maintain consistency across runs', () => {
    // Test that the same input produces the same output
    const source = 'Consistency test with <%= s.playerName %> and **formatting**.';
    const passage = new Passage(10, 'ConsistencyTest', [], source);
    
    const run1 = passage.render();
    const run2 = passage.render();
    const run3 = passage.render();
    
    expect(run1).toBe(run2);
    expect(run2).toBe(run3);
    
    console.log('✅ Output consistency verified across multiple runs');
  });
});