/**
 * @jest-environment jsdom
 */

import visited from '../../lib/Misc/visited.js';

describe('visited', () => {
    let originalWindow;

    beforeEach(() => {
        // Save original window object
        originalWindow = global.window;
        global.window = {};
    });

    afterEach(() => {
        // Restore original window object
        global.window = originalWindow;
    });

    test('returns 0 if window.story is undefined', () => {
        expect(visited('SomePassage')).toBe(0);
    });

    test('returns 0 if window.story.history is undefined', () => {
        global.window.story = {};
        expect(visited('SomePassage')).toBe(0);
    });

    test('returns 0 if passage is not found', () => {
        global.window.story = {
            history: [],
            passage: jest.fn().mockReturnValue(null),
        };
        expect(visited('NonExistent')).toBe(0);
        expect(global.window.story.passage).toHaveBeenCalledWith('NonExistent');
    });

    test('returns correct count when passage is found by id', () => {
        global.window.story = {
            history: [1, 2, 1, 3, 1],
            passage: jest.fn().mockReturnValue({ id: 1 }),
        };
        expect(visited(1)).toBe(3);
        expect(global.window.story.passage).toHaveBeenCalledWith(1);
    });

    test('returns correct count when passage is found by name', () => {
        global.window.story = {
            history: [5, 6, 5, 7],
            passage: jest.fn().mockReturnValue({ id: 5 }),
        };
        expect(visited('PassageName')).toBe(2);
        expect(global.window.story.passage).toHaveBeenCalledWith('PassageName');
    });

    test('returns 0 if passage id is never in history', () => {
        global.window.story = {
            history: [2, 3, 4],
            passage: jest.fn().mockReturnValue({ id: 1 }),
        };
        expect(visited(1)).toBe(0);
    });

    test('works with default argument', () => {
        global.window.story = {
            history: [0, 0, 1],
            passage: jest.fn().mockReturnValue({ id: "" }),
        };
        expect(visited()).toBe(2);
        expect(global.window.story.passage).toHaveBeenCalledWith("");
    });
});