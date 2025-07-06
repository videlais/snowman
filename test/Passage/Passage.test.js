/**
 * @jest-environment jsdom
 */

import Passage from '../../lib/Passage.js';
import $ from 'jquery';

// Mock window.story.state for _.template
global.window = {};
window.story = { state: { foo: 'bar' } };

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
});