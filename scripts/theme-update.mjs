import fs from 'fs';

let css = fs.readFileSync('src/App.css', 'utf8');

// Replace muted dark theme with vibrant neon dark theme
css = css.replace(/rgba\(7, 11, 22, 0\.72\)/g, 'rgba(9, 9, 14, 0.8)'); // topbar
css = css.replace(/rgba\(15, 23, 42, 0\.58\)/g, 'rgba(20, 20, 28, 0.7)'); // panel
css = css.replace(/rgba\(15, 23, 42, 0\.56\)/g, 'rgba(25, 25, 35, 0.6)'); // card
css = css.replace(/rgba\(15, 23, 42, 0\.62\)/g, 'rgba(30, 30, 40, 0.8)'); // auth-icon
css = css.replace(/rgba\(15, 23, 42, 0\.6\)/g, 'rgba(0, 240, 255, 0.1)'); // traffic-counter

// Borders
css = css.replace(/rgba\(148, 163, 184, 0\.18\)/g, 'rgba(0, 240, 255, 0.2)');
css = css.replace(/rgba\(148, 163, 184, 0\.16\)/g, 'rgba(255, 0, 255, 0.2)');

// Gradients
css = css.replace(/linear-gradient\(135deg, rgba\(59, 130, 246, 0\.88\), rgba\(168, 85, 247, 0\.78\)\)/g, 'linear-gradient(135deg, #00f0ff, #ff003c)');
css = css.replace(/linear-gradient\(135deg, rgba\(59, 130, 246, 0\.95\), rgba\(168, 85, 247, 0\.9\)\)/g, 'linear-gradient(135deg, #ff003c, #c800ff)');

// Text colors
css = css.replace(/rgba\(129, 140, 248, 0\.95\)/g, '#00f0ff'); // eyebrow
css = css.replace(/rgba\(226, 232, 240, 0\.82\)/g, 'rgba(255, 255, 255, 0.8)');
css = css.replace(/rgba\(226, 232, 240, 0\.84\)/g, 'rgba(255, 255, 255, 0.85)');
css = css.replace(/rgba\(226, 232, 240, 0\.9\)/g, 'rgba(255, 255, 255, 0.9)');
css = css.replace(/rgba\(226, 232, 240, 0\.92\)/g, '#fff');

// Box shadows
css = css.replace(/box-shadow: 0 18px 40px rgba\(56, 99, 255, 0\.22\)/g, 'box-shadow: 0 0 20px rgba(0, 240, 255, 0.5)');
css = css.replace(/box-shadow: 0 18px 60px rgba\(3, 6, 18, 0\.48\)/g, 'box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 20px rgba(255, 0, 255, 0.1)');
css = css.replace(/box-shadow: 0 18px 44px rgba\(46, 92, 255, 0\.16\)/g, 'box-shadow: 0 0 30px rgba(0, 240, 255, 0.4)');

// Active states
css = css.replace(/border-color: rgba\(129, 140, 248, 0\.45\)/g, 'border-color: #00f0ff');
css = css.replace(/outline: 3px solid rgba\(129, 140, 248, 0\.55\)/g, 'outline: 3px solid #ff003c');

// Replace light theme colors in the rest of the file
const replacements = [
  [/#f9fbff/g, 'rgba(25, 25, 35, 0.6)'],
  [/#f8fafc/g, 'rgba(20, 20, 28, 0.6)'],
  [/#f7faff/g, 'rgba(30, 30, 40, 0.6)'],
  [/#f6f9ff/g, 'rgba(25, 25, 35, 0.6)'],
  [/#f5f8ff/g, 'rgba(20, 20, 28, 0.6)'],
  [/#f5f9ff/g, 'rgba(25, 25, 35, 0.6)'],
  [/#f8fbff/g, 'rgba(20, 20, 28, 0.6)'],
  [/#ffffff/g, 'rgba(30, 30, 40, 0.8)'],
  [/#fff/g, '#ffffff'],
  
  [/#deebff/g, 'rgba(0, 240, 255, 0.2)'],
  [/#d9e6ff/g, 'rgba(255, 0, 255, 0.2)'],
  [/#dbe6ff/g, 'rgba(0, 240, 255, 0.2)'],
  [/#dbeafe/g, 'rgba(255, 0, 255, 0.2)'],
  [/#d8e5ff/g, 'rgba(0, 240, 255, 0.2)'],
  [/#dbe7ff/g, 'rgba(255, 0, 255, 0.2)'],
  [/#d6e2ff/g, 'rgba(0, 240, 255, 0.2)'],
  [/#e1ebff/g, 'rgba(255, 0, 255, 0.2)'],
  [/#e2e8f0/g, 'rgba(0, 240, 255, 0.2)'],
  [/#cbd5e1/g, 'rgba(255, 255, 255, 0.2)'],
  [/#bfd3ff/g, 'rgba(0, 240, 255, 0.4)'],
  [/#cadbff/g, 'rgba(255, 0, 255, 0.2)'],
  [/#dce6ff/g, 'rgba(0, 240, 255, 0.2)'],
  [/#dfebff/g, 'rgba(255, 0, 255, 0.2)'],
  [/#d7e4ff/g, 'rgba(0, 240, 255, 0.2)'],
  [/#c9d8ff/g, 'rgba(255, 0, 255, 0.2)'],
  [/#b9ccff/g, 'rgba(0, 240, 255, 0.6)'],
  
  [/#2f456f/g, '#ffffff'],
  [/#2f4573/g, '#ffffff'],
  [/#2f4574/g, '#ffffff'],
  [/#30487a/g, '#00f0ff'],
  [/#2e4472/g, '#00f0ff'],
  [/#2b416f/g, '#ffffff'],
  [/#24324e/g, '#ffffff'],
  [/#253a63/g, '#ffffff'],
  [/#334155/g, 'rgba(255, 255, 255, 0.9)'],
  [/#475569/g, 'rgba(255, 255, 255, 0.7)'],
  [/#4f6188/g, 'rgba(255, 255, 255, 0.6)'],
  [/#43557d/g, 'rgba(255, 255, 255, 0.7)'],
  [/#516079/g, 'rgba(255, 255, 255, 0.5)'],
  [/#64748b/g, 'rgba(255, 255, 255, 0.5)'],
  [/#5b6d90/g, 'rgba(255, 255, 255, 0.6)'],
  [/#4b66c5/g, '#c800ff'],
  [/#35527f/g, 'rgba(255, 255, 255, 0.8)'],
  [/#4f65a8/g, '#00f0ff'],
  [/#5a6f9d/g, 'rgba(255, 255, 255, 0.6)'],
  [/#4d66ba/g, '#ff003c'],
  
  [/#3550cf/g, '#00f0ff'],
  [/#3153ff/g, '#00f0ff'],
  [/#3554cc/g, '#00f0ff'],
  [/#2f4ad1/g, '#ff003c'],
  [/#2f52ff/g, '#00f0ff'],
  [/#6f8cff/g, '#ff003c'],
  [/#88a4ff/g, '#c800ff'],
  [/#6c88ff/g, '#00f0ff'],
  [/#8c65ff/g, '#c800ff'],
  
  [/#eef4ff/g, 'rgba(0, 240, 255, 0.1)'],
  [/#edf2ff/g, 'rgba(0, 240, 255, 0.1)'],
  [/#e8efff/g, 'rgba(0, 240, 255, 0.1)'],
  [/#e6edff/g, 'rgba(0, 240, 255, 0.1)'],
  [/#e5eeff/g, 'rgba(255, 255, 255, 0.1)'],
  [/#edf3ff/g, 'rgba(255, 255, 255, 0.05)'],
  [/#dfe8ff/g, 'rgba(255, 0, 60, 0.2)'],
  
  [/#166534/g, '#00ff88'],
  [/#ecfdf3/g, 'rgba(0, 255, 136, 0.1)'],
  [/#9a3412/g, '#ffaa00'],
  [/#fff7ed/g, 'rgba(255, 170, 0, 0.1)'],
  [/#991b1b/g, '#ff003c'],
  [/#fef2f2/g, 'rgba(255, 0, 60, 0.1)'],
];

replacements.forEach(([regex, replacement]) => {
  css = css.replace(regex, replacement);
});

// Fix specific blocks
css = css.replace(/background: #ffffff;/g, 'background: rgba(30, 30, 40, 0.6);');
css = css.replace(/color: #ffffff;/g, 'color: #fff;');

// Add some global neon styles
css += `
/* Neon Additions */
h1 {
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 20px rgba(0, 240, 255, 0.5);
}
.brand-text strong {
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #00f0ff;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
}
.module-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.module-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 10px 30px rgba(255, 0, 255, 0.3);
  border-color: #ff003c;
}
button {
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.2s ease;
}
button:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(255, 0, 60, 0.6);
}
.traffic-counter {
  color: #00f0ff;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
  border-color: #00f0ff;
}
`;

fs.writeFileSync('src/App.css', css);
console.log('Theme updated');
