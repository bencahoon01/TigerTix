const fs = require('fs');
const path = require('path');

// Delete old test result files
const files = [
  path.join(__dirname, 'test-results.log'),
  path.join(__dirname, 'test-results.json'),
  path.join(__dirname, 'test-results.md')
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    console.log(`✓ Deleted: ${path.basename(file)}`);
  }
});
