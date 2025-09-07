/**
 * @jest-environment jsdom
 */

import Story from '../../lib/Story.js';

jest.mock('lz-string', () => ({
  compressToBase64: jest.fn((str) => `compressed:${str}`),
  // eslint-disable-next-line no-unused-vars
  decompressFromBase64: jest.fn((str) =>
    JSON.stringify({
      state: { foo: 'bar' },
      history: [1, 2],
      checkpointName: 'test'
    })
  ),
}));

describe('Story Complete Coverage Tests', () => {
  let storyData, passage1, passage2;
  let windowEventHandlers = {};
  let storyElementEventHandlers = {};

  beforeEach(() => {
    // Clean up DOM
    document.body.innerHTML = '';
    windowEventHandlers = {};
    storyElementEventHandlers = {};

    // Mock jQuery with comprehensive event handler capture
    global.$ = jest.fn((selector) => {
      const onMock = jest.fn((event, handler) => {
        if (selector === window) {
          windowEventHandlers[event] = handler;
        } else {
          storyElementEventHandlers[event] = handler;
        }
      });
      
      return {
        html: jest.fn().mockReturnValue('console.log("user script");'),
        trigger: jest.fn(),
        on: onMock,
        append: jest.fn(),
        closest: jest.fn(() => ({ data: jest.fn(() => 'testpassage') })),
      };
    });
    global.$.event = { trigger: jest.fn() };

    global._ = {
      isNumber: (x) => typeof x === 'number',
      isString: (x) => typeof x === 'string',
      unescape: (x) => x.replace('%20', ' '),
    };

    // Create mock DOM elements
    storyData = document.createElement('tw-storydata');
    storyData.setAttribute('name', 'Test Story');
    storyData.setAttribute('startnode', '1');

    passage1 = document.createElement('tw-passagedata');
    passage1.setAttribute('pid', '1');
    passage1.setAttribute('name', 'Start');
    passage1.setAttribute('tags', 'tag1 tag2');
    passage1.innerHTML = 'Hello, world!';

    passage2 = document.createElement('tw-passagedata');
    passage2.setAttribute('pid', '2');
    passage2.setAttribute('name', 'Second');
    passage2.setAttribute('tags', '');
    passage2.innerHTML = 'Second passage.';

    storyData.appendChild(passage1);
    storyData.appendChild(passage2);
    document.body.appendChild(storyData);

    // Add required elements
    const twPassage = document.createElement('tw-passage');
    document.body.appendChild(twPassage);

    const twStory = document.createElement('tw-story');
    document.body.appendChild(twStory);

    // Mock user scripts/styles
    const script = document.createElement('script');
    script.setAttribute('type', 'text/twine-javascript');
    script.innerHTML = 'console.log("user script");';
    document.body.appendChild(script);

    const style = document.createElement('style');
    style.setAttribute('type', 'text/twine-css');
    style.innerHTML = 'body { color: red; }';
    document.body.appendChild(style);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();
    window.onerror = null;
  });

  test('error event handler is triggered and executes error logic', () => {
    const htmlMock = jest.fn();
    
    // Create a more specific jQuery mock for this test
    global.$ = jest.fn((selector) => {
      if (selector === 'tw-story') {
        return { html: htmlMock };
      }
      if (selector === window) {
        return {
          on: jest.fn((event, handler) => {
            if (event === 'sm.story.error') {
              // Immediately trigger the error handler to test it
              setTimeout(() => {
                handler.call(story, 
                  { type: 'sm.story.error' }, 
                  { name: 'TestError', message: 'test message' }, 
                  'TestSource'
                );
              }, 0);
            }
          })
        };
      }
      return {
        html: jest.fn().mockReturnValue('console.log("user script");'),
        trigger: jest.fn(),
        on: jest.fn(),
        append: jest.fn(),
        closest: jest.fn(() => ({ data: jest.fn(() => 'testpassage') })),
      };
    });
    global.$.event = { trigger: jest.fn() };

    const story = new Story();
    
    // Wait for the async error handler to execute
    return new Promise((resolve) => {
      setTimeout(() => {
        expect(story.errorMessage).toBe('In TestSource: TestError: test message');
        expect(htmlMock).toHaveBeenCalledWith('In TestSource: TestError: test message');
        resolve();
      }, 10);
    });
  });

  test('popstate event handler with state restores story state', () => {
    const story = new Story();
    story.show = jest.fn();
    story.start();

    // Get the popstate handler and test it
    const popstateHandler = windowEventHandlers['popstate'];
    expect(popstateHandler).toBeDefined();

    const mockEvent = {
      originalEvent: {
        state: {
          state: { test: 'data' },
          history: [1, 2, 3],
          checkpointName: 'checkpoint1'
        }
      }
    };

    popstateHandler.call(story, mockEvent);

    expect(story.state).toEqual({ test: 'data' });
    expect(story.history).toEqual([1, 2, 3]);
    expect(story.checkpointName).toBe('checkpoint1');
    expect(story.show).toHaveBeenCalledWith(3, true);
  });

  test('popstate event handler without state but with long history resets story', () => {
    const story = new Story();
    story.show = jest.fn();
    story.history = [1, 2, 3, 4]; // length > 1
    story.start();

    const popstateHandler = windowEventHandlers['popstate'];
    expect(popstateHandler).toBeDefined();

    const mockEvent = {
      originalEvent: { state: null }
    };

    popstateHandler.call(story, mockEvent);

    expect(story.state).toEqual({});
    expect(story.history).toEqual([]);
    expect(story.checkpointName).toBe('');
    expect(story.show).toHaveBeenCalledWith(1, true);
  });

  test('hashchange event handler calls restore with hash', () => {
    const story = new Story();
    story.restore = jest.fn();
    window.location.hash = '#savehash';
    story.start();

    const hashchangeHandler = windowEventHandlers['hashchange'];
    expect(hashchangeHandler).toBeDefined();

    hashchangeHandler.call(story);

    expect(story.restore).toHaveBeenCalledWith('savehash');
  });

  test('click event handler on passage links calls show', () => {
    const story = new Story();
    story.show = jest.fn();
    
    // Mock the story element to capture the click handler
    const clickHandler = jest.fn();
    story.$storyElement = {
      on: jest.fn((event, selector, handler) => {
        if (event === 'click' && selector === 'a[data-passage]') {
          clickHandler.mockImplementation(handler);
        }
      })
    };
    
    story.start();

    // Simulate click event
    const mockEvent = {
      target: document.createElement('a')
    };

    // Call the handler bound to the story context
    clickHandler.call(story, mockEvent);

    expect(story.show).toHaveBeenCalledWith('testpassage');
  });

  test('window onerror function triggers error event', () => {
    new Story();
    
    const testError = new Error('Test error');
    window.onerror('Error message', 'source.js', 123, 456, testError);

    expect(global.$.event.trigger).toHaveBeenCalledWith('sm.story.error', [testError, 'Browser']);
  });

  test('constructor processes user scripts and styles correctly', () => {
    const htmlMock = jest.fn().mockReturnValue('body { color: red; }');
    // eslint-disable-next-line no-unused-vars
    global.$ = jest.fn((selector) => {
      return {
        html: htmlMock,
        trigger: jest.fn(),
        on: jest.fn(),
        append: jest.fn(),
        closest: jest.fn(() => ({ data: jest.fn(() => 'testpassage') })),
      };
    });
    global.$.event = { trigger: jest.fn() };

    const story = new Story();
    
    expect(story.userScripts).toHaveLength(1);
    expect(story.userStyles).toHaveLength(1);
    expect(story.userStyles[0]).toBe('body { color: red; }');
  });

  test('click handler calls show with unescaped passage name from data attribute', () => {
    const story = new Story();
    story.show = jest.fn();
    
    // Create a simplified test that just verifies the click handler executes
    let capturedClickHandler;
    story.$storyElement = {
      on: jest.fn((event, selector, handler) => {
        if (event === 'click' && selector === 'a[data-passage]') {
          capturedClickHandler = handler;
        }
      })
    };

    story.start();

    // Verify the click handler was set up
    expect(story.$storyElement.on).toHaveBeenCalledWith('click', 'a[data-passage]', expect.any(Function));
    
    // Simulate the click event with mocked dependencies
    const mockEvent = { target: document.createElement('a') };
    capturedClickHandler.call(story, mockEvent);

    expect(story.show).toHaveBeenCalledWith('testpassage');
  });
});
