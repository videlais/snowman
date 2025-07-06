import { parse } from '../lib/linkParse.js';

describe('parse', () => {
    it('throws TypeError if input is not a string', () => {
        expect(() => parse(null)).toThrow(TypeError);
        expect(() => parse(undefined)).toThrow(TypeError);
        expect(() => parse(123)).toThrow(TypeError);
        expect(() => parse({})).toThrow(TypeError);
        expect(() => parse([])).toThrow(TypeError);
    });

    it('returns the same string if there are no links', () => {
        expect(parse('Hello world')).toBe('Hello world');
        expect(parse('No links here!')).toBe('No links here!');
    });

    it('parses [[destination]]', () => {
        expect(parse('Go to [[Home]]')).toBe('Go to <a href="javascript:void(0)" data-passage="Home">Home</a>');
    });

    it('parses [[rename|destination]]', () => {
        expect(parse('Go to [[Start|Home]]')).toBe('Go to <a href="javascript:void(0)" data-passage="Home">Home</a>');
    });

    it('parses [[rename->destination]]', () => {
        expect(parse('Go to [[Click here->Home]]')).toBe('Go to <a href="javascript:void(0)" data-passage="Home">Click here</a>');
    });

    it('parses [[destination<-rename]]', () => {
        expect(parse('Go to [[Home<-Click here]]')).toBe('Go to <a href="javascript:void(0)" data-passage="Click here">Home</a>');
    });

    it('parses multiple links in one string', () => {
        const input = '[[A]] and [[B|C]] and [[D->E]] and [[F<-G]]';
        const expected = '<a href="javascript:void(0)" data-passage="A">A</a> and <a href="javascript:void(0)" data-passage="C">C</a> and <a href="javascript:void(0)" data-passage="E">D</a> and <a href="javascript:void(0)" data-passage="G">F</a>';
        expect(parse(input)).toBe(expected);
    });

    it('returns original text for malformed links', () => {
        expect(parse('[[not closed')).toBe('[[not closed');
        expect(parse('[[foo|bar|baz]]')).toBe('[[foo|bar|baz]]');
        expect(parse('[[foo->bar->baz]]')).toBe('[[foo->bar->baz]]');
        expect(parse('[[foo<-bar<-baz]]')).toBe('[[foo<-bar<-baz]]');
    });

    it('handles links with spaces and special characters', () => {
        expect(parse('[[My Page]]')).toBe('<a href="javascript:void(0)" data-passage="My Page">My Page</a>');
        expect(parse('[[Go->My Page!]]')).toBe('<a href="javascript:void(0)" data-passage="My Page!">Go</a>');
        expect(parse('[[My Page<-Go!]]')).toBe('<a href="javascript:void(0)" data-passage="Go!">My Page</a>');
        expect(parse('[[Go|My Page!]]')).toBe('<a href="javascript:void(0)" data-passage="My Page!">My Page!</a>');
    });

    it('does not replace text outside of link patterns', () => {
        expect(parse('[[A]] is not [[B')).toBe('<a href="javascript:void(0)" data-passage="A">A</a> is not [[B');
    });

    it('should return empty string when given empty string', () => {
        expect(parse('')).toBe('');
    });
});