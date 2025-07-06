import either from '../../lib/Misc/either.js';
import _ from 'underscore';

jest.mock('underscore', () => ({
    random: jest.fn(),
}));

describe('either', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns one of the provided arguments', () => {
        _.random.mockReturnValue(2);
        const result = either('A', 'B', 'C', 'D');
        expect(['A', 'B', 'C', 'D']).toContain(result);
        expect(_.random).toHaveBeenCalledWith(3);
    });

    it('flattens arrays in arguments', () => {
        _.random.mockReturnValue(4);
        const result = either('A', 'B', ['C', 'D'], 'E');
        expect(['A', 'B', 'C', 'D', 'E']).toContain(result);
        expect(_.random).toHaveBeenCalledWith(4);
    });

    it('works with only array arguments', () => {
        _.random.mockReturnValue(1);
        const result = either(['X', 'Y', 'Z']);
        expect(['X', 'Y', 'Z']).toContain(result);
        expect(_.random).toHaveBeenCalledWith(2);
    });

    it('works with nested arrays (does not flatten deeply)', () => {
        _.random.mockReturnValue(2);
        const result = either('A', ['B', ['C', 'D']], 'E');
        // ['A', 'B', ['C', 'D'], 'E']
        expect(['A', 'B', ['C', 'D'], 'E']).toContainEqual(result);
        expect(_.random).toHaveBeenCalledWith(3);
    });

    it('returns undefined if no arguments are passed', () => {
        _.random.mockReturnValue(0);
        const result = either();
        expect(result).toBeUndefined();
        expect(_.random).toHaveBeenCalledWith(-1);
    });

    it('returns the only argument if one is passed', () => {
        _.random.mockReturnValue(0);
        const result = either('only');
        expect(result).toBe('only');
        expect(_.random).toHaveBeenCalledWith(0);
    });

    it('returns the only element if one array with one element is passed', () => {
        _.random.mockReturnValue(0);
        const result = either(['single']);
        expect(result).toBe('single');
        expect(_.random).toHaveBeenCalledWith(0);
    });

    it('handles mixed types', () => {
        _.random.mockReturnValue(3);
        const obj = { foo: 'bar' };
        const result = either(1, 'two', [true, obj]);
        expect([1, 'two', true, obj]).toContain(result);
        expect(_.random).toHaveBeenCalledWith(3);
    });
});