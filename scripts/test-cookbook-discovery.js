/**
 * Cookbook Discovery Test Script
 * Quick test to verify our cookbook discovery system works
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { CookbookDiscovery } = require('../test/utils/cookbook-discovery.cjs');
const { TweeCompiler } = require('../test/utils/twee-compiler.cjs');

async function testCookbookDiscovery() {
    console.log('🔍 Testing Cookbook Discovery System...\n');
    
    // Initialize discovery
    const discovery = new CookbookDiscovery();
    
    // Discover examples
    console.log('📚 Discovering examples...');
    const examples = discovery.discoverExamples();
    
    // Generate summary
    const summary = discovery.generateSummary();
    
    console.log('\n📊 Discovery Summary:');
    console.log(`   Total Examples: ${summary.totalExamples}`);
    console.log(`   Snowman v1: ${summary.snowmanVersions.snowman}`);
    console.log(`   Snowman v2: ${summary.snowmanVersions.snowman_2}`);
    console.log(`   Categories: ${summary.categories}`);
    console.log(`   With HTML Reference: ${summary.examplesWithHTML}`);
    console.log(`   With UserScript: ${summary.examplesWithUserScript}`);
    console.log(`   With Header: ${summary.examplesWithHeader}`);
    
    console.log('\n📋 Category Breakdown:');
    Object.entries(summary.categoryBreakdown).forEach(([category, count]) => {
        console.log(`   ${category}: ${count}`);
    });
    
    // Show some example details
    console.log('\n📝 Sample Examples:');
    examples.slice(0, 5).forEach(example => {
        console.log(`   ${example.displayName} (${example.version})`);
        console.log(`     Directory: ${example.directory}`);
        console.log(`     Twee File: ${example.files.twee}`);
        console.log(`     HTML File: ${example.files.html ? '✓' : '✗'}`);
        console.log(`     Passages: ${example.metadata.passages.length}`);
        console.log('');
    });
    
    // Test compilation of a simple example
    console.log('🔧 Testing Twee Compilation...');
    const compiler = new TweeCompiler();
    
    if (examples.length > 0) {
        const testExample = examples[0];
        console.log(`   Compiling: ${testExample.displayName}`);
        
        try {
            const html = await compiler.compileTweeFile(testExample.files.twee, {
                useCustomFormat: true // Use our custom format
            });
            
            console.log(`   ✓ Compilation successful (${html.length} bytes)`);
            console.log(`   ✓ Contains HTML structure: ${html.includes('<html>') ? '✓' : '✗'}`);
            console.log(`   ✓ Contains story data: ${html.includes('story') || html.includes('passage') ? '✓' : '✗'}`);
            
        } catch (error) {
            console.log(`   ✗ Compilation failed: ${error.message}`);
        }
    }
    
    console.log('\n✅ Cookbook discovery test complete!');
}

// Run the test
testCookbookDiscovery().catch(console.error);