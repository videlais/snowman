#!/usr/bin/env node
import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

/**
 * Recursively find all .twee files in a directory
 */
function findTweeFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  
  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      findTweeFiles(filePath, fileList);
    } else if (file.endsWith('.twee')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

const cookbookDir = './test/playwright/cookbook';
const tweeFiles = findTweeFiles(cookbookDir);

let fixedCount = 0;

tweeFiles.forEach(file => {
  let content = readFileSync(file, 'utf8');
  let modified = false;
  
  // Check if file has empty IFID
  if (content.includes('"ifid":""')) {
    const uuid = randomUUID().toUpperCase();
    content = content.replace('"ifid":""', `"ifid":"${uuid}"`);
    modified = true;
  }
  
  // Check if file is missing StoryData section entirely
  if (!content.includes(':: StoryData')) {
    const uuid = randomUUID().toUpperCase();
    const storyData = `:: StoryData\n{\n\t"ifid":"${uuid}"\n}\n\n`;
    content = storyData + content;
    modified = true;
  }
  
  if (modified) {
    writeFileSync(file, content, 'utf8');
    console.log(`✓ Fixed IFID in: ${file}`);
    fixedCount++;
  }
});

console.log(`\n✅ Fixed ${fixedCount} files with missing/empty IFIDs`);
