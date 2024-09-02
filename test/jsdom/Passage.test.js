const Passage = require('../../src/Passage.js');

describe('constructor()', () => {
  it('Should contain default name when initialized with no arguments', () => {
    const p = new Passage();
    expect(p.name).toBe('Default');
  });

  it('Should contain default tags when initialized with no arguments', () => {
    const p = new Passage();
    expect(p.tags.length).toBe(0);
  });

  it('Should contain default source when initialized with no arguments', () => {
    const p = new Passage();
    expect(p.source).toBe('');
  });
});
