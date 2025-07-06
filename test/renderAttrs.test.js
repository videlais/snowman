import { renderAttrs } from '../lib/renderAttrs.js';

describe('renderAttrs', () => {
    it('returns empty string for empty input', () => {
        expect(renderAttrs('')).toBe('');
    });

    it('renders style for "-" shorthand', () => {
        expect(renderAttrs('-')).toBe('style="display:none"');
        expect(renderAttrs('--')).toBe('style="display:none" style="display:none"');
    });

    it('renders href for "0" shorthand', () => {
        expect(renderAttrs('0')).toBe('href="javascript:void(0)"');
        expect(renderAttrs('00')).toBe('href="javascript:void(0)" href="javascript:void(0)"');
    });

    it('renders both "-" and "0" shorthands', () => {
        expect(renderAttrs('-0')).toBe('style="display:none" href="javascript:void(0)"');
        expect(renderAttrs('0-')).toBe('href="javascript:void(0)" style="display:none"');
    });

    it('renders id attribute', () => {
        expect(renderAttrs('#foo')).toBe('id="foo"');
        expect(renderAttrs('-#bar')).toBe('style="display:none" id="bar"');
    });

    it('renders class attribute', () => {
        expect(renderAttrs('.foo')).toBe('class="foo"');
        expect(renderAttrs('.foo.bar')).toBe('class="foo bar"');
        expect(renderAttrs('-.foo.bar')).toBe('style="display:none" class="foo bar"');
    });

    it('renders id and class together', () => {
        expect(renderAttrs('#foo.bar')).toBe('id="foo" class="bar"');
        expect(renderAttrs('.foo#bar')).toBe('id="bar" class="foo"');
        expect(renderAttrs('.foo#bar.baz')).toBe('id="bar" class="foo baz"');
    });

    it('renders all shorthands together', () => {
        expect(renderAttrs('-0#foo.bar.baz')).toBe(
            'style="display:none" href="javascript:void(0)" id="foo" class="bar baz"'
        );
    });

    it('ignores invalid shorthands', () => {
        expect(renderAttrs('xyz')).toBe('');
        expect(renderAttrs('1#foo')).toBe('id="foo"');
    });

    it('handles multiple ids, last one wins', () => {
        expect(renderAttrs('#foo#bar')).toBe('id="bar"');
        expect(renderAttrs('.a#foo.b#bar.c')).toBe('id="bar" class="a b c"');
    });

    it('does not add id or class if not present', () => {
        // Lines 47-51: if (id !== null) { ... } if (classes.length > 0) { ... }
        // If neither id nor class is present, nothing should be added.
        expect(renderAttrs('-0')).toBe('style="display:none" href="javascript:void(0)"');
        expect(renderAttrs('')).toBe('');
    });

    it('adds only id if class is not present', () => {
        expect(renderAttrs('#onlyid')).toBe('id="onlyid"');
        expect(renderAttrs('-#onlyid')).toBe('style="display:none" id="onlyid"');
    });

    it('adds only class if id is not present', () => {
        expect(renderAttrs('.onlyclass')).toBe('class="onlyclass"');
        expect(renderAttrs('0.onlyclass')).toBe('href="javascript:void(0)" class="onlyclass"');
    });

    it('trims trailing spaces in result', () => {
        // Should not have trailing spaces even if only one attribute is present
        expect(renderAttrs('-')).toBe('style="display:none"');
        expect(renderAttrs('.foo')).toBe('class="foo"');
        expect(renderAttrs('#foo')).toBe('id="foo"');
    });
});