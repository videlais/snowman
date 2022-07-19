const Storylets = require('../src/Storylets.js');
const Story = require('../src/Story.js');
const $ = require('jquery');
const State = require('../src/State.js');

describe('Storylets', () => {
  describe('constructor()', () => {
    it('Should have empty collection if run by itself', () => {
      const s = new Storylets();
      expect(s.passages.length).toBe(0);
    });

    it('Should ignore non-array arguments', () => {
      const s = new Storylets(1);
      expect(s.passages.length).toBe(0);
    });

    it('Should ignore array of objects without source property', () => {
      const s = new Storylets([
        {
          example: 1
        },
        {
          example: 2
        }
      ]);
      expect(s.passages.length).toBe(0);
    });

    it('Should have two cards from elements', () => {
      $(document.body).html(`
            <tw-storydata name="Test" startnode="1" creator="extwee" creator-version="1.2.3">
              <tw-passagedata pid="1" name="Test Passage" tags="storylet">
                <requirements>
                    {
                        "test": 1
                    }
                </requirements>
                <p>First</p>
              </tw-passagedata>
              <tw-passagedata pid="2" name="Test Passage 2" tags="storylet">
                <requirements>
                    {
                        "test": 2
                    }
                </requirements>
                <p>Second</p>
              </tw-passagedata>
              <tw-passagedata pid="3" name="Test Passage 3" tags="">
              </tw-passagedata>
              <script type="text/twine-javascript">
              // Set s.test to 1
              s.test = 1;
              </script>
              <style type="text/twine-css"></style>
           </tw-storydata>
           <tw-story>
           <tw-sidebar>
              <tw-icon tabindex="0" alt="Undo" title="Undo">↶</tw-icon>
              <tw-icon tabindex="1" alt="Redo" title="Redo">↷</tw-icon>
            </tw-sidebar>
            <tw-passage class="passage" aria-live="polite"></tw-passage></tw-story>`);
      // Reset State
      State.reset();
      // Reset story
      window.Story = new Story();
      // Start a new story
      window.Story.start();
      const s = window.Story.storylets;
      expect(s.passages.length).toBe(2);
    });

    it('Should have no cards from elements', () => {
      $(document.body).html(`
            <tw-storydata name="Test" startnode="1" creator="extwee" creator-version="1.2.3">
              <tw-passagedata pid="1" name="Test Passage" tags="">
                <p>First</p>
              </tw-passagedata>
              <tw-passagedata pid="2" name="Test Passage 2" tags="">
                <p>Second</p>
              </tw-passagedata>
              <script type="text/twine-javascript"></script>
              <style type="text/twine-css"></style>
           </tw-storydata>
           <tw-story>
           <tw-sidebar>
              <tw-icon tabindex="0" alt="Undo" title="Undo">↶</tw-icon>
              <tw-icon tabindex="1" alt="Redo" title="Redo">↷</tw-icon>
            </tw-sidebar>
            <tw-passage class="passage" aria-live="polite"></tw-passage></tw-story>`);
      // Reset State
      State.reset();
      // Reset story
      window.Story = new Story();
      // Start a new story
      window.Story.start();
      const s = window.Story.storylets;
      // No elements were tagged with 'storylet'
      expect(s.passages.length).toBe(0);
    });

    it('Should remove <requirements> from passage source', () => {
      $(document.body).html(`
              <tw-storydata name="Test" startnode="1" creator="extwee" creator-version="1.2.3">
                <tw-passagedata pid="1" name="Test Passage" tags="storylet">
                    <requirements>
                        {
                            "test": 1
                        }
                    </requirements>
                    <p>First</p>
                </tw-passagedata>
                <script type="text/twine-javascript"></script>
                <style type="text/twine-css"></style>
             </tw-storydata>
             <tw-story>
             <tw-sidebar>
                <tw-icon tabindex="0" alt="Undo" title="Undo">↶</tw-icon>
                <tw-icon tabindex="1" alt="Redo" title="Redo">↷</tw-icon>
              </tw-sidebar>
              <tw-passage class="passage" aria-live="polite"></tw-passage></tw-story>`);
      // Reset State
      State.reset();
      // Reset story
      window.Story = new Story();
      // Start a new story
      window.Story.start();
      const s = window.Story.storylets;
      // Retrieve 'Test Passage'.
      const passage = window.Story.getPassageByName('Test Passage');
      // One card.
      expect(s.passages.length).toBe(1);
      // <requirement> should not be in the source.
      expect(passage.source.includes('<requirements>')).toBe(false);
    });

    it('Should generate empty requirements object if <requirements> has no content', () => {
      $(document.body).html(`
              <tw-storydata name="Test" startnode="1" creator="extwee" creator-version="1.2.3">
                <tw-passagedata pid="1" name="Test Passage" tags="storylet">
                <requirements></requirements>
                    <p>First</p>
                </tw-passagedata>
                <script type="text/twine-javascript"></script>
                <style type="text/twine-css"></style>
             </tw-storydata>
             <tw-story>
             <tw-sidebar>
                <tw-icon tabindex="0" alt="Undo" title="Undo">↶</tw-icon>
                <tw-icon tabindex="1" alt="Redo" title="Redo">↷</tw-icon>
              </tw-sidebar>
              <tw-passage class="passage" aria-live="polite"></tw-passage></tw-story>`);
      // Reset State
      State.reset();
      // Reset story.
      window.Story = new Story();
      // Start a new story.
      window.Story.start();
      // Create new collection.
      const s = window.Story.storylets;
      // Grab first entry in Storylets collection.
      const p = s.passages[0];
      // Should have no properties in its requirements.
      expect(Object.keys(p.requirements).length).toBe(0);
    });
  });

  describe('getAvailablePassages()', () => {
    it('Should return one card available', () => {
      $(document.body).html(`
            <tw-storydata name="Test" startnode="1" creator="extwee" creator-version="1.2.3">
              <tw-passagedata pid="1" name="Test Passage" tags="storylet">
                <requirements>
                    {
                        "test": 1
                    }
                </requirements>
                <p>First</p>
              </tw-passagedata>
              <tw-passagedata pid="2" name="Test Passage 2" tags="">
                <p>Second</p>
              </tw-passagedata>
              <script type="text/twine-javascript">
              s.test = 1;
              </script>
              <style type="text/twine-css"></style>
           </tw-storydata>
           <tw-story>
           <tw-sidebar>
              <tw-icon tabindex="0" alt="Undo" title="Undo">↶</tw-icon>
              <tw-icon tabindex="1" alt="Redo" title="Redo">↷</tw-icon>
            </tw-sidebar>
            <tw-passage class="passage" aria-live="polite"></tw-passage></tw-story>`);
      // Reset State
      State.reset();
      // Reset story
      window.Story = new Story();
      // Start a new story
      window.Story.start();
      const s = window.Story.storylets;
      // Only one card(passage) should be available.
      expect(s.getAvailablePassages().length).toBe(1);
    });

    it('Should return two cards available', () => {
      $(document.body).html(`
            <tw-storydata name="Test" startnode="1" creator="extwee" creator-version="1.2.3">
              <tw-passagedata pid="1" name="Test Passage" tags="storylet">
                <requirements>
                    {
                        "test": 1
                    }
                </requirements>
                <p>First</p>
              </tw-passagedata>
              <tw-passagedata pid="2" name="Test Passage 2" tags="storylet">
                <requirements>
                    {
                        "test": 1
                    }
                </requirements>
                <p>Second</p>
              </tw-passagedata>
              <script type="text/twine-javascript">
              s.test = 1;
              </script>
              <style type="text/twine-css"></style>
           </tw-storydata>
           <tw-story>
           <tw-sidebar>
              <tw-icon tabindex="0" alt="Undo" title="Undo">↶</tw-icon>
              <tw-icon tabindex="1" alt="Redo" title="Redo">↷</tw-icon>
            </tw-sidebar>
            <tw-passage class="passage" aria-live="polite"></tw-passage></tw-story>`);
      // Reset State
      State.reset();
      // Reset story
      window.Story = new Story();
      // Start a new story
      window.Story.start();
      // Create new collection
      const s = window.Story.storylets;
      // Only one card(passage) should be available.
      expect(s.getAvailablePassages().length).toBe(2);
    });

    it('Should return zero available', () => {
      $(document.body).html(`
              <tw-storydata name="Test" startnode="1" creator="extwee" creator-version="1.2.3">
                <tw-passagedata pid="1" name="Test Passage" tags="storylet">
                  <requirements>
                      {
                          "test": 2
                      }
                  </requirements>
                  <p>First</p>
                </tw-passagedata>
                <tw-passagedata pid="2" name="Test Passage 2" tags="storylet">
                  <requirements>
                      {
                          "test": 2
                      }
                  </requirements>
                  <p>Second</p>
                </tw-passagedata>
                <script type="text/twine-javascript">
                s.test = 1;
                </script>
                <style type="text/twine-css"></style>
             </tw-storydata>
             <tw-story>
             <tw-sidebar>
                <tw-icon tabindex="0" alt="Undo" title="Undo">↶</tw-icon>
                <tw-icon tabindex="1" alt="Redo" title="Redo">↷</tw-icon>
              </tw-sidebar>
              <tw-passage class="passage" aria-live="polite"></tw-passage></tw-story>`);
      // Reset State
      State.reset();
      // Reset story
      window.Story = new Story();
      // Start a new story
      window.Story.start();
      const s = window.Story.storylets;
      // No cards should be available.
      expect(s.getAvailablePassages().length).toBe(0);
    });

    it('Should return two available', () => {
      $(document.body).html(`
                <tw-storydata name="Test" startnode="1" creator="extwee" creator-version="1.2.3">
                  <tw-passagedata pid="1" name="Test Passage" tags="storylet">
                    <requirements>
                        {
                            "test": {
                                "$gt": 1
                            }
                        }
                    </requirements>
                    <p>First</p>
                  </tw-passagedata>
                  <tw-passagedata pid="2" name="Test Passage 2" tags="storylet">
                    <requirements>
                        {
                            "test": {
                                "$gt": 1
                            }
                        }
                    </requirements>
                    <p>Second</p>
                  </tw-passagedata>
                  <script type="text/twine-javascript">
                  s.test = 2;
                  </script>
                  <style type="text/twine-css"></style>
               </tw-storydata>
               <tw-story>
               <tw-sidebar>
                  <tw-icon tabindex="0" alt="Undo" title="Undo">↶</tw-icon>
                  <tw-icon tabindex="1" alt="Redo" title="Redo">↷</tw-icon>
                </tw-sidebar>
                <tw-passage class="passage" aria-live="polite"></tw-passage></tw-story>`);
      // Reset State
      State.reset();
      // Reset story.
      window.Story = new Story();
      // Start a new story.
      window.Story.start();
      // Create new collection.
      const s = window.Story.storylets;
      // Two cards should be available.
      expect(s.getAvailablePassages().length).toBe(2);
    });

    it('Should return one available', () => {
      $(document.body).html(`
                  <tw-storydata name="Test" startnode="1" creator="extwee" creator-version="1.2.3">
                    <tw-passagedata pid="1" name="Test Passage" tags="storylet">
                      <requirements>
                          {
                              "test": true
                          }
                      </requirements>
                      <p>First</p>
                    </tw-passagedata>
                    <tw-passagedata pid="2" name="Test Passage 2" tags="storylet">
                      <requirements>
                          {
                              "test": {
                                  "$gt": 1
                              }
                          }
                      </requirements>
                      <p>Second</p>
                    </tw-passagedata>
                    <script type="text/twine-javascript">
                    s.test = true;
                    </script>
                    <style type="text/twine-css"></style>
                 </tw-storydata>
                 <tw-story>
                 <tw-sidebar>
                    <tw-icon tabindex="0" alt="Undo" title="Undo">↶</tw-icon>
                    <tw-icon tabindex="1" alt="Redo" title="Redo">↷</tw-icon>
                  </tw-sidebar>
                  <tw-passage class="passage" aria-live="polite"></tw-passage></tw-story>`);
      // Reset State
      State.reset();
      // Reset story.
      window.Story = new Story();
      // Start a new story.
      window.Story.start();
      const s = window.Story.storylets;
      // Two cards should be available.
      expect(s.getAvailablePassages().length).toBe(1);
    });

    it('Should return one card of highest priority', () => {
      $(document.body).html(`
                  <tw-storydata name="Test" startnode="1" creator="extwee" creator-version="1.2.3">
                    <tw-passagedata pid="1" name="Test Passage" tags="storylet">
                      <requirements>
                          {
                              "test": true,
                              "priority": 1
                          }
                      </requirements>
                      <p>First</p>
                    </tw-passagedata>
                    <tw-passagedata pid="2" name="Test Passage 2" tags="storylet">
                      <requirements>
                          {
                              "test": true,
                              "priority": 2
                          }
                      </requirements>
                      <p>Second</p>
                    </tw-passagedata>
                    <script type="text/twine-javascript">
                    s.test = true;
                    </script>
                    <style type="text/twine-css"></style>
                 </tw-storydata>
                 <tw-story>
                 <tw-sidebar>
                    <tw-icon tabindex="0" alt="Undo" title="Undo">↶</tw-icon>
                    <tw-icon tabindex="1" alt="Redo" title="Redo">↷</tw-icon>
                  </tw-sidebar>
                  <tw-passage class="passage" aria-live="polite"></tw-passage></tw-story>`);
      // Reset State
      State.reset();
      // Reset story.
      window.Story = new Story();
      // Start a new story.
      window.Story.start();
      // Create new collection.
      const s = window.Story.storylets;
      // Get array of available cards, limited to 1.
      const passageList = s.getAvailablePassages(1);
      // Higher priority passage should be found.
      expect(passageList[0].passage.name).toBe('Test Passage 2');
    });

    it('Should return one when 1 specified', () => {
      $(document.body).html(`
                  <tw-storydata name="Test" startnode="1" creator="extwee" creator-version="1.2.3">
                    <tw-passagedata pid="1" name="Test Passage" tags="storylet">
                      <requirements>
                          {
                              "test": true
                          }
                      </requirements>
                      <p>First</p>
                    </tw-passagedata>
                    <tw-passagedata pid="2" name="Test Passage 2" tags="storylet">
                      <requirements>
                          {
                              "test": true
                          }
                      </requirements>
                      <p>Second</p>
                    </tw-passagedata>
                    <script type="text/twine-javascript">
                    s.test = true;
                    </script>
                    <style type="text/twine-css"></style>
                 </tw-storydata>
                 <tw-story>
                 <tw-sidebar>
                    <tw-icon tabindex="0" alt="Undo" title="Undo">↶</tw-icon>
                    <tw-icon tabindex="1" alt="Redo" title="Redo">↷</tw-icon>
                  </tw-sidebar>
                  <tw-passage class="passage" aria-live="polite"></tw-passage></tw-story>`);
      // Reset State
      State.reset();
      // Reset story.
      window.Story = new Story();
      // Start a new story.
      window.Story.start();
      const s = window.Story.storylets;
      // Get array of available cards, limited to 1.
      const passageList = s.getAvailablePassages(1);
      // Get top
      expect(passageList[0].passage.name).toBe('Test Passage');
    });
  });

  describe('addPassage()', () => {
    it('Should add another passage to the collection', () => {
      $(document.body).html(`
        <tw-storydata name="Test" startnode="1" creator="extwee" creator-version="1.2.3">
          <tw-passagedata pid="1" name="Test Passage" tags="storylet">
            <requirements>
                {
                    "test": true
                }
            </requirements>
            <p>First</p>
          </tw-passagedata>
          <tw-passagedata pid="2" name="Test Passage 2" tags="">
            <p>Second</p>
          </tw-passagedata>
          <script type="text/twine-javascript">
          s.test = true;
          </script>
          <style type="text/twine-css"></style>
      </tw-storydata>
      <tw-story>
      <tw-sidebar>
          <tw-icon tabindex="0" alt="Undo" title="Undo">↶</tw-icon>
          <tw-icon tabindex="1" alt="Redo" title="Redo">↷</tw-icon>
        </tw-sidebar>
        <tw-passage class="passage" aria-live="polite"></tw-passage></tw-story>`);
      // Reset State
      State.reset();
      // Reset story.
      window.Story = new Story();
      // Start a new story.
      window.Story.start();
      // Create new collection.
      const s = window.Story.storylets;
      // Add passage
      s.addPassage('Test Passage 2', {}, 0);
      expect(s.passages.length).toBe(2);
    });

    it('Should throw error if passage is already in collection', () => {
      $(document.body).html(`
        <tw-storydata name="Test" startnode="1" creator="extwee" creator-version="1.2.3">
          <tw-passagedata pid="1" name="Test Passage" tags="storylet">
            <requirements>
                {
                    "test": true
                }
            </requirements>
            <p>First</p>
          </tw-passagedata>
          <script type="text/twine-javascript">
          s.test = true;
          </script>
          <style type="text/twine-css"></style>
      </tw-storydata>
      <tw-story>
      <tw-sidebar>
          <tw-icon tabindex="0" alt="Undo" title="Undo">↶</tw-icon>
          <tw-icon tabindex="1" alt="Redo" title="Redo">↷</tw-icon>
        </tw-sidebar>
        <tw-passage class="passage" aria-live="polite"></tw-passage></tw-story>`);
      // Reset State
      State.reset();
      // Reset story.
      window.Story = new Story();
      // Start a new story.
      window.Story.start();
      // Create new collection.
      const s = window.Story.storylets;
      // Throw error
      expect(() => s.addPassage('Test Passage')).toThrow();
    });

    it('Should throw error if passage does not exist in story', () => {
      $(document.body).html(`
        <tw-storydata name="Test" startnode="1" creator="extwee" creator-version="1.2.3">
          <tw-passagedata pid="1" name="Test Passage" tags="storylet">
            <requirements>
                {
                    "test": true
                }
            </requirements>
            <p>First</p>
          </tw-passagedata>
          <script type="text/twine-javascript">
          s.test = true;
          </script>
          <style type="text/twine-css"></style>
      </tw-storydata>
      <tw-story>
      <tw-sidebar>
          <tw-icon tabindex="0" alt="Undo" title="Undo">↶</tw-icon>
          <tw-icon tabindex="1" alt="Redo" title="Redo">↷</tw-icon>
        </tw-sidebar>
        <tw-passage class="passage" aria-live="polite"></tw-passage></tw-story>`);
      // Reset State
      State.reset();
      // Reset story.
      window.Story = new Story();
      // Start a new story.
      window.Story.start();
      // Create new collection.
      const s = window.Story.storylets;
      // Throw error
      expect(() => s.addPassage('Nah')).toThrow();
    });

    it('Should ignore requirements issue and set empty object', () => {
      $(document.body).html(`
        <tw-storydata name="Test" startnode="1" creator="extwee" creator-version="1.2.3">
          <tw-passagedata pid="1" name="Test Passage" tags="storylet">
            <requirements>
                {
                    "test": true
                }
            </requirements>
            <p>First</p>
          </tw-passagedata>
          <tw-passagedata pid="1" name="Test Passage 2" tags="storylet">
            <p>First</p>
          </tw-passagedata>
          <script type="text/twine-javascript">
          s.test = true;
          </script>
          <style type="text/twine-css"></style>
      </tw-storydata>
      <tw-story>
      <tw-sidebar>
          <tw-icon tabindex="0" alt="Undo" title="Undo">↶</tw-icon>
          <tw-icon tabindex="1" alt="Redo" title="Redo">↷</tw-icon>
        </tw-sidebar>
        <tw-passage class="passage" aria-live="polite"></tw-passage></tw-story>`);
      // Reset State
      State.reset();
      // Reset story.
      window.Story = new Story();
      // Start a new story.
      window.Story.start();
      // Create new collection.
      const s = window.Story.storylets;
      // Add passage with null as requirements.
      s.addPassage('Test Passage 2', null);
      // Grab requirements
      const reqs = s.passages[1].requirements;
      // Check the number of keys, which should be 0.
      expect(Object.keys(reqs).length).toBe(0);
    });

    it('Should assume default values', () => {
      $(document.body).html(`
        <tw-storydata name="Test" startnode="1" creator="extwee" creator-version="1.2.3">
          <tw-passagedata pid="1" name="Test Passage" tags="storylet">
            <requirements>
                {
                    "test": true
                }
            </requirements>
            <p>First</p>
          </tw-passagedata>
          <tw-passagedata pid="2" name="" tags="">
            <p>Second</p>
          </tw-passagedata>
          <script type="text/twine-javascript">
          s.test = true;
          </script>
          <style type="text/twine-css"></style>
      </tw-storydata>
      <tw-story>
      <tw-sidebar>
          <tw-icon tabindex="0" alt="Undo" title="Undo">↶</tw-icon>
          <tw-icon tabindex="1" alt="Redo" title="Redo">↷</tw-icon>
        </tw-sidebar>
        <tw-passage class="passage" aria-live="polite"></tw-passage></tw-story>`);
      // Reset State
      State.reset();
      // Reset story.
      window.Story = new Story();
      // Start a new story.
      window.Story.start();
      // Create new collection.
      const s = window.Story.storylets;
      // Add passage
      s.addPassage();
      expect(s.passages.length).toBe(2);
    });
  });

  describe('removePassage()', () => {
    it('Should remove passage', () => {
      $(document.body).html(`
      <tw-storydata name="Test" startnode="1" creator="extwee" creator-version="1.2.3">
        <tw-passagedata pid="1" name="Test Passage" tags="storylet">
          <requirements>
              {
                  "test": true
              }
          </requirements>
          <p>First</p>
        </tw-passagedata>
        <tw-passagedata pid="2" name="Test Passage 2" tags="">
          <p>Second</p>
        </tw-passagedata>
        <script type="text/twine-javascript">
        s.test = true;
        </script>
        <style type="text/twine-css"></style>
    </tw-storydata>
    <tw-story>
    <tw-sidebar>
        <tw-icon tabindex="0" alt="Undo" title="Undo">↶</tw-icon>
        <tw-icon tabindex="1" alt="Redo" title="Redo">↷</tw-icon>
      </tw-sidebar>
      <tw-passage class="passage" aria-live="polite"></tw-passage></tw-story>`);
      // Reset State
      State.reset();
      // Reset story.
      window.Story = new Story();
      // Start a new story.
      window.Story.start();
      // Create new collection.
      const s = window.Story.storylets;
      s.removePassage('Test Passage');
      expect(s.passages.length).toBe(0);
    });
  });

  describe('includes()', () => {
    it('Should include two cards available', () => {
      $(document.body).html(`
            <tw-storydata name="Test" startnode="1" creator="extwee" creator-version="1.2.3">
              <tw-passagedata pid="1" name="Test Passage" tags="storylet">
                <requirements>
                    {
                        "test": 1
                    }
                </requirements>
                <p>First</p>
              </tw-passagedata>
              <tw-passagedata pid="2" name="Test Passage 2" tags="storylet">
                <requirements>
                    {
                        "test": 1
                    }
                </requirements>
                <p>Second</p>
              </tw-passagedata>
              <script type="text/twine-javascript">
              s.test = 1;
              </script>
              <style type="text/twine-css"></style>
           </tw-storydata>
           <tw-story>
           <tw-sidebar>
              <tw-icon tabindex="0" alt="Undo" title="Undo">↶</tw-icon>
              <tw-icon tabindex="1" alt="Redo" title="Redo">↷</tw-icon>
            </tw-sidebar>
            <tw-passage class="passage" aria-live="polite"></tw-passage></tw-story>`);
      // Reset State
      State.reset();
      // Reset story
      window.Story = new Story();
      // Start a new story
      window.Story.start();
      // Create new collection
      const s = window.Story.storylets;
      // Confirm each passage is available
      expect(s.includes('Test Passage')).toBe(true);
      expect(s.includes('Test Passage 2')).toBe(true);
    });

    it('Should assume default values', () => {
      $(document.body).html(`
            <tw-storydata name="Test" startnode="1" creator="extwee" creator-version="1.2.3">
              <tw-passagedata pid="1" name="Test Passage" tags="storylet">
                <requirements>
                    {
                        "test": 1
                    }
                </requirements>
                <p>First</p>
              </tw-passagedata>
              <tw-passagedata pid="2" name="" tags="storylet">
                <requirements>
                    {
                        "test": 1
                    }
                </requirements>
                <p>Second</p>
              </tw-passagedata>
              <script type="text/twine-javascript">
              s.test = 1;
              </script>
              <style type="text/twine-css"></style>
           </tw-storydata>
           <tw-story>
           <tw-sidebar>
              <tw-icon tabindex="0" alt="Undo" title="Undo">↶</tw-icon>
              <tw-icon tabindex="1" alt="Redo" title="Redo">↷</tw-icon>
            </tw-sidebar>
            <tw-passage class="passage" aria-live="polite"></tw-passage></tw-story>`);
      // Reset State
      State.reset();
      // Reset story
      window.Story = new Story();
      // Start a new story
      window.Story.start();
      // Create new collection
      const s = window.Story.storylets;
      // Confirm default passage is available
      expect(s.includes()).toBe(true);
    });
  });

  describe('removePassage()', () => {
    it('Should return one available', () => {
      $(document.body).html(`
            <tw-storydata name="Test" startnode="1" creator="extwee" creator-version="1.2.3">
              <tw-passagedata pid="1" name="Test Passage" tags="storylet">
                <requirements>
                    {
                        "test": 1
                    }
                </requirements>
                <p>First</p>
              </tw-passagedata>
              <tw-passagedata pid="2" name="Test Passage 2" tags="storylet">
                <requirements>
                    {
                        "test": 1
                    }
                </requirements>
                <p>Second</p>
              </tw-passagedata>
              <script type="text/twine-javascript">
              s.test = 1;
              </script>
              <style type="text/twine-css"></style>
           </tw-storydata>
           <tw-story>
           <tw-sidebar>
              <tw-icon tabindex="0" alt="Undo" title="Undo">↶</tw-icon>
              <tw-icon tabindex="1" alt="Redo" title="Redo">↷</tw-icon>
            </tw-sidebar>
            <tw-passage class="passage" aria-live="polite"></tw-passage></tw-story>`);
      // Reset State
      State.reset();
      // Reset story.
      window.Story = new Story();
      // Start a new story.
      window.Story.start();
      // Create new collection.
      const s = window.Story.storylets;
      // Remove passage by name.
      s.removePassage('Test Passage');
      // Only one passage should be available.
      expect(s.getAvailablePassages().length).toBe(1);
    });

    it('Should assume default values', () => {
      $(document.body).html(`
            <tw-storydata name="Test" startnode="1" creator="extwee" creator-version="1.2.3">
              <tw-passagedata pid="1" name="Test Passage" tags="storylet">
                <requirements>
                    {
                        "test": 1
                    }
                </requirements>
                <p>First</p>
              </tw-passagedata>
              <tw-passagedata pid="2" name="" tags="storylet">
                <requirements>
                    {
                        "test": 1
                    }
                </requirements>
                <p>Second</p>
              </tw-passagedata>
              <script type="text/twine-javascript">
              s.test = 1;
              </script>
              <style type="text/twine-css"></style>
           </tw-storydata>
           <tw-story>
           <tw-sidebar>
              <tw-icon tabindex="0" alt="Undo" title="Undo">↶</tw-icon>
              <tw-icon tabindex="1" alt="Redo" title="Redo">↷</tw-icon>
            </tw-sidebar>
            <tw-passage class="passage" aria-live="polite"></tw-passage></tw-story>`);
      // Reset State
      State.reset();
      // Reset story.
      window.Story = new Story();
      // Start a new story.
      window.Story.start();
      // Create new collection.
      const s = window.Story.storylets;
      // Remove default passage.
      s.removePassage();
      // Only one passage should be available.
      expect(s.getAvailablePassages().length).toBe(1);
    });
  });
});
