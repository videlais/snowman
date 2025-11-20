import { test, expect } from '@playwright/test';

test.describe('Snowman CodeMirror Extensions', () => {
  test.describe('CodeMirror Integration', () => {
    test.skip('should load CodeMirror successfully', async ({ page }) => {
      await page.goto('/e2e/extensions/codemirror/index.html');
      await page.waitForSelector('.CodeMirror', { timeout: 10000 });
      const codeMirror = await page.$('.CodeMirror');
      expect(codeMirror).toBeTruthy();
    });

    test.skip('should have Snowman mode defined', async ({ page }) => {
      await page.goto('/e2e/extensions/codemirror/index.html');
      await page.waitForSelector('.CodeMirror', { timeout: 10000 });
      const cmExists = await page.evaluate(() => {
        return typeof window.cm !== 'undefined';
      });
      expect(cmExists).toBe(true);
    });

    test.skip('should highlight Snowman syntax', async ({ page }) => {
      await page.goto('/e2e/extensions/codemirror/index.html');
      await page.waitForSelector('.CodeMirror', { timeout: 10000 });
      // Clear and set test content
      await page.evaluate(() => {
        window.cm.setValue('<% s.test = "value" %>');
      });

      // Check if JavaScript blocks are highlighted
      const hasKeywordHighlight = await page.$('.cm-keyword');
      expect(hasKeywordHighlight).toBeTruthy();
    });
  });

  test.describe('Reference Parser', () => {
    test.skip('should parse passage references from links', async ({ page }) => {
      await page.goto('/e2e/extensions/codemirror/index.html');
      await page.waitForSelector('.CodeMirror', { timeout: 10000 });
      await page.evaluate(() => {
        window.cm.setValue('[[Link Text->Target Passage]]\\n[[Another Passage]]');
      });

      // Wait for references to update
      await page.waitForTimeout(100);

      const references = await page.$$eval('#references li', els => 
        els.map(el => el.textContent)
      );

      expect(references).toContain('Target Passage');
      expect(references).toContain('Another Passage');
    });

    test.skip('should parse Story.render references', async ({ page }) => {
      await page.goto('/e2e/extensions/codemirror/index.html');
      await page.waitForSelector('.CodeMirror', { timeout: 10000 });
      await page.evaluate(() => {
        window.cm.setValue('<% window.Story.render("Helper Passage") %>');
      });

      await page.waitForTimeout(100);

      const references = await page.$$eval('#references li', els => 
        els.map(el => el.textContent)
      );

      expect(references).toContain('Helper Passage');
    });

    test.skip('should parse Story.goTo references', async ({ page }) => {
      await page.goto('/e2e/extensions/codemirror/index.html');
      await page.waitForSelector('.CodeMirror', { timeout: 10000 });
      await page.evaluate(() => {
        window.cm.setValue('<% Story.goTo("Next Scene") %>');
      });

      await page.waitForTimeout(100);

      const references = await page.$$eval('#references li', els => 
        els.map(el => el.textContent)
      );

      expect(references).toContain('Next Scene');
    });
  });

  test.describe('Syntax Highlighting', () => {
    test.skip('should highlight JavaScript expressions', async ({ page }) => {
      await page.goto('/e2e/extensions/codemirror/index.html');
      await page.waitForSelector('.CodeMirror', { timeout: 10000 });
      await page.evaluate(() => {
        window.cm.setValue('<%= s.playerName %>');
      });

      const keywordElements = await page.$$('.cm-keyword');
      expect(keywordElements.length).toBeGreaterThan(0);
    });

    test.skip('should highlight Twine links', async ({ page }) => {
      await page.goto('/e2e/extensions/codemirror/index.html');
      await page.waitForSelector('.CodeMirror', { timeout: 10000 });
      await page.evaluate(() => {
        window.cm.setValue('[[Test Link->Target]]');
      });

      const linkElements = await page.$$('.cm-link');
      expect(linkElements.length).toBeGreaterThan(0);
    });

    test.skip('should highlight HTML tags', async ({ page }) => {
      await page.goto('/e2e/extensions/codemirror/index.html');
      await page.waitForSelector('.CodeMirror', { timeout: 10000 });
      await page.evaluate(() => {
        window.cm.setValue('<div class="test">Content</div>');
      });

      const tagElements = await page.$$('.cm-tag');
      expect(tagElements.length).toBeGreaterThan(0);
    });
  });
});