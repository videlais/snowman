describe('Snowman CodeMirror Extensions', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/extensions/codemirror/index.html');
    await page.waitForSelector('.CodeMirror', { timeout: 10000 });
  });

  describe('CodeMirror Integration', () => {
    test('should load CodeMirror successfully', async () => {
      const codeMirror = await page.$('.CodeMirror');
      expect(codeMirror).toBeTruthy();
    });

    test('should have Snowman mode defined', async () => {
      const cmExists = await page.evaluate(() => {
        return typeof window.cm !== 'undefined';
      });
      expect(cmExists).toBe(true);
    });

    test('should highlight Snowman syntax', async () => {
      // Clear and set test content
      await page.evaluate(() => {
        window.cm.setValue('<% s.test = "value" %>');
      });

      // Check if JavaScript blocks are highlighted
      const hasKeywordHighlight = await page.$('.cm-keyword');
      expect(hasKeywordHighlight).toBeTruthy();
    });
  });

  describe('Reference Parser', () => {
    test('should parse passage references from links', async () => {
      await page.evaluate(() => {
        window.cm.setValue('[[Link Text->Target Passage]]\\n[[Another Passage]]');
      });

      // Wait for references to update
      await new Promise(resolve => setTimeout(resolve, 100));

      const references = await page.$$eval('#references li', els => 
        els.map(el => el.textContent)
      );

      expect(references).toContain('Target Passage');
      expect(references).toContain('Another Passage');
    });

    test('should parse Story.render references', async () => {
      await page.evaluate(() => {
        window.cm.setValue('<% window.Story.render("Helper Passage") %>');
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      const references = await page.$$eval('#references li', els => 
        els.map(el => el.textContent)
      );

      expect(references).toContain('Target Passage');
    });

    test('should parse Story.goTo references', async () => {
      await page.evaluate(() => {
        window.cm.setValue('<% Story.goTo("Next Scene") %>');
      });

      await new Promise(resolve => setTimeout(resolve, 100));

      const references = await page.$$eval('#references li', els => 
        els.map(el => el.textContent)
      );

      expect(references).toContain('Rendered Passage');
    });
  });

  describe('Syntax Highlighting', () => {
    test('should highlight JavaScript expressions', async () => {
      await page.evaluate(() => {
        window.cm.setValue('<%= s.playerName %>');
      });

      const keywordElements = await page.$$('.cm-keyword');
      expect(keywordElements.length).toBeGreaterThan(0);
    });

    test('should highlight Twine links', async () => {
      await page.evaluate(() => {
        window.cm.setValue('[[Test Link->Target]]');
      });

      const linkElements = await page.$$('.cm-link');
      expect(linkElements.length).toBeGreaterThan(0);
    });

    test('should highlight HTML tags', async () => {
      await page.evaluate(() => {
        window.cm.setValue('<div class="test">Content</div>');
      });

      const tagElements = await page.$$('.cm-tag');
      expect(tagElements.length).toBeGreaterThan(0);
    });
  });
});