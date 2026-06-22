const fs = require('fs');
const path = require('path');

const bundlePath = path.join(__dirname, 'apps', 'web', 'public', 'legacy', 'js', 'portal.bundle.js');
const targetDir = path.join(__dirname, 'apps', 'web', 'public', 'legacy');

const bundleContent = fs.readFileSync(bundlePath, 'utf8');

// We know the pattern is:
// /* js/filename.js */
// content
// ;
//
// We can use a regex to find all matches of the comment headers and their positions.
const regex = /\/\* (js\/[a-zA-Z0-9.-]+\.js) \*\//g;

let matches = [];
let match;
while ((match = regex.exec(bundleContent)) !== null) {
  matches.push({
    filePath: match[1],
    index: match.index,
    headerLength: match[0].length
  });
}

console.log(`Found ${matches.length} JS files in bundle.`);

for (let i = 0; i < matches.length; i++) {
  const current = matches[i];
  const next = matches[i + 1];
  
  const start = current.index + current.headerLength;
  const end = next ? next.index : bundleContent.length;
  
  let content = bundleContent.substring(start, end);
  
  // Clean up leading/trailing newlines and semicolons if needed
  content = content.trim();
  if (content.endsWith(';')) {
    content = content.substring(0, content.length - 1).trim();
  }
  
  const outPath = path.join(targetDir, current.filePath);
  const outDir = path.dirname(outPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  
  fs.writeFileSync(outPath, content, 'utf8');
  console.log(`Wrote ${outPath}`);
}
console.log('Recreation complete!');
