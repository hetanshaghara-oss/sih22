const fs = require('fs');
fs.cpSync('smartmetrix/dist', 'dist', { recursive: true });
fs.cpSync('smartmetrix/dist', 'public', { recursive: true });
console.log('Copied dist to ./dist and ./public');
