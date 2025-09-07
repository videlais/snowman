/**
 * @jest-environment jsdom
 */

import Story from '../lib/Story.js';

// Mock jQuery for the integration test
global.$ = jest.fn((element) => ({
  html: jest.fn(() => element.innerHTML || ''),
  on: jest.fn(),
  append: jest.fn()
}));

$.event = { trigger: jest.fn() };

describe('Script Tag Parsing Bug', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should demonstrate the </script> parsing issue', () => {
    // Create a script element with problematic content
    const script = document.createElement('script');
    script.setAttribute('type', 'text/twine-javascript');
    
    // This content would break in a real browser because the HTML parser
    // sees </script> and treats it as the end of the script tag
    const problematicContent = `
      const htmlTemplate = "<div><script>alert('test');</script></div>";
      console.log("This code after </script> won't execute");
    `;
    
    script.innerHTML = problematicContent;
    document.body.appendChild(script);
    
    // In Jest/jsdom, this works fine, but in real browsers it breaks
    // The innerHTML should contain the full content
    expect(script.innerHTML).toContain('console.log');
    expect(script.innerHTML).toContain('</script>');
  });

  it('should handle escaped script tags correctly', () => {
    // Create a script element with escaped content (the solution)
    const script = document.createElement('script');
    script.setAttribute('type', 'text/twine-javascript');
    
    // This is the workaround: escape the problematic sequence
    const safeContent = `
      const htmlTemplate = "<div><script>alert('test');<\\/script></div>";
      console.log("This code executes correctly");
    `;
    
    script.innerHTML = safeContent;
    document.body.appendChild(script);
    
    // The content should be properly preserved
    expect(script.innerHTML).toContain('console.log');
    expect(script.innerHTML).toContain('<\\/script>');
  });

  it('should provide alternative solutions for script tag inclusion', () => {
    // Solution 1: String concatenation
    const solution1 = `
      const htmlTemplate = "<div><script>alert('test');" + "</script></div>";
    `;
    
    // Solution 2: Template literals with concatenation
    const solution2 = `
      const closeScript = '</script>';
      const htmlTemplate = \`<div><script>alert('test');\${closeScript}></div>\`;
    `;
    
    // Solution 3: Using fromCharCode
    const solution3 = `
      const htmlTemplate = "<div><script>alert('test');" + String.fromCharCode(60) + "/script></div>";
    `;
    
    // All should be valid JavaScript that doesn't break HTML parsing
    expect(solution1).toContain('+ "</script></div>"');
    expect(solution2).toContain('closeScript');
    expect(solution3).toContain('fromCharCode');
  });

  describe('Story.sanitizeScriptContent', () => {
    it('should escape </script> tags in string literals', () => {
      const input = `const html = "<script>alert('test');</script>";`;
      const result = Story.sanitizeScriptContent(input);
      expect(result).toBe(`const html = "<script>alert('test');<\\/script>";`);
    });

    it('should escape </script> tags in comments', () => {
      const input = `/* This comment has </script> in it */`;
      const result = Story.sanitizeScriptContent(input);
      expect(result).toBe(`/* This comment has <\\/script> in it */`);
    });

    it('should handle multiple </script> occurrences', () => {
      const input = `
        const template1 = "<script>code1;</script>";
        const template2 = "<script>code2;</script>";
        // Comment with </script>
      `;
      const result = Story.sanitizeScriptContent(input);
      expect(result).toContain('<\\/script>');
      expect((result.match(/<\\\/script>/g) || []).length).toBe(3);
    });

    it('should be case insensitive', () => {
      const input = `const html = "<SCRIPT>code;</SCRIPT><Script>more;</Script>";`;
      const result = Story.sanitizeScriptContent(input);
      expect(result).toBe(`const html = "<SCRIPT>code;<\\/script><Script>more;<\\/script>";`);
    });

    it('should handle non-string input gracefully', () => {
      expect(Story.sanitizeScriptContent(null)).toBe(null);
      expect(Story.sanitizeScriptContent(undefined)).toBe(undefined);
      expect(Story.sanitizeScriptContent(123)).toBe(123);
    });

    it('should handle empty strings', () => {
      expect(Story.sanitizeScriptContent('')).toBe('');
    });

    it('should not affect valid JavaScript without </script>', () => {
      const input = `
        const message = "Hello, world!";
        console.log(message);
        function test() { return 42; }
      `;
      const result = Story.sanitizeScriptContent(input);
      expect(result).toBe(input);
    });
  });

  describe('Integration with Story class', () => {
    it('should have the sanitizeScriptContent method available', () => {
      expect(typeof Story.sanitizeScriptContent).toBe('function');
    });

    it('should properly sanitize problematic script content', () => {
      const problematicScript = `
        const htmlTemplate = "<div><script>alert('test');</script></div>";
        /* This comment has </script> in it */
        s.testVar = "Script with </script> executed";
      `;
      
      const sanitized = Story.sanitizeScriptContent(problematicScript);
      
      // Verify all </script> tags were escaped
      expect(sanitized).toContain('<\\/script>');
      expect(sanitized).not.toContain('</script>');
      
      // Count the escaped sequences (one in string, one in comment, one in string)
      const escapedCount = (sanitized.match(/<\\\/script>/gi) || []).length;
      expect(escapedCount).toBe(3); // One in HTML template, one in comment, one in string
    });
  });
});
