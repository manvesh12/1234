const fs = require('fs');
const file = './apps/web/public/legacy/login.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Inject Inline Styles
const styleInject = `
<style>
/* Modals Overlay Centered and Blurred */
.modal-overlay {
    position: fixed !important; 
    top: 0 !important; 
    left: 0 !important; 
    right: 0 !important; 
    bottom: 0 !important;
    background: rgba(10,25,47,0.7) !important;
    backdrop-filter: blur(8px) !important;
    -webkit-backdrop-filter: blur(8px) !important;
    z-index: 99999 !important; 
    align-items: center !important; 
    justify-content: center !important;
    padding: 20px !important; 
    overflow-y: auto !important;
}
.modal-overlay:not(.open) { display: none !important; }
.modal-overlay.open { display: flex !important; }
.modal-box {
    margin: auto !important;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
    border: 1px solid rgba(255,255,255,0.1) !important;
    pointer-events: auto !important;
}

/* Reviewer Floating Notes CSS */
.reviewer-floating-notes {
  position: fixed !important;
  bottom: 20px !important;
  left: 20px !important;
  width: 320px !important;
  background: white !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15) !important;
  z-index: 99999 !important;
  border: 1px solid var(--border-2) !important;
  display: flex !important;
  flex-direction: column !important;
}

/* Hide Switcher Bars (Blue Lines) */
.dash-switcher-bar, .top-switcher-bar {
  display: none !important;
}
</style>
`;

if (!content.includes('/* Modals Overlay Centered and Blurred */')) {
    content = content.replace('</head>', styleInject + '\n</head>');
}

// 2. Fix JS openModal/closeModal in login.html
content = content.replace(/window\.openModal\s*=\s*function\(id\)\s*{[^}]*};/g, `window.openModal = function(id) { const el = document.getElementById(id); if (el) { el.classList.add('open'); el.style.setProperty('display', 'flex', 'important'); } };`);
content = content.replace(/window\.closeModal\s*=\s*function\(id\)\s*{[^}]*};/g, `window.closeModal = function(id) { const el = document.getElementById(id); if (el) { el.classList.remove('open'); el.style.setProperty('display', 'none', 'important'); } };`);

fs.writeFileSync(file, content);
console.log('Injected fixes!');
