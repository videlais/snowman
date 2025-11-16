/**
 * Global teardown for Playwright tests
 * Removes compiled HTML files from cookbook examples to reduce project size
 */

const fs = require('fs');
const path = require('path');

/**
 * Recursively find all HTML files in the cookbook directory
 * @param {string} dir - Directory to search
 * @param {string[]} fileList - Accumulator for found files
 * @returns {string[]} Array of HTML file paths
 */
function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findHtmlFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

async function globalTeardown() {
  const cookbookDir = path.join(__dirname, 'cookbook');
  
  console.log('🧹 Cleaning up compiled HTML files...');
  
  const htmlFiles = findHtmlFiles(cookbookDir);
  
  let removedCount = 0;
  htmlFiles.forEach(file => {
    try {
      fs.unlinkSync(file);
      removedCount++;
    } catch (error) {
      console.error(`Failed to remove ${file}:`, error.message);
    }
  });
  
  console.log(`✅ Removed ${removedCount} compiled HTML file(s)`);
}

module.exports = globalTeardown;
