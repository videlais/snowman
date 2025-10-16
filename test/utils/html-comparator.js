import { readFileSync, writeFileSync } from 'fs';
import { diffLines } from 'diff';
import { JSDOM } from 'jsdom';

/**
 * Compare generated HTML output with reference files
 */
export class HTMLComparator {
  
  /**
   * Normalize HTML for comparison by removing whitespace differences
   */
  static normalizeHTML(html) {
    const dom = new JSDOM(html);
    const normalized = dom.window.document.documentElement.outerHTML;
    
    return normalized
      .replace(/\s+/g, ' ')           // Normalize whitespace
      .replace(/>\s+</g, '><')        // Remove whitespace between tags
      .replace(/\s+>/g, '>')          // Remove trailing whitespace in tags
      .replace(/\s+\/>/g, '/>')       // Normalize self-closing tags
      .trim();
  }
  
  /**
   * Compare two HTML strings and return differences
   */
  static compareHTML(generated, reference) {
    const normalizedGenerated = this.normalizeHTML(generated);
    const normalizedReference = this.normalizeHTML(reference);
    
    if (normalizedGenerated === normalizedReference) {
      return { identical: true, differences: [] };
    }
    
    const differences = diffLines(normalizedReference, normalizedGenerated);
    
    return {
      identical: false,
      differences: differences.filter(part => part.added || part.removed)
    };
  }
  
  /**
   * Generate a detailed comparison report
   */
  static generateReport(generated, reference, outputPath) {
    const comparison = this.compareHTML(generated, reference);
    
    if (comparison.identical) {
      console.log('✅ HTML output matches reference exactly');
      return true;
    }
    
    console.log('❌ HTML output differs from reference:');
    
    const report = {
      timestamp: new Date().toISOString(),
      identical: false,
      differences: comparison.differences.map(diff => ({
        type: diff.added ? 'added' : (diff.removed ? 'removed' : 'unchanged'),
        content: diff.value,
        count: diff.count
      }))
    };
    
    // Write detailed report
    if (outputPath) {
      writeFileSync(outputPath, JSON.stringify(report, null, 2));
      console.log(`📊 Detailed report written to: ${outputPath}`);
    }
    
    // Console output
    comparison.differences.forEach(diff => {
      const prefix = diff.added ? '+ ' : '- ';
      const color = diff.added ? '\x1b[32m' : '\x1b[31m';
      console.log(`${color}${prefix}${diff.value}\x1b[0m`);
    });
    
    return false;
  }
  
  /**
   * Compare with reference file
   */
  static compareWithFile(generated, referencePath, reportPath = null) {
    try {
      const reference = readFileSync(referencePath, 'utf8');
      return this.generateReport(generated, reference, reportPath);
    } catch (error) {
      console.error(`❌ Error reading reference file: ${error.message}`);
      return false;
    }
  }
}

// Example usage function
export function runComparison(storyHTML, referencePath) {
  console.log('🔍 Comparing HTML output...');
  
  const isIdentical = HTMLComparator.compareWithFile(
    storyHTML, 
    referencePath, 
    'test/reports/html-comparison.json'
  );
  
  if (isIdentical) {
    console.log('✅ All tests passed - HTML output matches reference');
  } else {
    console.log('❌ HTML output differs from reference - check report for details');
  }
  
  return isIdentical;
}