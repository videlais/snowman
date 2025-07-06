/**
 * @jest-environment jsdom
 */

import Story from '../../lib/Story.js';
import Passage from '../../lib/Passage.js';

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

// Mock jQuery and underscore
// eslint-disable-next-line no-unused-vars
global.$ = jest.fn((selector) => {
  const htmlMock = jest.fn();
  const triggerMock = jest.fn();
  const onMock = jest.fn();
  const appendMock = jest.fn();
  return {
    html: htmlMock,
    trigger: triggerMock,
    on: onMock,
    append: appendMock,
    closest: jest.fn(() => ({ data: jest.fn(() => 1) })),
  };
});
$.event = { trigger: jest.fn() };

global._ = {
  isNumber: (x) => typeof x === 'number',
  isString: (x) => typeof x === 'string',
  unescape: (x) => x,
};

describe('Story', () => {
  let storyData, passage1, passage2;

  beforeEach(() => {
    // Clean up DOM
    document.body.innerHTML = '';

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
    twPassage.setAttribute('id', 'tw-passage');
    document.body.appendChild(twPassage);

    const twStory = document.createElement('tw-story');
    twStory.setAttribute('id', 'tw-story');
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
  });

  test('constructor throws if tw-storydata is missing', () => {
    document.body.innerHTML = '';
    expect(() => new Story()).toThrow('Error: No tw-storydata element found in the document.');
  });

  test('constructor throws if startnode is missing', () => {
    storyData.removeAttribute('startnode');
    expect(() => new Story()).toThrow('Error: No startnode attribute found in the tw-storydata element.');
  });

  test('constructor initializes properties and parses passages', () => {
    const story = new Story();
    expect(story.name).toBe('Test Story');
    expect(story.startPassage).toBe(1);
    expect(Array.isArray(story.passages)).toBe(true);
    expect(story.passages[1]).toBeInstanceOf(Passage);
    expect(story.passages[2]).toBeInstanceOf(Passage);
    expect(story.passages[1].name).toBe('Start');
    expect(story.passages[2].name).toBe('Second');
    expect(story.userScripts.length).toBe(1);
    expect(story.userStyles.length).toBe(1);
  });

  test('passage() returns passage by id or name', () => {
    const story = new Story();
    expect(story.passage(1)).toBeInstanceOf(Passage);
    expect(story.passage('Start')).toBeInstanceOf(Passage);
    expect(story.passage('Nonexistent')).toBeNull();
    expect(story.passage(999)).toBeNull();
  });

  test('render() returns passage HTML', () => {
    const story = new Story();
    story.passages[1].render = jest.fn(() => '<p>Rendered</p>');
    expect(story.render(1)).toBe('<p>Rendered</p>');
    expect(() => story.render('Nonexistent')).toThrow();
  });

  test('show() throws if passage not found', () => {
    const story = new Story();
    expect(() => story.show('Nonexistent')).toThrow();
  });

  test('show() updates history and triggers events', () => {
    const story = new Story();
    story.passages[1].render = jest.fn(() => '<p>Rendered</p>');
    story.history = [];
    story.atCheckpoint = true;
    window.history.pushState = jest.fn();
    window.history.replaceState = jest.fn();
    story.show(1);
    expect(story.history).toContain(1);
    expect($.event.trigger).toHaveBeenCalledWith('sm.checkpoint.added', { name: 1 });
  });

  test('checkpoint() sets checkpointName and triggers event', () => {
    const story = new Story();
    story.checkpoint('foo');
    expect(story.checkpointName).toBe('foo');
    expect(story.atCheckpoint).toBe(true);
    expect($.event.trigger).toHaveBeenCalledWith('sm.checkpoint.adding', { name: 'foo' });
  });

  test('saveHash() returns compressed hash', () => {
    const story = new Story();
    story.state = { foo: 1 };
    story.history = [1, 2];
    story.checkpointName = 'bar';
    const hash = story.saveHash();
    expect(hash.startsWith('compressed:')).toBe(true);
  });

  test('restore() restores state from hash and triggers events', () => {
    const story = new Story();
    story.show = jest.fn();
    const result = story.restore('fakehash');
    expect(result).toBe(true);
    expect(story.state).toEqual({ foo: 'bar' });
    expect(story.history).toEqual([1, 2]);
    expect(story.checkpointName).toBe('test');
    expect($.event.trigger).toHaveBeenCalledWith('sm.restore.success');
  });

  test('restore() triggers failed event on error', () => {
    const story = new Story();
    require('lz-string').decompressFromBase64.mockImplementationOnce(() => { throw new Error('fail'); });
    const result = story.restore('bad');
    expect(result).toBe(false);
    expect($.event.trigger).toHaveBeenCalledWith('sm.restore.failed', expect.any(Object));
  });

  test('start() triggers sm.story.started and shows start passage', () => {
    const story = new Story();
    story.show = jest.fn();
    window.location.hash = '';
    story.restore = jest.fn(() => false);
    story.start();
    expect($.event.trigger).toHaveBeenCalledWith('sm.story.started', { story });
    expect(story.show).toHaveBeenCalledWith(story.startPassage);
  });
});