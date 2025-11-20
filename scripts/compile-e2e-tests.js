// scripts/compile-e2e-tests.js
// Replaces the bash compile script with a Node.js version that attempts to
// import extwee programmatically, falling back to the CLI via npx if needed.
// Usage:
//   node scripts/compile-e2e-tests.js        # compile all test/e2e .twee files
//   node scripts/compile-e2e-tests.js --dry-run   # just list files and verify dist/format.js

const fs = require('node:fs');
const path = require('path');
const Extwee = require('extwee');

async function findTweeFiles(dir) {
  const results = [];
  async function walk(d) {
    const entries = await fs.promises.readdir(d, { withFileTypes: true });
    for (const ent of entries) {
      const full = path.join(d, ent.name);
      if (ent.isDirectory()) {
        await walk(full);
      } else if (ent.isFile() && full.endsWith('.twee')) {
        results.push(full);
      }
    }
  }
  await walk(dir);
  return results;
} 

async function compileAll() {
  const formatPath = path.resolve('dist/format.js');
  if (!fs.existsSync(formatPath)) {
    console.error("❌ Error: dist/format.js not found. Run 'npm run package' first.");
    process.exitCode = 1;
    return;
  }

  const tweeRoot = path.resolve('test/e2e');
  if (!fs.existsSync(tweeRoot)) {
    console.error('❌ Error: test/e2e directory not found.');
    process.exitCode = 1;
    return;
  }

  console.log('✅ Format file:', formatPath, `(${fs.statSync(formatPath).size} bytes)`);

  const tweeFiles = await findTweeFiles(tweeRoot);
  if (!tweeFiles.length) {
    console.log('No .twee files found under test/e2e.');
    return;
  }

  console.log(`Found ${tweeFiles.length} .twee files.`);

  for (const tweeFile of tweeFiles) {
    const dir = path.dirname(tweeFile);
    const base = path.basename(tweeFile, '.twee');
    const htmlFile = path.join(dir, `${base}.html`);

    console.log(`Compiling: ${tweeFile} -> ${htmlFile}`);

    const tweeFileContent = fs.readFileSync(tweeFile, 'utf8');

   // parseTwee returns a Story object from Twee source (it doesn't need the JSON chunk)
    const story = Extwee.parseTwee(tweeFileContent);

    // parseStoryFormat needs the format SOURCE CODE, not a path
    const formatSource = await fs.promises.readFile(formatPath, 'utf8');
    const storyFormat = Extwee.parseStoryFormat(formatSource);

    // compileTwine2HTML combines them
    const htmlContent = Extwee.compileTwine2HTML(story, storyFormat);

    // Write output HTML file
    await fs.promises.writeFile(htmlFile, htmlContent, 'utf8');
  }

  console.log('🎉 Batch compilation complete!');
}

(async () => {
 try {
    await compileAll();
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exitCode = 2;
  }
})();