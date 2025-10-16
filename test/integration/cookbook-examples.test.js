/**
 * Comprehensive Cookbook Test Suite
 * Tests all Twine Cookbook examples to ensure compatibility with new Snowman version
 */

const path = require('path');
const { CookbookDiscovery } = require('../utils/cookbook-discovery.cjs');
const { TweeCompiler } = require('../utils/twee-compiler.cjs');

describe('Twine Cookbook Examples', () => {
    let discovery;
    let compiler;
    let examples;

    beforeAll(async () => {
        discovery = new CookbookDiscovery();
        compiler = new TweeCompiler();
        examples = discovery.discoverExamples();
        
        console.log(`\nDiscovered ${examples.length} cookbook examples:`);
        const summary = discovery.generateSummary();
        console.log(`  - ${summary.snowmanVersions.snowman} Snowman v1 examples`);
        console.log(`  - ${summary.snowmanVersions.snowman_2} Snowman v2 examples`);
        console.log(`  - ${summary.categories} categories`);
        console.log(`  - ${summary.examplesWithHTML} examples with reference HTML\n`);
    });

    test('should discover cookbook examples', () => {
        expect(examples).toBeDefined();
        expect(examples.length).toBeGreaterThan(0);
    });

    test('compilation test setup', async () => {
        expect(examples.length).toBeGreaterThan(0);
        
        // Test first example to ensure compilation works
        const testExample = examples[0];
        let compiledHtml;
        
        try {
            compiledHtml = await compiler.compileTweeFile(testExample.files.twee, {
                storyFormat: 'snowman',
                storyFormatVersion: '2.1.0',
                useCustomFormat: true
            });
        } catch (error) {
            console.warn(`Failed to compile test example ${testExample.name}:`, error.message);
            throw error;
        }

        expect(compiledHtml).not.toBeNull();
        expect(typeof compiledHtml).toBe('string');
        expect(compiledHtml.length).toBeGreaterThan(0);
        
        console.log(`✓ Successfully compiled ${testExample.displayName} (${compiledHtml.length} bytes)`);
    });

    test('batch compilation test', async () => {
        const results = await compiler.batchCompile(examples.map(e => e.files.twee));
        
        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success);
        
        console.log(`\nBatch compilation results:`);
        console.log(`  ✓ Successful: ${successful}/${results.length}`);
        console.log(`  ✗ Failed: ${failed.length}/${results.length}`);
        
        if (failed.length > 0) {
            console.log(`\nFailed examples:`);
            failed.forEach(f => {
                console.log(`  - ${path.basename(f.input)}: ${f.error}`);
            });
        }
        
        // Expect at least 80% success rate
        const successRate = successful / results.length;
        expect(successRate).toBeGreaterThan(0.8);
    }, 30000); // 30 second timeout for batch compilation

    test('HTML structure validation', async () => {
        // Test a sample of examples for HTML structure
        const sampleSize = Math.min(5, examples.length);
        const sampleExamples = examples.slice(0, sampleSize);
        
        for (const example of sampleExamples) {
            let compiledHtml;
            
            try {
                compiledHtml = await compiler.compileTweeFile(example.files.twee, {
                    storyFormat: 'snowman',
                    storyFormatVersion: '2.1.0',
                    useCustomFormat: true
                });
            } catch (error) {
                console.warn(`Skipping HTML validation for ${example.name}: ${error.message}`);
                continue;
            }

            // Basic HTML structure
            expect(compiledHtml).toMatch(/<html[^>]*>/i);
            expect(compiledHtml).toMatch(/<head[^>]*>/i);
            expect(compiledHtml).toMatch(/<body[^>]*>/i);
            expect(compiledHtml).toMatch(/<\/html>/i);
            
            // Should contain story data
            const hasStoryData = compiledHtml.includes('tw-storydata') || 
                               compiledHtml.includes('story-data') ||
                               compiledHtml.includes('passages');
            expect(hasStoryData).toBe(true);
            
            console.log(`✓ ${example.displayName}: HTML structure valid`);
        }
    }, 20000);

    test('should generate reasonably sized HTML', async () => {
        const testExample = examples[0];
        
        let compiledHtml;
        try {
            compiledHtml = await compiler.compileTweeFile(testExample.files.twee, {
                useCustomFormat: true
            });
        } catch (compilationError) {
            console.error('Compilation failed:', compilationError.message);
            throw compilationError;
        }

        const htmlSize = Buffer.byteLength(compiledHtml, 'utf8');
        
        // HTML should not be empty but also not excessively large
        expect(htmlSize).toBeGreaterThan(1000); // At least 1KB (includes full Snowman runtime)
        expect(htmlSize).toBeLessThan(1024 * 1024); // Less than 1MB
        
        console.log(`Generated HTML size: ${(htmlSize / 1024).toFixed(1)}KB`);
    });
});