const Passage = require('../lib/Passage.js');

describe('constructor()', () => {
  it('Should contain default values when initialized with no arguments', () => {
    const p = new Passage();
    expect(p.name).toBe('Default');
  });
});

describe('render()', () => {
  beforeEach(() => {
    // Create empty Story instance
    window.story = {};
    // Create empty story state
    window.story.state = {};
  });

  it('Should passthrough any <script> tags', () => {
    const p = new Passage(1, 'Default', [], '<div><script>console.log("Hello world")</script></div>');
    expect(p.render()).toBe('<div><script>console.log("Hello world")</script></div>');
  });

  it('Should not trigger markdown code blocks', () => {
    const p = new Passage(1, 'Default', [], '<% if(window.setup.example) { %><div>[[Testing]]</div><% } %>');
    window.setup = {};
    window.setup.example = true;
    expect(p.render()).toBe('<div><a role="link" data-passage="Testing">Testing</a></div>');
  });

  it('Should throw error if source rendering fails from EJS', () => {
    const p = new Passage(1, 'Default', [], '<%= testing %>');
    expect(() => p.render()).toThrow();
  });
});
