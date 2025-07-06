/**
 * @jest-environment jsdom
 */

import getStyles from '../../lib/Misc/getStyles.js';
import jquery from 'jquery';

jest.mock('jquery', () => {
    const originalJquery = jest.requireActual('jquery');
    // Create a mock function for jQuery
    const mockJquery = jest.fn((selector) => {
        // Print the selector for debugging
        console.log('jQuery called with selector:', selector);
        return {
            appendTo: jest.fn()
        };
    });
    // Attach a mock for .get
    mockJquery.get = jest.fn();
    // Copy over any other properties from the real jQuery if needed
    Object.assign(mockJquery, originalJquery);
    return mockJquery;
});

describe('getStyles', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Clear head for each test
        document.head.innerHTML = '';
        // Reset the default mock implementation for jQuery
        jquery.mockImplementation((selector) => {
            // Print the selector for debugging
            console.log('jQuery called with selector:', selector);
            return {
                appendTo: jest.fn()
            };
        });
    });

    it('throws TypeError if argument is not an array', () => {
        expect(() => getStyles('not-an-array')).toThrow(TypeError);
        expect(() => getStyles({})).toThrow(TypeError);
        expect(() => getStyles(123)).toThrow(TypeError);
    });

    it('returns null if array is empty', () => {
        expect(getStyles([])).toBeNull();
    });

    it('returns null if all files fail to load', async () => {
        // Mock jquery.get first
        jquery.get = jest.fn();
        // Mock jquery.get.mockImplementation to always fail
        jquery.get.mockImplementation((url, success, error) => {
            if (error) error();
        });
        const files = ['file1.css', 'file2.css'];
        // Test with the mock
        const result = await getStyles(files);
        expect(result).toBeNull();
    });

    it('returns null if document.head and getElementsByTagName both do not exist', async () => {
        // Save original document.head and getElementsByTagName
        const originalHead = document.head;
        const originalGetElementsByTagName = document.getElementsByTagName;

        // Remove document.head and mock getElementsByTagName to return empty array
        Object.defineProperty(document, 'head', { value: null, configurable: true });
        document.getElementsByTagName = jest.fn(() => []);

        const files = ['file1.css'];
        const result = getStyles(files);
        expect(result).toBeNull();

        // Restore originals
        Object.defineProperty(document, 'head', { value: originalHead, configurable: true });
        document.getElementsByTagName = originalGetElementsByTagName;
    });

    it('returns undefined if at least one CSS file loads successfully', async () => {
        // Mock jquery.get to succeed for the first file and fail for the second
        jquery.get = jest.fn();
        jquery.get
            .mockImplementationOnce((url, success) => {
                if (success) success('body { color: red; }');
            })
            .mockImplementationOnce((url, success, error) => {
                if (error) error();
            });
        const files = ['file1.css', 'file2.css'];
        const result = await getStyles(files);
        expect(result).toBeUndefined();
        // Only one style should be appended
        const styles = document.head.querySelectorAll('style');
        expect(styles.length).toBe(1);
        expect(styles[0].textContent).toBe('body { color: red; }');
    });

    it('appends multiple style elements when multiple CSS files load successfully', async () => {
        // Mock jquery.get to succeed for both files
        jquery.get = jest.fn();
        jquery.get
            .mockImplementationOnce((url, success) => {
                if (success) success('body { background: blue; }');
            })
            .mockImplementationOnce((url, success) => {
                if (success) success('p { font-size: 16px; }');
            });
        const files = ['file1.css', 'file2.css'];
        const result = await getStyles(files);
        expect(result).toBeUndefined();
        const styles = document.head.querySelectorAll('style');
        expect(styles.length).toBe(2);
        expect(styles[0].textContent).toBe('body { background: blue; }');
        expect(styles[1].textContent).toBe('p { font-size: 16px; }');
    });

    it('handles empty CSS file content gracefully', async () => {
        // Mock jquery.get to succeed with empty content
        jquery.get = jest.fn((url, success) => {
            if (success) success('');
        });
        const files = ['file1.css'];
        const result = await getStyles(files);
        expect(result).toBeUndefined();
        const styles = document.head.querySelectorAll('style');
        expect(styles.length).toBe(1);
        expect(styles[0].textContent).toBe('');
    });

    it('rejects if jquery.get throws synchronously', async () => {
        // This covers line 34: the .fail() branch if .get throws
        jquery.get = jest.fn(() => { throw new Error('Synchronous error'); });
        const files = ['file1.css'];
        const result = await getStyles(files);
        expect(result).toBeNull();
        // No style should be appended
        const styles = document.head.querySelectorAll('style');
        expect(styles.length).toBe(0);
    });

});