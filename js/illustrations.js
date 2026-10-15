// איורים – ספרייט SVG של קווי זהב, סגנון טנטרי רך. כל איור ב-viewBox 100×100.
const ILLUSTRATIONS = {
  embrace: `<circle cx="40" cy="24" r="8"/><circle cx="62" cy="18" r="8"/><path d="M34 32c-9 10-11 24-6 38 2 7 2 14 0 22M46 32c6 8 8 18 5 30-2 10 0 18 4 30"/><path d="M68 25c9 10 10 24 4 40-2 6-2 14 0 27M56 26c-3 6-4 12-3 18"/><path d="M66 42c-8 8-18 11-30 10 6 5 15 6 22 3"/><path d="M28 94h14M60 94h14" opacity=".6"/>`,
  kiss: `<path d="M14 18c12-3 20 6 20 16 0 7-4 9-2 13l5 2-3 4 3 4-5 2c-2 7-9 9-16 7"/><path d="M86 18c-12-3-20 6-20 16 0 7 4 9 2 13l-5 2 3 4-3 4 5 2c2 7 9 9 16 7"/><path d="M36 55q7 3 14 0M50 55q7 3 14 0" opacity=".8"/><path d="M14 18c-4 14-4 28 0 44M86 18c4 14 4 28 0 44"/>`,
  arch: `<circle cx="80" cy="28" r="8"/><path d="M74 35c-16 4-33 17-48 42M73 42c-11 8-21 19-28 36"/><path d="M14 92c6-10 14-15 24-15"/><path d="M52 50c6-2 12-2 18 0" stroke-dasharray="2 3" opacity=".7"/>`,
  neck: `<path d="M34 8c0 16 2 28 14 37 8 6 11 14 9 25"/><path d="M34 8c-7 10-7 24-3 38M44 8c4 10 4 20 2 30" opacity=".7"/><path d="M60 60c4-4 10-5 14-1 4-4 10-3 14 1-4 6-9 8-14 7-5 1-10-1-14-7z"/><path d="M60 60q14 2 28 0"/>`,
  shoulder: `<path d="M8 84c10-30 30-48 62-48 10 0 16 2 22 6"/><path d="M26 58c7-4 15-7 24-7"/><path d="M62 34c8-14 10-24 8-30M72 36c6-10 8-20 6-28M82 40c4-8 6-16 6-24" opacity=".8"/><path d="M40 78c6-6 14-10 24-10" stroke-dasharray="2 3" opacity=".7"/>`,
  legs: `<path d="M28 6c12 28 12 52 2 88M46 6c12 28 12 52 2 88"/><path d="M72 94c-8-30-6-58 8-88"/><path d="M30 70c8-4 14-4 20 0" opacity=".7"/>`,
  lotus: `<path d="M50 76c-7-14-5-30 0-44 5 14 7 30 0 44z"/><path d="M50 76C36 72 26 60 24 42c12 4 22 16 26 34z"/><path d="M50 76c14-4 24-16 26-34-12 4-22 16-26 34z"/><path d="M50 76C34 78 20 72 10 60c14-2 28 2 40 16z"/><path d="M50 76c16 2 30-4 40-16-14-2-28 2-40 16z"/><path d="M28 88q22 8 44 0" stroke-dasharray="3 4"/>`,
  hands: `<path d="M22 92V64c-6-8-9-20-6-32l6 2 2 14V24c0-4 6-4 6 0v22M30 46V14c0-4 6-4 6 0v30M36 44V18c0-4 6-4 6 0v26M42 46V26c0-4 6-4 6 0v22c0 12-5 20-12 24"/><path d="M78 92V64c6-8 9-20 6-32l-6 2-2 14V24c0-4-6-4-6 0v22M70 46V14c0-4-6-4-6 0v30M64 44V18c0-4-6-4-6 0v26M58 46V26c0-4-6-4-6 0v22c0 12 5 20 12 24"/>`,
  spine: `<path d="M50 6v88"/><circle cx="50" cy="14" r="4"/><circle cx="50" cy="27" r="4"/><circle cx="50" cy="40" r="4"/><circle cx="50" cy="53" r="4"/><circle cx="50" cy="66" r="4"/><circle cx="50" cy="79" r="4"/><circle cx="50" cy="91" r="3" fill="currentColor"/><path d="M38 6c0 14 24 14 24 28S38 48 38 62s24 14 24 28" opacity=".7"/><path d="M62 6c0 14-24 14-24 28s24 14 24 28-24 14-24 28" opacity=".7"/>`,
  yabyum: `<circle cx="37" cy="20" r="7"/><circle cx="63" cy="20" r="7"/><path d="M37 27c-7 10-9 20-7 34M63 27c7 10 9 20 7 34"/><path d="M33 40c10 5 24 5 34 0M33 50c10 5 24 5 34 0"/><path d="M16 74q34 14 68 0"/><path d="M24 64q26 10 52 0"/><path d="M44 20h12" stroke-dasharray="2 3"/>`,
  breath: `<path d="M8 34q10-10 21 0t21 0 21 0 21 0"/><path d="M8 50q10-10 21 0t21 0 21 0 21 0"/><path d="M8 66q10-10 21 0t21 0 21 0 21 0"/>`,
  moon: `<path d="M60 10a38 38 0 1 0 0 80 30 30 0 1 1 0-80z"/><circle cx="26" cy="24" r="2" fill="currentColor"/><circle cx="18" cy="40" r="1.5" fill="currentColor"/>`,
  sun: `<circle cx="50" cy="50" r="16"/><path d="M50 8v12M50 80v12M8 50h12M80 50h12M20 20l9 9M71 71l9 9M20 80l9-9M71 29l9-9"/>`,
  infinity: `<path d="M50 50c-10-16-30-16-30 0s20 16 30 0 30-16 30 0-20 16-30 0z"/>`,
  mandala: `<circle cx="50" cy="50" r="42"/><circle cx="50" cy="50" r="28"/><circle cx="50" cy="50" r="10"/><ellipse cx="50" cy="26" rx="6" ry="12" transform="rotate(0 50 50)"/><ellipse cx="50" cy="26" rx="6" ry="12" transform="rotate(45 50 50)"/><ellipse cx="50" cy="26" rx="6" ry="12" transform="rotate(90 50 50)"/><ellipse cx="50" cy="26" rx="6" ry="12" transform="rotate(135 50 50)"/><ellipse cx="50" cy="26" rx="6" ry="12" transform="rotate(180 50 50)"/><ellipse cx="50" cy="26" rx="6" ry="12" transform="rotate(225 50 50)"/><ellipse cx="50" cy="26" rx="6" ry="12" transform="rotate(270 50 50)"/><ellipse cx="50" cy="26" rx="6" ry="12" transform="rotate(315 50 50)"/>`,
  heart: `<path d="M50 88S12 62 12 36a17 17 0 0 1 38-8 17 17 0 0 1 38 8c0 26-38 52-38 52z"/><path d="M30 34c2-6 8-9 14-7" opacity=".7"/>`,
  hourglass: `<path d="M26 8h48M26 92h48M30 8c0 20 14 26 14 42s-14 22-14 42M70 8c0 20-14 26-14 42s14 22 14 42"/><path d="M36 18h28l-14 16zM50 66l-10 18h20z" fill="currentColor"/>`,
  ring: `<circle cx="50" cy="50" r="30"/><circle cx="50" cy="50" r="21"/>`,
  ritual: `<path d="M50 10c-7 8-8 14 0 20 8-6 7-12 0-20z"/><rect x="40" y="36" width="20" height="26" rx="2"/><path d="M20 70h60M26 70v12h48V70"/><path d="M30 92h40"/>`,
  eye: `<path d="M6 50q44-38 88 0-44 38-88 0z"/><circle cx="50" cy="50" r="15"/><circle cx="50" cy="50" r="7" fill="currentColor"/><circle cx="56" cy="44" r="3" fill="var(--bg,#000)"/><path d="M20 38l-6-8M32 30l-3-9M50 27v-9M68 30l3-9M80 38l6-8"/>`,
  lips: `<path d="M10 50c12-16 24-18 40-10 16-8 28-6 40 10-12 18-24 24-40 22-16 2-28-4-40-22z"/><path d="M10 50q40 6 80 0"/><path d="M56 53v8h9v-8"/><path d="M42 42q8-3 8 2 0-5 8-2"/>`,
  tongue: `<path d="M18 40q32-22 64 0c-6 26-14 38-32 42C32 78 24 66 18 40z"/><path d="M18 40q32 8 64 0"/><path d="M40 52c0 14 4 26 10 30 6-4 10-16 10-30M50 54v20"/>`,
  whisper: `<path d="M34 46c-9 0-15-8-13-18 2-11 11-16 19-13 8 4 8 13 2 17-4 3-5 6-3 9"/><path d="M42 46c0 6-6 9-10 5"/><path d="M58 60c6-6 14-8 22-6 6 2 8 6 6 8-8 2-16 4-22 10"/><path d="M58 62q14 2 28 0"/><path d="M62 22q6 8 0 16M70 16q10 14 0 28"/>`,
  candle: `<path d="M34 40h24c2 0 4 2 4 4v42c0 3-2 5-5 5H35c-3 0-5-2-5-5V44c0-2 2-4 4-4z"/><path d="M46 40V30"/><path d="M46 8c-7 8-8 14 0 20 8-6 7-12 0-20z"/><path d="M38 40c-4 8 2 10 1 18M56 40c4 7-1 10 0 17"/><path d="M8 92c14-12 26-14 40-10 10 3 20 2 44-14" />`,
  oil: `<path d="M40 6h20v10l8 10v36c0 4-3 7-7 7H39c-4 0-7-3-7-7V26l8-10z"/><path d="M32 42h36"/><path d="M50 56c-5-6-6-10 0-16 6 6 5 10 0 16z" fill="currentColor"/><path d="M8 94c14-10 28-14 44-10 12 3 22 0 40-12"/>`,
  bath: `<path d="M8 50h84v10a18 18 0 0 1-18 18H26A18 18 0 0 1 8 60z"/><path d="M14 50V26a6 6 0 0 1 12 0"/><path d="M20 78l-2 10M80 78l2 10"/><path d="M50 50c4-16 10-26 12-36M64 50c2-14 6-24 12-32"/><path d="M58 14l8-4M72 18l8-4"/>`,
  blanket: `<path d="M8 70q42-22 84 0v18H8z"/><path d="M8 78q42-18 84 0" stroke-dasharray="3 4"/><circle cx="30" cy="48" r="9"/><circle cx="46" cy="54" r="8"/><path d="M38 58c12-6 26-6 38 4"/>`,
  feather: `<path d="M76 6C50 10 32 30 26 62c30-4 50-20 50-56z"/><path d="M26 62L70 14"/><path d="M26 62l-8 10M38 52l-10 2M48 42l-10 1M58 32l-10 1"/><path d="M8 92c14-10 28-12 48-8" />`,
  back: `<path d="M30 10c0 16-8 24-8 40 0 14 8 24 16 32M70 10c0 16 8 24 8 40 0 14-8 24-16 32"/><path d="M44 10v8M56 10v8"/><path d="M50 20v50" stroke-dasharray="3 4"/><path d="M38 82c6-6 18-6 24 0"/>`,
  figure: `<circle cx="50" cy="16" r="7"/><path d="M38 36c-5 10-6 18-2 28 2 8 1 18-3 30M62 36c5 10 6 18 2 28-2 8-1 18 3 30"/><path d="M38 36q12-6 24 0"/><path d="M40 38C32 30 32 16 40 6M60 38c8-8 8-22 0-32"/><path d="M26 94h12M62 94h12"/><path d="M44 52h12" stroke-dasharray="2 3"/>`,
  kneel: `<circle cx="34" cy="20" r="8"/><path d="M29 30h12"/><path d="M38 29c5 10 3 20-1 30"/><path d="M40 35c7 3 9 10 6 17"/><path d="M35 42c-9 4-11 12-5 20"/><path d="M36 60c10-1 20-1 26 1 3 1 4 3 4 6l-2 17"/><path d="M64 84H42"/><path d="M20 90h60"/>`,
  speech: `<path d="M12 14h64v38H36L20 66V52h-8z"/><path d="M28 32c6-8 12-9 16-4 4-5 10-4 16 4-6 10-12 12-16 11-4 1-10-1-16-11z"/><path d="M28 32q16 3 32 0"/><circle cx="84" cy="80" r="8"/><circle cx="90" cy="92" r="3"/>`,
  cup: `<path d="M18 36h52v30a16 16 0 0 1-16 16H34a16 16 0 0 1-16-16z"/><path d="M70 44h8a9 9 0 0 1 0 18h-8"/><path d="M32 28q-3-6 0-12M44 28q-3-6 0-12M56 28q-3-6 0-12"/>`,
  mirror: `<ellipse cx="50" cy="40" rx="26" ry="32"/><ellipse cx="50" cy="40" rx="20" ry="26" stroke-dasharray="3 4"/><path d="M50 72v14M34 88h32"/><circle cx="50" cy="26" r="5"/><path d="M50 32c-8 6-9 14-4 26M50 32c8 6 9 14 4 26"/>`,
  bed: `<path d="M10 86V28h14v28h52V86M10 56h80M10 72h80"/><circle cx="30" cy="40" r="6"/><circle cx="44" cy="40" r="6"/><path d="M36 40h2"/><path d="M58 48h22c4 0 6 2 6 6v2H58z"/>`,
  water: `<path d="M50 8C32 32 22 46 28 66c4 14 13 22 22 22s18-8 22-22c6-20-4-34-22-58z"/><path d="M36 62q0 12 10 16"/>`,
  flame: `<path d="M50 6C34 24 22 38 28 60c4 16 14 26 22 26s18-10 22-26c6-22-6-36-22-54z"/><path d="M50 44c-8 10-12 16-8 26 2 6 6 8 8 8s6-2 8-8c4-10 0-16-8-26z"/>`,
  hand: `<path d="M12 94c4-24 14-38 32-46M88 94c-2-16-6-28-14-34"/><path d="M42 42c-4 8-3 19 4 25s17 6 24 0"/><path d="M47 44V27c0-4 6-4 6 0v14M53 41V22c0-4 6-4 6 0v19M59 41V26c0-4 6-4 6 0v18M65 44v-8c0-4 6-4 6 0v15c0 10-6 16-12 18"/>`,
  headphones: `<path d="M50 14c-16 0-26 12-26 30 0 18 11 34 26 34s26-16 26-34c0-18-10-30-26-30z"/><path d="M22 44q28-8 56 0v8q-28 6-56 0z"/><path d="M14 54V40a36 36 0 0 1 72 0v14"/><rect x="8" y="50" width="14" height="22" rx="5"/><rect x="78" y="50" width="14" height="22" rx="5"/>`,
  ice: `<path d="M34 18l16-8 18 8-2 26-16 9-18-8z"/><path d="M34 18l18 8 16-8M52 26v27"/><path d="M8 92c12-14 26-20 44-18 12 2 22-2 40-14"/><path d="M48 60q0 7-4 7t-4-7q0-4 4-9 4 5 4 9z"/>`,
  hanger: `<path d="M50 26a7 7 0 1 1 7-7"/><path d="M50 26v6L10 56q-3 6 3 6h74q6 0 3-6z"/><path d="M28 62c0 10 4 18 10 22q12-4 12-22M50 62c0 10 4 18 12 22q10-4 10-22"/>`,
  brush: `<rect x="30" y="8" width="40" height="42" rx="14"/><path d="M44 50v38M56 50v38M44 88h12"/><path d="M40 18v22M50 14v28M60 18v22"/>`,
  spoon: `<ellipse cx="50" cy="24" rx="14" ry="18"/><path d="M50 42v46"/><path d="M44 86q6 4 12 0"/>`,
  music: `<circle cx="30" cy="72" r="11"/><circle cx="72" cy="62" r="11"/><path d="M41 72V20l42-10v52"/><path d="M41 34l42-10"/>`,
  camera: `<rect x="20" y="10" width="60" height="80" rx="4"/><rect x="27" y="17" width="46" height="50"/><circle cx="50" cy="30" r="5"/><path d="M50 36c-8 4-10 14-6 28M50 36c8 4 10 14 6 28"/><circle cx="72" cy="80" r="3" fill="currentColor"/>`,
  phone: `<rect x="28" y="6" width="44" height="88" rx="8"/><path d="M42 14h16M50 86v.5"/><path d="M50 36c-8 4-10 14-6 28M50 36c8 4 10 14 6 28"/><circle cx="50" cy="30" r="5"/>`,
  marker: `<path d="M20 80l8-26 42-42 18 18-42 42z"/><path d="M28 54l18 18M62 20l18 18"/><path d="M20 80l-6 14 14-6"/>`,
  dice: `<rect x="14" y="14" width="72" height="72" rx="12"/><path d="M32 36l-5-5a3 3 0 1 1 5-3 3 3 0 1 1 5 3zM68 36l-5-5a3 3 0 1 1 5-3 3 3 0 1 1 5 3zM50 54l-5-5a3 3 0 1 1 5-3 3 3 0 1 1 5 3zM32 72l-5-5a3 3 0 1 1 5-3 3 3 0 1 1 5 3zM68 72l-5-5a3 3 0 1 1 5-3 3 3 0 1 1 5 3z" fill="currentColor"/>`,
  stopwatch: `<circle cx="50" cy="56" r="32"/><path d="M50 56V34M50 56l14 10"/><path d="M40 12h20M50 12v12M76 26l6-6"/>`,
  lock: `<rect x="22" y="42" width="56" height="44" rx="8"/><path d="M34 42V30a16 16 0 0 1 32 0v12"/><path d="M50 58l-6-6a4 4 0 1 1 6-4 4 4 0 1 1 6 4z"/><path d="M50 62v10"/>`,
  key: `<circle cx="30" cy="36" r="18"/><circle cx="30" cy="36" r="8"/><path d="M44 48l40 40M72 76l8-8M64 68l8-8"/><path d="M30 10v8M30 54v8M4 36h8M48 36h8"/>`,
  stop: `<path d="M32 8h36l24 24v36L68 92H32L8 68V32z"/><path d="M40 70V46c0-8 6-8 6 0M46 46V34c0-6 6-6 6 0v12M52 36c0-6 6-6 6 0v12M58 42c0-5 6-5 6 0v16c0 10-6 16-16 16h-6"/>`,
  gear: `<circle cx="50" cy="50" r="16"/><path d="M50 8v12M50 80v12M8 50h12M80 50h12M20 20l9 9M71 71l9 9M20 80l9-9M71 29l9-9"/>`,
};

function illustrationSprite() {
  return '<svg xmlns="http://www.w3.org/2000/svg" style="display:none">' +
    Object.entries(ILLUSTRATIONS).map(([id, body]) =>
      `<symbol id="il-${id}" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${body}</symbol>`
    ).join('') + '</svg>';
}

// איורים שנוצרו באפליקציה (AI). נטענים מה-state ומתווספים לספרייט בזמן ריצה.
const CUSTOM_ILLUS = {};
function addCustomIllustration(id, body) {
  CUSTOM_ILLUS[id] = body;
  const svg = document.querySelector('#sprite svg');
  if (!svg) return;
  let sym = svg.querySelector('#il-' + CSS.escape(id));
  if (!sym) { sym = document.createElementNS('http://www.w3.org/2000/svg', 'symbol'); sym.id = 'il-' + id; svg.appendChild(sym); }
  sym.setAttribute('viewBox', '0 0 100 100'); sym.setAttribute('fill', 'none'); sym.setAttribute('stroke', 'currentColor');
  sym.setAttribute('stroke-width', '2.6'); sym.setAttribute('stroke-linecap', 'round'); sym.setAttribute('stroke-linejoin', 'round');
  sym.innerHTML = body;
}
function removeCustomIllustration(id) {
  delete CUSTOM_ILLUS[id];
  const sym = document.querySelector('#sprite svg #il-' + CSS.escape(id)); if (sym) sym.remove();
}

function illus(id, cls = '') {
  if (!ILLUSTRATIONS[id] && !CUSTOM_ILLUS[id]) id = 'heart';
  return `<svg class="il ${cls}" aria-hidden="true"><use href="#il-${id}"/></svg>`;
}
