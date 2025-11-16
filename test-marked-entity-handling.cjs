const marked = require('marked');

// Test how marked handles HTML entities in attributes
const testCases = [
  {
    name: "Numeric entities &#34;",
    input: '<a data-json=\'[&#34;One&#34;, &#34;Two&#34;]\'></a>'
  },
  {
    name: "Named entities &quot;",
    input: '<a data-json=\'[&quot;One&quot;, &quot;Two&quot;]\'></a>'
  },
  {
    name: "Raw quotes",
    input: '<a data-json=\'["One", "Two"]\'></a>'
  }
];

console.log("Testing marked.parseInline() with HTML entities:\n");

testCases.forEach(test => {
  console.log(`Test: ${test.name}`);
  console.log(`Input:  ${test.input}`);
  
  const output = marked.parseInline(test.input, { 
    async: false, 
    mangle: false,
    headerIds: false 
  });
  
  console.log(`Output: ${output}`);
  console.log(`Match:  ${output === test.input ? 'YES ✓' : 'NO ✗'}`);
  console.log('---\n');
});

console.log("\nTesting marked.parse() with HTML entities:\n");

testCases.forEach(test => {
  console.log(`Test: ${test.name}`);
  console.log(`Input:  ${test.input}`);
  
  const output = marked.parse(test.input, { 
    async: false, 
    mangle: false,
    headerIds: false 
  });
  
  console.log(`Output: ${output.trim()}`);
  console.log('---\n');
});
