const fs = require('fs');
const file = './apps/web/public/legacy/js/model-dsr.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/window\.openModal\s*=\s*function\(id\)\s*{[^}]*};/g, `window.openModal = function(id) { const el = document.getElementById(id); if (el) { el.classList.add('open'); el.style.setProperty('display', 'flex', 'important'); } };`);
content = content.replace(/window\.closeModal\s*=\s*function\(id\)\s*{[^}]*};/g, `window.closeModal = function(id) { const el = document.getElementById(id); if (el) { el.classList.remove('open'); el.style.setProperty('display', 'none', 'important'); } };`);

fs.writeFileSync(file, content);
console.log('Fixed model-dsr.js');
