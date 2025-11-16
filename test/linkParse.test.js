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
        const text = 'Go to [[Start|Home]]';
        const result = parse(text);
        expect(result).toBe('Go to <a href="javascript:void(0)" data-passage="Home">Start</a>');
    });

    it('parses [[rename->destination]]', () => {
        expect(parse('Go to [[Click here->Home]]')).toBe('Go to <a href="javascript:void(0)" data-passage="Home">Click here</a>');
    });

    it('parses [[destination<-rename]]', () => {
        expect(parse('Go to [[Home<-Click here]]')).toBe('Go to <a href="javascript:void(0)" data-passage="Click here">Home</a>');
    });

    it('parses multiple links in one string', () => {
        const text = '[[A]] and [[B|C]] and [[D|E]] and [[F|G]]';
        const result = parse(text);
        expect(result).toBe('<a href="javascript:void(0)" data-passage="A">A</a> and <a href="javascript:void(0)" data-passage="C">B</a> and <a href="javascript:void(0)" data-passage="E">D</a> and <a href="javascript:void(0)" data-passage="G">F</a>');
    });

    it('returns original text for malformed links', () => {
        expect(parse('[[not closed')).toBe('[[not closed');
        expect(parse('[[foo|bar|baz]]')).toBe('[[foo|bar|baz]]');
        expect(parse('[[foo->bar->baz]]')).toBe('[[foo->bar->baz]]');
        expect(parse('[[foo<-bar<-baz]]')).toBe('[[foo<-bar<-baz]]');
    });

    it('handles links with spaces and special characters', () => {
        const text = '[[Go|My Page!]]';
        const result = parse(text);
        expect(result).toBe('<a href="javascript:void(0)" data-passage="My Page!">Go</a>');
    });

    it('does not replace text outside of link patterns', () => {
        expect(parse('[[A]] is not [[B')).toBe('<a href="javascript:void(0)" data-passage="A">A</a> is not [[B');
    });

    it('should return empty string when given empty string', () => {
        expect(parse('')).toBe('');
    });
});