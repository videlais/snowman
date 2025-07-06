/**
 * @jest-environment jsdom
 */

import renderToSelector from '../../lib/Misc/renderToSelector.js';

describe('renderToSelector', () => {
    let originalStory;
    let originalQuerySelector;

    beforeEach(() => {
        // Ensure window.story exists
        originalStory = window.story;
        if (!window.story) {
            window.story = {};
        }
        window.story.passage = jest.fn();

        // Mock document.querySelector
        originalQuerySelector = document.querySelector;
        document.querySelector = jest.fn();
    });

    afterEach(() => {
        if (originalStory === undefined) {
            delete window.story;
        } else {
            window.story = originalStory;
        }
        document.querySelector = originalQuerySelector;
        jest.clearAllMocks();
    });

    it('renders passage content to the selector when passage exists', () => {
        const mockRender = jest.fn().mockReturnValue('Rendered Passage');
        const mockPassage = { render: mockRender };
        window.story.passage.mockReturnValue(mockPassage);

        const mockElement = { innerHTML: '' };
        document.querySelector.mockReturnValue(mockElement);

        renderToSelector('#test', 'PassageName');

        expect(window.story.passage).toHaveBeenCalledWith('PassageName');
        expect(document.querySelector).toHaveBeenCalledWith('#test');
        expect(mockRender).toHaveBeenCalled();
        expect(mockElement.innerHTML).toBe('Rendered Passage');
    });

    it('does nothing if passage does not exist', () => {
        window.story.passage.mockReturnValue(null);

        renderToSelector('#test', 'MissingPassage');

        expect(window.story.passage).toHaveBeenCalledWith('MissingPassage');
        expect(document.querySelector).not.toHaveBeenCalled();
    });

});