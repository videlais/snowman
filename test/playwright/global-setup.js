// @ts-check
import { execSync } from 'child_process';
import { readdirSync, statSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Recursively find all .twee files in a directory
 * @param {string} dir
 * @param {string[]} fileList
 * @returns {string[]}
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

/**
 * Global setup to compile all Twee files before running tests
 */
export default async function globalSetup() {
  console.log('🔧 Compiling Twee files for Playwright tests...');
  
  const cookbookDir = join(__dirname, 'cookbook');
  const tweeFiles = findTweeFiles(cookbookDir);
  
  console.log(`Found ${tweeFiles.length} Twee files to compile`);
  
  // Compile each Twee file to HTML
  for (const tweeFile of tweeFiles) {
    const outputFile = tweeFile.replace('.twee', '.html');
    const outputDir = dirname(outputFile);
    
    // Ensure output directory exists
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Create path to latest build
    // Check if NODE_ENV is set to development or if --dev flag was passed
    const isDev = process.env.NODE_ENV === 'development' || process.argv.includes('--dev');
    const formatFile = isDev ? 'format.dev.js' : 'format.js';
    const pathToStoryFormat = join(__dirname, '../../dist', formatFile);
    
    console.log(`Using format: ${formatFile}`);
    
    try {
      // Run extwee to compile the Twee file  
      // Format: extwee -c -i <input-file> -o <output-file> -s <story-format>
      execSync(`npx extwee -c -i "${tweeFile}" -o "${outputFile}" -s "${pathToStoryFormat}"`, {
        stdio: 'inherit',
        cwd: join(__dirname, '..', '..')
      });
      console.log(`✓ Compiled: ${tweeFile}`);
    } catch (error) {
      console.error(`✗ Failed to compile: ${tweeFile}`);
      throw error;
    }
  }
  
  console.log('✅ All Twee files compiled successfully!');
}
