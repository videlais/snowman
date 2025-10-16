/**
 * @jest-environment jsdom
 * 
 * Test for issue #186: Paragraph tags misplaced for first paragraph in Windows
 * https://github.com/videlais/snowman/issues/186
 * 
 * The issue was that in Snowman 2.0.2, paragraph cleanup code assumed Unix newlines (\n)
 * instead of Windows newlines (\r\n), causing the first paragraph tags to be misplaced.
 * 
 * The fix was to use markdown-it's renderInline() method instead of render(), which
 * prevents paragraph tags from being generated altogether.
 */

import Passage from '../../lib/Passage.js';
import $ from 'jquery';

// Mock window.story.state for _.template
global.window = {};
window.story = { state: {} };

// Mock jQuery event trigger
$.event = { trigger: jest.fn() };

describe('Issue #186: Windows newline handling', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should not generate paragraph tags with Unix newlines', () => {
        const passage = new Passage(1, 'Test', [], 'First paragraph\n\nSecond paragraph');
        const html = passage.render();
        
        // With renderInline(), no <p> tags should be generated
        expect(html).not.toContain('<p>');
        expect(html).not.toContain('</p>');
        expect(html).toContain('First paragraph');
        expect(html).toContain('Second paragraph');
    });

    it('should not generate paragraph tags with Windows newlines', () => {
        const passage = new Passage(1, 'Test', [], 'First paragraph\r\n\r\nSecond paragraph');
        const html = passage.render();
        
        // With renderInline(), no <p> tags should be generated
        expect(html).not.toContain('<p>');
        expect(html).not.toContain('</p>');
        expect(html).toContain('First paragraph');
        expect(html).toContain('Second paragraph');
    });

    it('should not generate paragraph tags with classic Mac newlines', () => {
        const passage = new Passage(1, 'Test', [], 'First paragraph\r\rSecond paragraph');
        const html = passage.render();
        
        // With renderInline(), no <p> tags should be generated
        expect(html).not.toContain('<p>');
        expect(html).not.toContain('</p>');
        expect(html).toContain('First paragraph');
        expect(html).toContain('Second paragraph');
    });

    it('should handle mixed newline styles without generating paragraph tags', () => {
        const passage = new Passage(1, 'Test', [], 'First\nSecond\r\nThird\rFourth');
        const html = passage.render();
        
        // With renderInline(), no <p> tags should be generated
        expect(html).not.toContain('<p>');
        expect(html).not.toContain('</p>');
        expect(html).toContain('First');
        expect(html).toContain('Second');
        expect(html).toContain('Third');
        expect(html).toContain('Fourth');
    });

    it('should handle single line without generating paragraph tags', () => {
        const passage = new Passage(1, 'Test', [], 'Single line of text');
        const html = passage.render();
        
        // With renderInline(), no <p> tags should be generated
        expect(html).not.toContain('<p>');
        expect(html).not.toContain('</p>');
        expect(html).toBe('Single line of text');
    });

    it('should preserve markdown inline elements without paragraph wrapping (Unix)', () => {
        const passage = new Passage(1, 'Test', [], 'Text with **bold** and *italic*\n\nMore text');
        const html = passage.render();
        
        // Should process markdown inline elements
        expect(html).toContain('<strong>bold</strong>');
        expect(html).toContain('<em>italic</em>');
        
        // But should not wrap in paragraph tags
        expect(html).not.toContain('<p>');
        expect(html).not.toContain('</p>');
    });

    it('should preserve markdown inline elements without paragraph wrapping (Windows)', () => {
        const passage = new Passage(1, 'Test', [], 'Text with **bold** and *italic*\r\n\r\nMore text');
        const html = passage.render();
        
        // Should process markdown inline elements
        expect(html).toContain('<strong>bold</strong>');
        expect(html).toContain('<em>italic</em>');
        
        // But should not wrap in paragraph tags
        expect(html).not.toContain('<p>');
        expect(html).not.toContain('</p>');
    });

    it('should handle empty lines without creating empty paragraph tags (Unix)', () => {
        const passage = new Passage(1, 'Test', [], '\n\nText after empty lines');
        const html = passage.render();
        
        // Should not create empty paragraph tags
        expect(html).not.toContain('<p></p>');
        expect(html).not.toContain('<p>');
        expect(html).toContain('Text after empty lines');
    });

    it('should handle empty lines without creating empty paragraph tags (Windows)', () => {
        const passage = new Passage(1, 'Test', [], '\r\n\r\nText after empty lines');
        const html = passage.render();
        
        // Should not create empty paragraph tags
        expect(html).not.toContain('<p></p>');
        expect(html).not.toContain('<p>');
        expect(html).toContain('Text after empty lines');
    });

    it('should handle trailing newlines without creating paragraph tags (Unix)', () => {
        const passage = new Passage(1, 'Test', [], 'Text with trailing newlines\n\n');
        const html = passage.render();
        
        // Should not create paragraph tags
        expect(html).not.toContain('<p>');
        expect(html).not.toContain('</p>');
    });

    it('should handle trailing newlines without creating paragraph tags (Windows)', () => {
        const passage = new Passage(1, 'Test', [], 'Text with trailing newlines\r\n\r\n');
        const html = passage.render();
        
        // Should not create paragraph tags
        expect(html).not.toContain('<p>');
        expect(html).not.toContain('</p>');
    });
});
