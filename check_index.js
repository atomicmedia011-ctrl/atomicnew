const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'breakable-works-007788.framer.app/index.html');
const content = fs.readFileSync(indexPath, 'utf8');

console.log('File size:', content.length, 'characters');

// Let's find script sources
const scriptRegex = /<script[^>]*src="([^"]*)"/gi;
let match;
console.log('\n--- Script tags inside index.html ---');
while ((match = scriptRegex.exec(content)) !== null) {
  console.log(match[1]);
}

// Let's find any import statements in script blocks
const importRegex = /import\s+[^;]*from\s*["']([^"']*)["']/g;
console.log('\n--- Imports inside inline script blocks ---');
const scriptBlocks = content.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
scriptBlocks.forEach((block, index) => {
  let imp;
  while ((imp = importRegex.exec(block)) !== null) {
    console.log(`Block ${index}:`, imp[1]);
  }
});

// Let's print occurrences of Joseph / joseph / Joseph Alexander in index.html
console.log('\n--- Joseph / Alexander in index.html ---');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('joseph') || line.toLowerCase().includes('alexander')) {
    console.log(`Line ${idx + 1}: ${line.trim().substring(0, 120)}...`);
  }
});
