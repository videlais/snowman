const Passage = require('../lib/Passage.js');

describe('constructor()', () => {
  test('Should contain default values when initialized with no arguments', () => {
    const p = new Passage();
    expect(p.name).toBe('Default');
  });
});

describe('#render()', () => {
  beforeEach(() => {
    // Setup a dummy window.story.state
    window.story = {
      state: {}
    };
  });

  test('Should render empty string', () => {
    const p = new Passage();
    expect(p.render('')).toBe('');
  });

  test('Should passthrough any <script> tags', () => {
    const p = new Passage();
    expect(p.render('<div><script>console.log("Hello world")</script></div>')).toBe('<div><script>console.log("Hello world")</script></div>');
  });

  test('Should not trigger markdown code blocks', () => {
    const p = new Passage();
    window.setup = {};
    window.setup.example = true;
    const test = '<% if(window.setup.example) { %><div>[[Testing]]</div><% } %>';
    expect(p.render(test)).toBe('<div><a role="link" data-passage="Testing">Testing</a></div>');
  });
});
