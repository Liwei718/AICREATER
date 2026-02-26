/**
 * Comprehensive Gen Z text color & surface overhaul
 *
 * New text hierarchy:
 *   Heading h1        #f0e6ff  — bright lavender-white
 *   Heading h2/h3     #ede4ff
 *   Heading h4        #e2d4f8
 *   Body (p, li)      #d4c8f0  — warm lavender body text
 *   Secondary         #b8a8e0  — notes, meta, hints
 *   Tertiary          #9082b8  — timestamps, minor labels
 *
 *   Violet accent     #c084fc  (readable light violet)
 *   Pink accent       #f9a8d4
 *   Sky accent        #7dd3fc
 */

import fs from 'fs';
let css = fs.readFileSync('src/App.css', 'utf8');

// ── 1. Heading colors ─────────────────────────────────────────────────────
css = css.replace(
  /h1,\s*h2,\s*h3 \{\s*color: rgba\(255, 255, 255, 0\.94\);/,
  'h1,\nh2,\nh3 {\n  color: #f0e6ff;'
);
css = css.replace(
  /h4 \{\s*color: rgba\(255, 255, 255, 0\.9\);/,
  'h4 {\n  color: #e2d4f8;'
);

// ── 2. Body text ──────────────────────────────────────────────────────────
css = css.replace(
  /p,\s*li \{\s*color: rgba\(255, 255, 255, 0\.8\);/,
  'p,\nli {\n  color: #d4c8f0;'
);
css = css.replace(
  /\.subtitle \{\s*max-width: 720px;\s*color: rgba\(255, 255, 255, 0\.85\);/,
  '.subtitle {\n  max-width: 720px;\n  color: #ddd0f5;'
);

// ── 3. Secondary / tertiary text ──────────────────────────────────────────
// auth-note, auth-message
css = css.replace(
  /\.auth-note,\s*\.auth-message \{\s*margin: 0;\s*color: rgba\(255, 255, 255, 0\.7\);/,
  '.auth-note,\n.auth-message {\n  margin: 0;\n  color: #b8a8e0;'
);
// role-switch span
css = css.replace(
  /\.role-switch span \{\s*color: rgba\(255, 255, 255, 0\.7\);/,
  '.role-switch span {\n  color: #b8a8e0;'
);
// teen-toggle
css = css.replace(
  /\.teen-toggle \{[^}]*color: rgba\(255, 255, 255, 0\.7\);/,
  (m) => m.replace('color: rgba(255, 255, 255, 0.7);', 'color: #b8a8e0;')
);
// highlight-meta
css = css.replace(
  /\.highlight-meta \{\s*color: rgba\(255, 255, 255, 0\.6\);/,
  '.highlight-meta {\n  color: #9082b8;'
);
// news-sources, news-updated
css = css.replace(
  /\.news-sources,\s*\.news-updated \{[^}]*color: rgba\(255, 255, 255, 0\.6\);/,
  (m) => m.replace('color: rgba(255, 255, 255, 0.6);', 'color: #9082b8;')
);
// review-time
css = css.replace(
  /\.review-time \{\s*font-size: 0\.82rem;\s*color: rgba\(255, 255, 255, 0\.5\);/,
  '.review-time {\n  font-size: 0.82rem;\n  color: #9082b8;'
);
// review-history li span
css = css.replace(
  /\.review-history li span \{\s*font-size: 0\.78rem;\s*color: rgba\(255, 255, 255, 0\.5\);/,
  '.review-history li span {\n  font-size: 0.78rem;\n  color: #9082b8;'
);
// empty-tip
css = css.replace(
  /\.empty-tip \{\s*margin: 0;\s*color: rgba\(255, 255, 255, 0\.5\);/,
  '.empty-tip {\n  margin: 0;\n  color: #9082b8;'
);
// avatar-note
css = css.replace(
  /\.avatar-note \{[^}]*color: rgba\(255, 255, 255, 0\.6\);/,
  (m) => m.replace('color: rgba(255, 255, 255, 0.6);', 'color: #b8a8e0;')
);
// footer
css = css.replace(
  /\.footer \{[^}]*color: rgba\(255, 255, 255, 0\.5\);/,
  (m) => m.replace('color: rgba(255, 255, 255, 0.5);', 'color: #9082b8;')
);

// ── 4. Accent text — violet ────────────────────────────────────────────────
// person-area: bump #a855f7 → #c084fc for readability
css = css.replace(
  /\.person-area \{[^}]*color: #a855f7;/,
  (m) => m.replace('color: #a855f7;', 'color: #c084fc;')
);
// family-prompts h4
css = css.replace(
  /\.family-prompts h4 \{[^}]*color: #a855f7;/,
  (m) => m.replace('color: #a855f7;', 'color: #c084fc;')
);
// teacher-topic
css = css.replace(
  /\.teacher-topic \{[^}]*color: #a855f7;/,
  (m) => m.replace('color: #a855f7;', 'color: #c084fc;')
);
// week-tag
css = css.replace(
  /\.week-tag \{[^}]*color: #a855f7;/,
  (m) => m.replace('color: #a855f7;', 'color: #c084fc;')
);
// chip color (inactive)
css = css.replace(
  /button\.chip \{[^}]*color: #a855f7;/,
  (m) => m.replace('color: #a855f7;', 'color: #c084fc;')
);
// news-link
css = css.replace(
  /\.news-link \{\s*color: #a855f7;/,
  '.news-link {\n  color: #c084fc;'
);

// ── 5. Fix BUGS ────────────────────────────────────────────────────────────

// BUG: showcase-card has white background — fix to dark
css = css.replace(
  '.showcase-card {\n  background: white;\n  border: 1px solid rgba(168, 85, 247, 0.30);',
  '.showcase-card {\n  background: #200d3e;\n  border: 1px solid rgba(168, 85, 247, 0.35);'
);

// BUG: review-badge.pending has garbled CSS  `rgba(30, 18, 54, 0.80)7ed`
css = css.replace(
  /\.review-badge\.pending \{\s*background: rgba\(30, 18, 54, 0\.80\)7ed;/,
  '.review-badge.pending {\n  background: rgba(251, 146, 60, 0.15);'
);

// BUG: summary-pop has white background + white text → dark bg, proper text
css = css.replace(
  /\.summary-pop \{[\s\S]*?background: rgba\(255, 255, 255, 0\.98\);[\s\S]*?color: #fff;/,
  (m) => m
    .replace('background: rgba(255, 255, 255, 0.98);', 'background: #1a0e2e;')
    .replace('color: #fff;', 'color: #d4c8f0;')
    .replace('border: 1px solid rgba(236, 72, 153, 0.25);', 'border: 1px solid rgba(168, 85, 247, 0.40);')
    .replace('box-shadow: 0 14px 40px rgba(38, 67, 147, 0.18);', 'box-shadow: 0 14px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(168, 85, 247, 0.20);')
);

// ── 6. Fix remaining semi-transparent surfaces ────────────────────────────
css = css.replace(
  '.showcase-form {\n  display: grid;\n  gap: 0.75rem;\n  background: rgba(20, 20, 28, 0.6);\n  border: 1px solid rgba(236, 72, 153, 0.25);',
  '.showcase-form {\n  display: grid;\n  gap: 0.75rem;\n  background: #1a0e2e;\n  border: 1px solid rgba(168, 85, 247, 0.35);'
);
css = css.replace(
  '.lab-showcase {\n  display: grid;\n  gap: 1rem;\n  border: 1px solid rgba(168, 85, 247, 0.30);\n  border-radius: 14px;\n  background: rgba(28, 18, 50, 0.62);',
  '.lab-showcase {\n  display: grid;\n  gap: 1rem;\n  border: 1px solid rgba(168, 85, 247, 0.35);\n  border-radius: 14px;\n  background: #1a0e2e;'
);
css = css.replace(
  '.challenge-list {\n  border: 1px solid rgba(168, 85, 247, 0.30);\n  border-radius: 12px;\n  background: rgba(30, 18, 54, 0.60);',
  '.challenge-list {\n  border: 1px solid rgba(168, 85, 247, 0.35);\n  border-radius: 12px;\n  background: #200d3e;'
);
css = css.replace(
  '.auth-card {\n  border: 1px solid rgba(168, 85, 247, 0.30);\n  border-radius: 14px;\n  background: rgba(28, 18, 50, 0.62);',
  '.auth-card {\n  border: 1px solid rgba(168, 85, 247, 0.35);\n  border-radius: 14px;\n  background: #1a0e2e;'
);
css = css.replace(
  '.auth-logged-in {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.8rem;\n  flex-wrap: wrap;\n  border: 1px solid rgba(168, 85, 247, 0.30);\n  border-radius: 12px;\n  background: rgba(20, 20, 28, 0.6);',
  '.auth-logged-in {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 0.8rem;\n  flex-wrap: wrap;\n  border: 1px solid rgba(168, 85, 247, 0.35);\n  border-radius: 12px;\n  background: #200d3e;'
);
css = css.replace(
  '.modal-card {\n  width: min(520px, 100%);\n  background: rgba(30, 18, 54, 0.60);',
  '.modal-card {\n  width: min(520px, 100%);\n  background: #1a0e2e;'
);
css = css.replace(
  '.coming-soon-tip {\n  margin: 0;\n  padding: 0.9rem;\n  border-radius: 12px;\n  border: 1px dashed rgba(168, 85, 247, 0.50);\n  background: rgba(30, 18, 54, 0.60);',
  '.coming-soon-tip {\n  margin: 0;\n  padding: 0.9rem;\n  border-radius: 12px;\n  border: 1px dashed rgba(168, 85, 247, 0.50);\n  background: #200d3e;'
);

// ── 7. Fix auth-form inputs ────────────────────────────────────────────────
css = css.replace(
  '.auth-form input {\n  width: 100%;\n  border: 1px solid rgba(255, 255, 255, 0.12);\n  border-radius: 10px;\n  font: inherit;\n  padding: 0.7rem 0.75rem;\n  box-sizing: border-box;\n}',
  '.auth-form input {\n  width: 100%;\n  border: 1px solid rgba(168, 85, 247, 0.30);\n  border-radius: 10px;\n  font: inherit;\n  padding: 0.7rem 0.75rem;\n  box-sizing: border-box;\n  background: rgba(28, 18, 50, 0.80);\n  color: #f0e6ff;\n}'
);
css = css.replace(
  '.showcase-form input,\n.showcase-form textarea,\n.enroll-form input,\n.enroll-form textarea {\n  width: 100%;\n  border: 1px solid rgba(255, 255, 255, 0.12);\n  border-radius: 10px;\n  font: inherit;\n  padding: 0.7rem 0.75rem;\n  box-sizing: border-box;\n}',
  '.showcase-form input,\n.showcase-form textarea,\n.enroll-form input,\n.enroll-form textarea {\n  width: 100%;\n  border: 1px solid rgba(168, 85, 247, 0.30);\n  border-radius: 10px;\n  font: inherit;\n  padding: 0.7rem 0.75rem;\n  box-sizing: border-box;\n  background: rgba(28, 18, 50, 0.80);\n  color: #f0e6ff;\n}'
);

// ── 8. Fix review-history dashed border ──────────────────────────────────
css = css.replace(
  'border-top: 1px dashed #dbe3f0;',
  'border-top: 1px dashed rgba(168, 85, 247, 0.30);'
);

// ── 9. Fix login-tooltip ──────────────────────────────────────────────────
css = css.replace(
  '.login-tooltip {\n  position: absolute;\n  right: 0;\n  top: calc(100% + 8px);\n  background: #1e293b;',
  '.login-tooltip {\n  position: absolute;\n  right: 0;\n  top: calc(100% + 8px);\n  background: #1a0e2e;'
);

// ── 10. Update Gen Z additions block for news-card override ───────────────
// The appended gen-z additions override news-card background with rgba — fix it
css = css.replace(
  /\/\* News card \*\/\s*\.news-card \{\s*border-color: rgba\(168, 85, 247, 0\.22\);\s*background: rgba\(28, 18, 50, 0\.62\);\s*\}/,
  '/* News card */\n.news-card {\n  border-color: rgba(168, 85, 247, 0.30);\n  background: #1a0e2e;\n}'
);

// ── 11. Topnav link color ─────────────────────────────────────────────────
css = css.replace(
  '.topnav a {\n  color: rgba(255, 255, 255, 0.8);',
  '.topnav a {\n  color: #ddd0f5;'
);

// ── 12. brand-text em ────────────────────────────────────────────────────
css = css.replace(
  /\.brand-text em \{[^}]*color: rgba\(226, 232, 240, 0\.76\);/,
  (m) => m.replace('color: rgba(226, 232, 240, 0.76);', 'color: #b8a8e0;')
);

fs.writeFileSync('src/App.css', css);
console.log('✅ Text color overhaul complete');
