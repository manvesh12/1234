const fs = require('fs');
const file = './apps/web/public/legacy/login.html';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/<script defer src="js\/portal\.bundle\.js/g, '<script src="js/portal.bundle.js');
content = content.replace(/<script defer src="js\/model-dsr\.js/g, '<script src="js/model-dsr.js');
fs.writeFileSync(file, content);
console.log('Removed defer successfully!');
