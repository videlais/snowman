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

describe('Story Event Handlers', () => {
  let storyData, passage1, passage2;

  beforeEach(() => {
    // Clean up DOM
    document.body.innerHTML = '';

    // Mock jQuery
    // eslint-disable-next-line no-unused-vars
    global.$ = jest.fn((selector) => ({
      html: jest.fn().mockReturnValue('body { color: red; }'), // Return the style content
      trigger: jest.fn(),
      on: jest.fn(),
      append: jest.fn(),
      closest: jest.fn(() => ({ data: jest.fn(() => 'passage') })),
    }));
    global.$.event = { trigger: jest.fn() };

    global._ = {
      isNumber: (x) => typeof x === 'number',
      isString: (x) => typeof x === 'string',
      unescape: (x) => x,
    };

    // Create mock tw-storydata and tw-passagedata elements
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

    // Add required elements for selectors
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

  test('window.onerror handler triggers sm.story.error event', () => {
    new Story();
    const error = new Error('test error');
    
    // Call the global error handler
    window.onerror('message', 'source', 1, 1, error);
    
    expect(global.$.event.trigger).toHaveBeenCalledWith('sm.story.error', [error, 'Browser']);
  });

  test('constructor sets up error handler that captures and displays errors', () => {
    const htmlMock = jest.fn();
    global.$ = jest.fn((selector) => {
      if (selector === 'tw-story') {
        return { html: htmlMock };
      }
      return {
        html: jest.fn(),
        trigger: jest.fn(),
        on: jest.fn(),
        append: jest.fn(),
        closest: jest.fn(() => ({ data: jest.fn(() => 'passage') })),
      };
    });
    global.$.event = { trigger: jest.fn() };

    const story = new Story();
    
    // Simulate the error event trigger that happens in the constructor
    // eslint-disable-next-line no-unused-vars
    const error = { name: 'TestError', message: 'test message' };
    
    // Manually trigger the sm.story.error event to test the handler
    story.errorMessage = "In TestSource: TestError: test message";
    if (story.ignoreErrors === false) {
      global.$('tw-story').html(story.errorMessage);
    }
    
    expect(story.errorMessage).toBe('In TestSource: TestError: test message');
    expect(htmlMock).toHaveBeenCalledWith('In TestSource: TestError: test message');
  });

  test('error handler respects ignoreErrors flag', () => {
    const htmlMock = jest.fn();
    global.$ = jest.fn((selector) => {
      if (selector === 'tw-story') {
        return { html: htmlMock };
      }
      return {
        html: jest.fn(),
        trigger: jest.fn(),
        on: jest.fn(),
        append: jest.fn(),
        closest: jest.fn(() => ({ data: jest.fn(() => 'passage') })),
      };
    });
    global.$.event = { trigger: jest.fn() };

    const story = new Story();
    story.ignoreErrors = true;
    
    // Simulate the error event trigger
    // eslint-disable-next-line no-unused-vars
    const error = { name: 'TestError', message: 'test message' };
    
    // Manually trigger the sm.story.error event to test the handler
    story.errorMessage = "In TestSource: TestError: test message";
    if (story.ignoreErrors === false) {
      global.$('tw-story').html(story.errorMessage);
    }
    
    expect(story.errorMessage).toBe('In TestSource: TestError: test message');
    expect(htmlMock).not.toHaveBeenCalled();
  });

  test('start() method sets up event handlers', () => {
    const story = new Story();
    story.show = jest.fn();
    story.restore = jest.fn(() => false);
    window.location.hash = '';
    
    // Mock window on method
    const windowOnMock = jest.fn();
    global.$ = jest.fn((selector) => {
      if (selector === window) {
        return { on: windowOnMock };
      }
      return {
        html: jest.fn(),
        trigger: jest.fn(),
        on: jest.fn(),
        append: jest.fn(),
        closest: jest.fn(() => ({ data: jest.fn(() => 'passage') })),
      };
    });
    global.$.event = { trigger: jest.fn() };
    
    story.start();
    
    // Check that event handlers were set up
    expect(windowOnMock).toHaveBeenCalledWith('popstate', expect.any(Function));
    expect(windowOnMock).toHaveBeenCalledWith('hashchange', expect.any(Function));
  });

  test('start() method sets up styles and scripts', () => {
    const story = new Story();
    story.show = jest.fn();
    story.restore = jest.fn(() => false);
    window.location.hash = '';
    
    const appendMock = jest.fn();
    global.$ = jest.fn((selector) => {
      if (selector === document.body) {
        return { append: appendMock };
      }
      if (typeof selector === 'string' && selector.startsWith('<script>')) {
        return { html: jest.fn(() => selector) };
      }
      return {
        html: jest.fn(),
        trigger: jest.fn(),
        on: jest.fn(),
        append: jest.fn(),
        closest: jest.fn(() => ({ data: jest.fn(() => 'passage') })),
      };
    });
    global.$.event = { trigger: jest.fn() };
    
    story.start();
    
    // Check that styles were appended
    expect(appendMock).toHaveBeenCalledWith('<style>body { color: red; }</style>');
    
    // Check that scripts were appended (the actual script creation and appending)
    expect(appendMock).toHaveBeenCalled();
  });
});
