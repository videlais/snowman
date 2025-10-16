#!/usr/bin/env node

/**
 * HTML Comparison Runner
 * 
 * This script demonstrates different ways to compare Snowman story output
 * with reference HTML files.
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { HTMLComparator } from '../test/utils/html-comparator.js';
import { BrowserTester } from '../test/utils/browser-tester.js';
import Story from '../lib/Story.js';

// JSDOM setup for Node.js environment
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.window = dom.window;
global.document = window.document;

// Mock jQuery for Node.js
global.$ = function() {
  return {
    html: () => 'test content',
    trigger: () => {},
    on: () => {},
    append: () => {}
  };
};
global.$.event = { trigger: () => {} };

// Mock window.story for the global context
global.window.story = {
  state: {}
};

// Mock underscore
global._ = {
  template: (source) => () => source,
  unescape: (str) => str,
  isNumber: (x) => typeof x === 'number',
  isString: (x) => typeof x === 'string'
};

async function runHTMLComparison() {
  console.log('🔍 Starting Snowman HTML Comparison Suite\n');

  // Set up test story
  document.body.innerHTML = `
    <tw-storydata name="Comparison Test" startnode="1">
      <tw-passagedata pid="1" name="Start" tags="">
        # Test Story
        
        This is a **test** story for comparison.
        
        [[Next->Second]]
        
        <div .test#main-content>
          Content with custom attributes
        </div>
      </tw-passagedata>
      <tw-passagedata pid="2" name="Second" tags="chapter">
        ## Second Passage
        
        * List item 1
        * List item 2
        
        [[Back->Start]]
      </tw-passagedata>
    </tw-storydata>
    <tw-story><tw-passage></tw-passage></tw-story>
  `;

  try {
    // Create story and generate output
    const story = new Story();
    const generatedHTML = story.render(1);
    
    console.log('📝 Generated HTML output (First 200 chars):');
    console.log(generatedHTML.substring(0, 200) + '...\n');

    // 1. Basic HTML structure validation
    console.log('1️⃣ Validating HTML structure...');
    validateHTMLStructure(generatedHTML);

    // 2. Create reference file if it doesn't exist
    const referenceFile = 'test/fixtures/reference-output.html';
    if (!existsSync(referenceFile)) {
      console.log('📋 Creating reference file for future comparisons...');
      writeFileSync(referenceFile, generatedHTML, 'utf8');
      console.log(`✅ Reference saved to: ${referenceFile}\n`);
    }

    // 3. Compare with reference
    console.log('2️⃣ Comparing with reference file...');
    const isMatch = HTMLComparator.compareWithFile(
      generatedHTML, 
      referenceFile, 
      'test/reports/detailed-comparison.json'
    );
    console.log(isMatch ? '✅ Matches reference\n' : '❌ Differs from reference\n');

    // 4. Generate browser comparison page
    console.log('3️⃣ Generating browser comparison page...');
    const referenceHTML = readFileSync(referenceFile, 'utf8');
    const tester = new BrowserTester();
    const comparisonHTML = tester.generateComparisonPage(generatedHTML, referenceHTML);
    writeFileSync('test/reports/visual-comparison.html', comparisonHTML, 'utf8');
    console.log('✅ Visual comparison page created: test/reports/visual-comparison.html\n');

    // 5. Test multiple passages
    console.log('4️⃣ Testing multiple passage consistency...');
    const passage2HTML = story.render(2);
    writeFileSync('test/reports/passage-2-output.html', passage2HTML, 'utf8');
    console.log('✅ Multiple passage outputs saved to test/reports/\n');

    // 6. Summary
    console.log('📊 Comparison Summary:');
    console.log(`   Generated HTML size: ${Buffer.byteLength(generatedHTML, 'utf8')} bytes`);
    console.log(`   Reference match: ${isMatch ? 'YES' : 'NO'}`);
    console.log(`   Files created in: test/reports/`);
    
    if (!isMatch) {
      console.log('\n🔍 To investigate differences:');
      console.log('   1. Check test/reports/detailed-comparison.json');
      console.log('   2. Open test/reports/visual-comparison.html in browser');
      console.log('   3. Run: npm test test/integration/complete-html-comparison.test.js');
    }

  } catch (error) {
    console.error('❌ Comparison failed:', error.message);
    process.exit(1);
  }
}

function validateHTMLStructure(html) {
  const checks = [
    { name: 'Contains headings', test: /<h[1-6]>/.test(html) },
    { name: 'Contains links', test: /data-passage/.test(html) },
    { name: 'Contains styled elements', test: /class="/.test(html) },
    { name: 'No script injection', test: !/<script[^>]*>/.test(html) },
    { name: 'Valid HTML entities', test: !/&[a-zA-Z]+;/.test(html.replace(/&lt;|&gt;|&amp;|&quot;/g, '')) }
  ];

  checks.forEach(check => {
    console.log(`   ${check.test ? '✅' : '❌'} ${check.name}`);
  });
  console.log();
}

// Command line options
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Snowman HTML Comparison Tool

Usage: node scripts/compare-html.js [options]

Options:
  --help, -h          Show this help message
  --browser, -b       Start browser server for visual testing
  --update-ref        Update reference files with current output

Examples:
  node scripts/compare-html.js                    # Run full comparison
  node scripts/compare-html.js --browser          # Start visual testing server
  node scripts/compare-html.js --update-ref       # Update reference files
`);
  process.exit(0);
}

if (args.includes('--browser') || args.includes('-b')) {
  console.log('🌐 Starting browser testing server...');
  // Start browser server mode
  // This would be implemented based on your specific needs
  console.log('Browser mode not fully implemented in this example');
  process.exit(0);
}

// Run the comparison
runHTMLComparison().catch(console.error);