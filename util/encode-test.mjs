import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the file path from command line arguments, default to public/test.md
const relFilePath = process.argv[2] || 'public/test.md';
const absFilePath = path.join(__dirname, '..', relFilePath);

if (!fs.existsSync(absFilePath)) {
  console.error(`\nFile not found: ${relFilePath}`);
  console.error('Usage: node util/encode-test.mjs [relative/path/to/file.md]');
  process.exit(1);
}

// Read the markdown file
const markdownContent = fs.readFileSync(absFilePath, 'utf8');

// Encode for URL using the same method as our DeckLoader
const encoded = encodeURIComponent(markdownContent);

console.log('Encoded markdown for URL:');
console.log('='.repeat(50));
console.log(encoded);
console.log('='.repeat(50));

// Create the full URL parameter
const urlParam = `url:${encoded}`;
console.log('\nFull URL parameter:');
console.log('='.repeat(50));
console.log(urlParam);
console.log('='.repeat(50));

// Show how to use it in a complete URL
const baseUrl = 'http://localhost:3000';
const fullUrl = `${baseUrl}?deck=${urlParam}`;
console.log('\nComplete URL:');
console.log('='.repeat(50));
console.log(fullUrl);
console.log('='.repeat(50));

// Show the length comparison
console.log('\nLength comparison:');
console.log(`Original: ${markdownContent.length} characters`);
console.log(`Encoded: ${encoded.length} characters`);
console.log(`URL parameter: ${urlParam.length} characters`);
console.log(`Full URL: ${fullUrl.length} characters`); 