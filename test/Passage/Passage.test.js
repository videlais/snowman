/**
 * @jest-environment jsdom
 */

import Passage from '../../lib/Passage.js';
import $ from 'jquery';

// Mock window.story.state for _.template
global.window = {};
window.story = { state: { foo: 'bar', testVar: 'testValue' } };

// Mock jQuery event trigger
$.event = { trigger: jest.fn() };

describe('Passage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('constructor', () => {
        it('should set default values if no arguments are provided', () => {
            const passage = new Passage();
            expect(passage.id).toBe(1);
            expect(passage.name).toBe('Default');
            expect(passage.tags).toEqual([]);
            expect(passage.source).toBe('');
        });

        it('should set provided values', () => {
            const passage = new Passage(5, 'Intro', ['tag1', 'tag2'], 'source text');
            expect(passage.id).toBe(5);
            expect(passage.name).toBe('Intro');
            expect(passage.tags).toEqual(['tag1', 'tag2']);
            expect(passage.source).toBe('source text');
        });

        it('should unescape the source', () => {
            const passage = new Passage(1, 'Test', [], '&lt;b&gt;bold&lt;/b&gt;');
            expect(passage.source).toBe('<b>bold</b>');
        });
    });

    describe('render', () => {
        it('should use this.source if no source is provided', () => {
            const passage = new Passage(1, 'Test', [], 'Hello <%= s.foo %>');
            const html = passage.render();
            expect(html).toContain('Hello bar');
        });

        it('should use provided source if given', () => {
            const passage = new Passage(1, 'Test', [], 'unused');
            const html = passage.render('Hi <%= s.foo %>');
            expect(html).toContain('Hi bar');
        });

        it('should trigger error event if _.template throws', () => {
            const passage = new Passage(1, 'Test', [], '<%= notDefinedVar %>');
            passage.render();
            expect($.event.trigger).toHaveBeenCalledWith(
                'sm.story.error',
                expect.any(Array)
            );
        });

        it('should transform tag shorthands into HTML attributes', () => {
            const passage = new Passage(1, 'Test', [], '<div#myId.class1.class2>Content</div>');
            const html = passage.render();
            expect(html).toMatch(/<div id="myId" class="class1 class2">Content<\/div>/);
        });

        it('should handle - and 0 prefixes in tag shorthands', () => {
            const passage = new Passage(1, 'Test', [], '<a-0.class#id>Link</a>');
            const html = passage.render();
            // Adjusted regex to properly escape characters
            expect(html).toMatch(/<a style="display:none" href="javascript:void\(0\)" id="id" class="class">Link<\/a>/);
        });

        // Line 142: test renderAttrs with no attrs (should return empty string)
        it('should return empty string from renderAttrs when no attrs are provided', () => {
            const passage = new Passage(1, 'Test', [], '<div>Content</div>');
            // Access renderAttrs by triggering the tag shorthand with no attrs
            const html = passage.render('<div>Content</div>');
            expect(html).toMatch(/<div>Content<\/div>/);
        });
    });

    describe('mixed attribute scenarios for complete coverage', () => {
        it('should handle mixed standard and shorthand attributes (covers line 90, 97, 103)', () => {
            // This test covers:
            // Line 90: shorthandParts.push(part) - when a part doesn't contain '='
            // Line 97: processedShorthands = renderAttrs(...) - when shorthandParts has content
            // Line 103: allAttrs += processedShorthands - when both allAttrs and processedShorthands exist
            const passage = new Passage(1, 'Test', [], '<div id="test" .myClass ->Content</div>');
            const html = passage.render();
            
            // Should have standard id attribute, class from shorthand, and style from dash shorthand
            expect(html).toContain('id="test"');
            expect(html).toContain('class="myClass"');
            expect(html).toContain('style="display:none"');
            expect(html).toContain('Content');
        });

        it('should handle element with only standard attributes and empty shorthand parts', () => {
            // This covers the case where shorthandParts.length === 0, so line 97 is not executed
            const passage = new Passage(1, 'Test', [], '<span id="onlyStandard" data-test="value">Content</span>');
            const html = passage.render();
            
            expect(html).toContain('id="onlyStandard"');
            expect(html).toContain('data-test="value"');
            expect(html).toContain('Content');
            expect(html).not.toContain('class=');
            expect(html).not.toContain('style=');
        });

        it('should handle shorthand attributes that render to empty string (covers line 113)', () => {
            // This covers line 113: when renderAttrs returns empty string for shorthand-only attributes
            // We need to create a scenario where renderAttrs returns empty string
            // Looking at renderAttrs.js, it should return empty for unrecognized patterns
            const passage = new Passage(1, 'Test', [], '<div xyz>Content</div>');
            const html = passage.render();
            
            // Since 'xyz' is not a recognized shorthand pattern, renderAttrs should return empty
            // and we should get line 113: return '<' + tag + '>' + content + '</' + tag + '>';
            expect(html).toContain('<div>Content</div>');
            expect(html).not.toContain('xyz');
        });

        it('should handle quoted attributes with spaces', () => {
            // Test the regex matching for quoted attributes
            const passage = new Passage(1, 'Test', [], '<div class="multi word class" #myId>Content</div>');
            const html = passage.render();
            
            expect(html).toContain('class="multi word class"');
            expect(html).toContain('id="myId"');
            expect(html).toContain('Content');
        });

        it('should handle single quoted attributes', () => {
            // Test single quotes in the regex
            const passage = new Passage(1, 'Test', [], '<div data-value=\'single quoted\' .testClass>Content</div>');
            const html = passage.render();
            
            expect(html).toContain('data-value=\'single quoted\'');
            expect(html).toContain('class="testClass"');
            expect(html).toContain('Content');
        });

        it('should handle complex mixed scenarios', () => {
            // Complex test to ensure all branches are covered
            const passage = new Passage(1, 'Test', [], '<custom-elem id="standard" data-test="value" #shortId .class1.class2 -0>Complex content</custom-elem>');
            const html = passage.render();
            
            // Should have all types of attributes
            expect(html).toContain('id="standard"');
            expect(html).toContain('data-test="value"'); 
            expect(html).toContain('id="shortId"'); // Note: this will override the standard id in final output
            expect(html).toContain('class="class1 class2"');
            expect(html).toContain('style="display:none"');
            expect(html).toContain('href="javascript:void(0)"');
            expect(html).toContain('Complex content');
        });

        it('should handle edge case where allAttrs is empty but processedShorthands exists', () => {
            // This tests the branch where allAttrs is empty but we still have processedShorthands
            // This would happen with an element that has only shorthand attributes through the mixed path
            const passage = new Passage(1, 'Test', [], '<div .onlyClass>Content</div>');
            const html = passage.render();
            
            expect(html).toContain('class="onlyClass"');
            expect(html).toContain('Content');
            expect(html).not.toContain('id=');
        });

        it('should handle empty attribute processing gracefully', () => {
            // Test empty attributes
            const passage = new Passage(1, 'Test', [], '<div >Content with empty attrs</div>');
            const html = passage.render();
            
            expect(html).toBe('<div>Content with empty attrs</div>');
        });

        it('should handle multiple space-separated unrecognized patterns', () => {
            // This should trigger line 113 with multiple unrecognized shorthand patterns
            const passage = new Passage(1, 'Test', [], '<div abc def ghi>Content</div>');
            const html = passage.render();
            
            // All patterns should be unrecognized and result in empty renderAttrs output
            expect(html).toContain('<div>Content</div>');
            expect(html).not.toContain('abc');
            expect(html).not.toContain('def');
            expect(html).not.toContain('ghi');
        });

        it('should handle regex fallback when no match occurs (covers line 84 branch)', () => {
            // Create a scenario where the regex doesn't match normal patterns
            // This should trigger the || [attrs] fallback in line 84
            const passage = new Passage(1, 'Test', [], '<div =invalidpattern>Content</div>');
            const html = passage.render();
            
            // Should still process the element, though the attribute may not be valid
            expect(html).toContain('Content');
        });

        it('should handle case where allAttrs is empty but processedShorthands exists (covers line 103 branch)', () => {
            // This specifically tests the ternary operator (allAttrs ? ' ' : '') when allAttrs is empty
            // We need a case where standardAttrs is empty but shorthandParts has content
            const passage = new Passage(1, 'Test', [], '<div .justClass>Content</div>');
            const html = passage.render();
            
            // allAttrs should be empty (no standard attributes), but processedShorthands should have class
            // This triggers the ' ' : '' part of the ternary when allAttrs is empty
            expect(html).toContain('class="justClass"');
            expect(html).toContain('Content');
            expect(html).not.toContain('id=');
        });

        it('should test the regex fallback branch (line 84)', () => {
            // Test a case that would cause the regex to return null and use the fallback
            // The regex should handle this but let's make sure the fallback is tested
            const passage = new Passage(1, 'Test', [], '<div sometext>Content</div>');
            const html = passage.render();
            
            // Should still process correctly
            expect(html).toContain('Content');
        });

        it('should test empty allAttrs with processedShorthands (line 103 ternary)', () => {
            // Create a scenario specifically for the ternary (allAttrs ? ' ' : '') when allAttrs is empty string
            // This means no standard attributes, only shorthand that produces output
            const passage = new Passage(1, 'Test', [], '<span ->Hidden content</span>');
            const html = passage.render();
            
            // Should have shorthand processed but no standard attributes
            expect(html).toContain('style="display:none"');
            expect(html).toContain('Hidden content');
            expect(html).not.toContain('id=');
            expect(html).not.toContain('class=');
        });

        it('should test edge case with only whitespace attributes', () => {
            // Try to find a case where regex might fail or return unexpected results
            const passage = new Passage(1, 'Test', [], '<div   >Content with whitespace attrs</div>');
            const html = passage.render();
            
            expect(html).toContain('<div>Content with whitespace attrs</div>');
        });

        it('should test case where standardAttrs join produces empty but shorthand exists', () => {
            // Test the case where standardAttrs.join(' ') would be empty but we have shorthand
            // This ensures we test both sides of the allAttrs condition in line 103
            const passage = new Passage(1, 'Test', [], '<em 0>Link content</em>');
            const html = passage.render();
            
            expect(html).toContain('href="javascript:void(0)"');
            expect(html).toContain('Link content');
        });
    });

    describe('error handling and edge cases', () => {
        it('should handle template errors gracefully', () => {
            const passage = new Passage(1, 'Test', [], '<%= undefined.property %>');
            const html = passage.render();
            
            expect($.event.trigger).toHaveBeenCalledWith(
                'sm.story.error',
                expect.arrayContaining([
                    expect.any(Error),
                    'Passage.render() using _.template()'
                ])
            );
            
            // Should still return something (empty string in this case)
            expect(typeof html).toBe('string');
        });

        it('should handle null and undefined source parameters', () => {
            const passage = new Passage(1, 'Test', [], 'default source');
            
            // Test with null
            const htmlNull = passage.render(null);
            expect(htmlNull).toContain('default source');
            
            // Test with undefined  
            const htmlUndef = passage.render(undefined);
            expect(htmlUndef).toContain('default source');
        });

        it('should handle complex nested scenarios', () => {
            // Test more complex template processing
            const passage = new Passage(1, 'Test', [], 'Value: <%= s.testVar %> <div #computed<%= s.testVar %>>Dynamic</div>');
            const html = passage.render();
            
            expect(html).toContain('Value: testValue');
            // The computed ID should be processed
            expect(html).toContain('id="computedtestValue"');
        });
    });
});