/**
 * @jest-environment jsdom
 */

import hasVisited from '../../lib/Misc/hasVisited.js';

describe('hasVisited', () => {
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

    function mockStory({ history = [], passages = {} } = {}) {
        global.window.story = {
            history,
            passage: jest.fn((idOrName) => {
                // Accepts either id or name
                if (typeof idOrName === 'number') {
                    return passages[idOrName] || null;
                }
                // Search by name
                const found = Object.values(passages).find(p => p.name === idOrName);
                return found || null;
            }),
            passageData: passages,
        };
    }

    it('returns false if search is empty array', () => {
        mockStory();
        expect(hasVisited([])).toBe(false);
    });

    it('returns false if window.story is undefined', () => {
        expect(hasVisited(['foo'])).toBe(false);
    });

    it('returns false if window.story.history is undefined', () => {
        global.window.story = {};
        expect(hasVisited(['foo'])).toBe(false);
    });

    it('returns false if window.story.passage is undefined', () => {
        global.window.story = { history: [] };
        expect(hasVisited(['foo'])).toBe(false);
    });

    it('returns false if window.story.history is not an array', () => {
        global.window.story = { history: {}, passage: jest.fn() };
        expect(hasVisited(['foo'])).toBe(false);
    });

    it('returns false if passage is not found', () => {
        mockStory({ history: [1], passages: { 1: { id: 1, name: 'bar' } } });
        expect(hasVisited(['foo'])).toBe(false);
    });

    it('returns true if passage by name has been visited', () => {
        mockStory({ history: [1], passages: { 1: { id: 1, name: 'foo' } } });
        expect(hasVisited(['foo'])).toBe(true);
    });

    it('returns true if passage by id has been visited', () => {
        mockStory({ history: [2], passages: { 2: { id: 2, name: 'bar' } } });
        expect(hasVisited([2])).toBe(true);
    });

    it('returns false if passage by id has not been visited', () => {
        mockStory({ history: [1], passages: { 2: { id: 2, name: 'bar' } } });
        expect(hasVisited([2])).toBe(false);
    });

    it('returns true if all passages in array have been visited', () => {
        mockStory({
            history: [1, 2],
            passages: { 1: { id: 1, name: 'foo' }, 2: { id: 2, name: 'bar' } }
        });
        expect(hasVisited(['foo', 'bar'])).toBe(true);
    });

    it('returns false if any passage in array has not been visited', () => {
        mockStory({
            history: [1],
            passages: { 1: { id: 1, name: 'foo' }, 2: { id: 2, name: 'bar' } }
        });
        expect(hasVisited(['foo', 'bar'])).toBe(false);
    });

    it('converts non-array search to array', () => {
        mockStory({ history: [1], passages: { 1: { id: 1, name: 'foo' } } });
        expect(hasVisited('foo')).toBe(true);
    });

    it('returns false if passage is null', () => {
        mockStory({ history: [1], passages: { 1: { id: 1, name: 'foo' } } });
        global.window.story.passage.mockReturnValueOnce(null);
        expect(hasVisited(['baz'])).toBe(false);
    });

    it('returns false if no arguments are passed', () => {
        mockStory({ history: [1], passages: { 1: { id: 1, name: 'foo' } } });
        expect(hasVisited()).toBe(false);
    });
});
