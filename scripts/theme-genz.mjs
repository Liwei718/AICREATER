/**
 * Gen Z Theme for AI Creator
 * Palette:
 *   Primary   #a855f7  (vivid violet)
 *   Secondary #ec4899  (hot pink)
 *   Tertiary  #38bdf8  (sky blue)
 *   Violet    #7c3aed
 *   Success   #34d399  (emerald)
 *   Warning   #fb923c  (orange)
 *   Error     #f87171  (coral red)
 *
 * Surfaces (dark purple-tinted):
 *   topbar  rgba(12, 8, 22, 0.85)
 *   panel   rgba(20, 14, 36, 0.72)
 *   card    rgba(28, 18, 50, 0.60)
 *
 * Borders:
 *   primary  rgba(168, 85, 247, 0.28)
 *   pink     rgba(236, 72, 153, 0.25)
 *   subtle   rgba(255, 255, 255, 0.08)
 */

import fs from 'fs';

let css = fs.readFileSync('src/App.css', 'utf8');

// ── 1. Surface backgrounds ────────────────────────────────────────────────
const surf = [
  // neon cyan → purple violet surface
  [/rgba\(0, 240, 255, 0\.1\)/g,  'rgba(168, 85, 247, 0.12)'],
  // topbar
  [/rgba\(9, 9, 14, 0\.8\)/g,     'rgba(12, 8, 22, 0.88)'],
  // panel
  [/rgba\(20, 20, 28, 0\.7\)/g,   'rgba(20, 14, 36, 0.75)'],
  // card
  [/rgba\(25, 25, 35, 0\.6\)/g,   'rgba(28, 18, 50, 0.62)'],
  [/rgba\(30, 30, 40, 0\.6\)/g,   'rgba(30, 18, 54, 0.60)'],
  [/rgba\(30, 30, 40, 0\.8\)/g,   'rgba(30, 18, 54, 0.80)'],
  // auth-icon
  [/rgba\(30, 30, 40, 0\.8\)/g,   'rgba(30, 18, 54, 0.85)'],
  // modal
  [/rgba\(15, 23, 42, 0\.55\)/g,  'rgba(12, 8, 22, 0.65)'],
];
surf.forEach(([r, v]) => { css = css.replace(r, v); });

// ── 2. Border colors ──────────────────────────────────────────────────────
const borders = [
  [/rgba\(0, 240, 255, 0\.2\)/g,  'rgba(168, 85, 247, 0.30)'],
  [/rgba\(0, 240, 255, 0\.4\)/g,  'rgba(168, 85, 247, 0.50)'],
  [/rgba\(0, 240, 255, 0\.6\)/g,  'rgba(168, 85, 247, 0.65)'],
  [/rgba\(255, 0, 255, 0\.2\)/g,  'rgba(236, 72, 153, 0.25)'],
  [/rgba\(255, 255, 255, 0\.2\)/g,'rgba(255, 255, 255, 0.12)'],
  [/rgba\(255, 0, 60, 0\.2\)/g,   'rgba(236, 72, 153, 0.25)'],
  // active border
  [/border-color: #00f0ff;/g,     'border-color: #a855f7;'],
  [/border-color: #ff003c;/g,     'border-color: #ec4899;'],
];
borders.forEach(([r, v]) => { css = css.replace(r, v); });

// ── 3. Primary accent (neon cyan → violet) ────────────────────────────────
const accent = [
  [/#00f0ff/g,  '#a855f7'],
  [/#00F0FF/g,  '#a855f7'],
  // glow cyan → violet glow
  [/rgba\(0, 240, 255, 0\.5\)/g,  'rgba(168, 85, 247, 0.55)'],
  [/rgba\(0, 240, 255, 0\.55\)/g, 'rgba(168, 85, 247, 0.55)'],
];
accent.forEach(([r, v]) => { css = css.replace(r, v); });

// ── 4. Secondary accent (neon red → hot pink) ─────────────────────────────
const accent2 = [
  [/#ff003c/g,  '#ec4899'],
  [/#FF003C/g,  '#ec4899'],
  [/rgba\(255, 0, 255, 0\.3\)/g,  'rgba(236, 72, 153, 0.35)'],
  [/rgba\(255, 0, 60, 0\.6\)/g,   'rgba(236, 72, 153, 0.60)'],
];
accent2.forEach(([r, v]) => { css = css.replace(r, v); });

// ── 5. Tertiary accent (magenta → deep violet) ────────────────────────────
css = css.replace(/#c800ff/g, '#7c3aed');
css = css.replace(/#C800FF/g, '#7c3aed');

// ── 6. Success / warning ──────────────────────────────────────────────────
css = css.replace(/#00ff88/g, '#34d399');
css = css.replace(/#ffaa00/g, '#fb923c');

// ── 7. Primary gradient (cyan→red → violet→pink) ─────────────────────────
css = css.replace(
  /linear-gradient\(135deg, #00f0ff, #ff003c\)/g,
  'linear-gradient(135deg, #7c3aed, #ec4899)'
);
css = css.replace(
  /linear-gradient\(135deg, #ff003c, #c800ff\)/g,
  'linear-gradient(135deg, #a855f7, #ec4899)'
);
// progress bar gradient
css = css.replace(
  /linear-gradient\(90deg, #00f0ff, #a855f7\)/g,
  'linear-gradient(90deg, #7c3aed, #ec4899)'
);
css = css.replace(
  /linear-gradient\(90deg, #a855f7, #c800ff\)/g,
  'linear-gradient(90deg, #a855f7, #ec4899)'
);
// flow arrow
css = css.replace(
  /background: #ff003c;/g,
  'background: linear-gradient(90deg, #a855f7, #ec4899);'
);
css = css.replace(
  /border-left: 7px solid #ff003c;/g,
  'border-left: 7px solid #ec4899;'
);

// ── 8. Hero gradient ──────────────────────────────────────────────────────
css = css.replace(
  /radial-gradient\(900px 260px at 12% 0%, rgba\(59, 130, 246, 0\.42\), transparent\s*55%\),\s*radial-gradient\(720px 260px at 88% 12%, rgba\(168, 85, 247, 0\.4\), transparent\s*55%\),\s*linear-gradient\(145deg, rgba\(15, 23, 42, 0\.7\), rgba\(2, 6, 23, 0\.35\) 55%\)/g,
  `radial-gradient(800px 300px at 10% 0%, rgba(124, 58, 237, 0.55), transparent 55%),
    radial-gradient(700px 300px at 90% 10%, rgba(236, 72, 153, 0.45), transparent 55%),
    linear-gradient(145deg, rgba(20, 14, 36, 0.80), rgba(12, 8, 22, 0.40) 55%)`
);

// ── 9. Chip active button ─────────────────────────────────────────────────
css = css.replace(
  /background: #00f0ff;\s*color: #09090b;/g,
  'background: linear-gradient(135deg, #7c3aed, #ec4899); color: #fff;'
);

// ── 10. Outline focus ─────────────────────────────────────────────────────
css = css.replace(
  /outline: 3px solid #ff003c;/g,
  'outline: 3px solid #a855f7;'
);

// ── 11. Timeline border ───────────────────────────────────────────────────
css = css.replace(
  /border-left: 3px solid #c800ff;/g,
  'border-left: 3px solid #a855f7;'
);

// ── 12. Topnav hover ──────────────────────────────────────────────────────
css = css.replace(
  /background: rgba\(148, 163, 184, 0\.14\);/g,
  'background: rgba(168, 85, 247, 0.18);'
);

// ── 13. Neon additions block (appended at end) ────────────────────────────
// Remove any previous Neon Additions blocks
css = css.replace(/\/\* Neon Additions \*\/[\s\S]*$/, '');

// ── 14. Box shadow glows ──────────────────────────────────────────────────
css = css.replace(
  /0 0 20px rgba\(0, 240, 255, 0\.5\)/g,
  '0 0 24px rgba(168, 85, 247, 0.55)'
);
css = css.replace(
  /0 0 30px rgba\(0, 240, 255, 0\.4\)/g,
  '0 0 30px rgba(168, 85, 247, 0.45)'
);
css = css.replace(
  /0 0 20px rgba\(255, 0, 255, 0\.1\)/g,
  '0 0 20px rgba(168, 85, 247, 0.15)'
);
css = css.replace(
  /0 0 10px rgba\(0, 240, 255, 0\.5\)/g,
  '0 0 12px rgba(168, 85, 247, 0.5)'
);

// ── 15. Chip inactive ─────────────────────────────────────────────────────
css = css.replace(
  /background: rgba\(0, 240, 255, 0\.1\);\s*\n(\s*)color: #a855f7;/g,
  'background: rgba(168, 85, 247, 0.12);\n$1color: #a855f7;'
);

// ── 16. Append refined Gen Z additions ───────────────────────────────────
css += `
/* ── Gen Z Theme Additions ─────────────────────────────────── */

/* Topbar brand glow */
.brand-mark {
  box-shadow: 0 0 18px rgba(168, 85, 247, 0.6), 0 0 40px rgba(236, 72, 153, 0.3);
}

/* Vivid nav hover */
.topnav a:hover {
  color: #a855f7;
  background: rgba(168, 85, 247, 0.12);
}

/* Hero gradient override */
.hero {
  border-color: rgba(168, 85, 247, 0.30);
}

/* Card lift on hover */
.card, .module-card {
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(168, 85, 247, 0.25);
  border-color: rgba(168, 85, 247, 0.45);
}
.module-card:hover {
  transform: translateY(-4px) scale(1.015);
  box-shadow: 0 14px 36px rgba(236, 72, 153, 0.30);
  border-color: #ec4899;
}
.module-card.active {
  border-color: #a855f7;
  box-shadow: 0 0 28px rgba(168, 85, 247, 0.40);
}

/* Button polish */
button {
  transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
}
button:not(.ghost):hover {
  filter: brightness(1.1) saturate(1.15);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(168, 85, 247, 0.45);
}
button.ghost:hover {
  background: rgba(168, 85, 247, 0.14);
  border-color: rgba(168, 85, 247, 0.40);
  color: #fff;
}

/* Chip active */
button.chip.active {
  background: linear-gradient(135deg, #7c3aed, #ec4899);
  color: #fff;
  box-shadow: 0 4px 14px rgba(168, 85, 247, 0.45);
}
button.chip {
  background: rgba(168, 85, 247, 0.12);
  color: #a855f7;
  border: 1px solid rgba(168, 85, 247, 0.25);
}

/* Traffic counter */
.traffic-counter {
  background: rgba(168, 85, 247, 0.12) !important;
  border-color: rgba(168, 85, 247, 0.45) !important;
  color: #a855f7 !important;
}
.traffic-value {
  background: linear-gradient(135deg, #a855f7, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
}

/* Eyebrow text */
.eyebrow {
  color: #a855f7;
  letter-spacing: 0.05em;
}

/* News card */
.news-card {
  border-color: rgba(168, 85, 247, 0.22);
  background: rgba(28, 18, 50, 0.62);
}
.news-card:hover {
  border-color: rgba(236, 72, 153, 0.40);
  box-shadow: 0 8px 24px rgba(168, 85, 247, 0.20);
}
.news-meta {
  color: #a855f7;
}
.news-link {
  color: #a855f7;
}
.news-link:hover {
  color: #ec4899;
}

/* Tag badge */
.tag {
  background: rgba(168, 85, 247, 0.15);
  color: #a855f7;
  border: 1px solid rgba(168, 85, 247, 0.30);
}

/* Week tag */
.week-tag {
  background: rgba(168, 85, 247, 0.12);
  color: #a855f7;
}

/* Panel highlight gradient */
.panel {
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.65),
              0 0 0 1px rgba(168, 85, 247, 0.12) inset;
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: rgba(20, 14, 36, 0.5); }
::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #7c3aed, #ec4899);
  border-radius: 999px;
}

/* Mentor comment accent */
.mentor-comment {
  border-left-color: #a855f7;
}

/* Modal */
.modal-card {
  background: rgba(20, 14, 36, 0.97);
  border-color: rgba(168, 85, 247, 0.30);
}

/* Auth form inputs */
.auth-form input,
.showcase-form input,
.showcase-form textarea,
.enroll-form input,
.enroll-form textarea,
.news-search {
  background: rgba(28, 18, 50, 0.60);
  border-color: rgba(168, 85, 247, 0.25);
  color: #fff;
  caret-color: #a855f7;
}
.auth-form input:focus,
.showcase-form input:focus,
.showcase-form textarea:focus,
.enroll-form input:focus,
.news-search:focus {
  outline: none;
  border-color: #a855f7;
  box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.20);
}

/* Review badges */
.review-badge.approved {
  background: rgba(52, 211, 153, 0.15);
  color: #34d399;
}
.review-badge.pending {
  background: rgba(251, 146, 60, 0.15);
  color: #fb923c;
}
.review-badge.rejected {
  background: rgba(248, 113, 113, 0.15);
  color: #f87171;
}

/* Footer */
.footer {
  color: rgba(200, 190, 220, 0.45);
}

/* Auth icon hover */
.auth-icon:hover {
  border-color: rgba(168, 85, 247, 0.55);
  background: rgba(168, 85, 247, 0.12);
}
.auth-icon.wechat { color: #34d399; }
.auth-icon.user   { color: #a855f7; }
`;

fs.writeFileSync('src/App.css', css);
console.log('✅ Gen Z theme applied');
