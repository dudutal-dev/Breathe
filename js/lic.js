/* קישור הפעלה אישי (?k=…): מופעל על טלפון אחד, עם תוקף. הקישורים מונפקים באפליקציית הניהול הנפרדת
   (dudutal-dev/Fitness-studio/admin) ונבדקים מול השרת המשותף (worker/lic.js שם, מזהה האפליקציה: breathe).
   השרת מחליט אם האפליקציה דורשת קישור בכלל ("אכיפה"). כשהאכיפה כבויה ואין קישור, האפליקציה פתוחה כמו תמיד.
   קישור רגיל פותח את גרסת משתמש הקצה: המדיה שבעל המוצר פרסם, בלי כלי היצירה (פרומפטים, העלאות, איורים ב-AI).
   בקישור של בעל המוצר המתג "גרסת משתמש קצה" כבוי בניהול (perms.player === false), והוא מקבל את הגרסה המלאה.
   בלי אינטרנט: קישור שאושר ב-21 הימים האחרונים ממשיך לעבוד. */
// eslint-disable-next-line no-unused-vars
const Lic = (() => {
  const APP = 'breathe';
  const WORKER = (typeof window !== 'undefined' && window.__BREATHE_WORKER) || 'https://lohem-reminders.dudu-tal.workers.dev';
  const K = 'breathe.lic', KC = 'breathe.licCfg', KD = 'breathe.dev', KH = 'breathe.hand', KR = 'breathe.remote';
  const GRACE = 21 * 864e5, RECHECK = 30 * 60e3;
  const get = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
  const put = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, JSON.stringify(v)); } catch { /* מצב פרטי */ } };
  const TOKEN = /P\.[a-z0-9]{6,12}\.[A-Za-z0-9_-]{22}/;
  const en = () => { try { return (JSON.parse(localStorage.getItem('breathe.v1') || '{}').lang) === 'en'; } catch { return false; } };
  const T = (he, eng) => (en() ? eng : he);
  const isIOS = () => /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isStandalone = () => (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;

  let dev = get(KD);
  if (!dev) { dev = Math.random().toString(36).slice(2, 10).padEnd(8, 'x') + Date.now().toString(36); put(KD, dev); }
  let L = get(K), cfg = get(KC) || { enforce: false }, why = '', gateEl = null;
  const kParam = (() => { const m = TOKEN.exec(new URLSearchParams(location.search).get('k') || ''); return m ? m[0] : ''; })();
  const valid = () => !!L && L.exp > Date.now() && Date.now() - (L.t || 0) < GRACE;
  const playerNow = () => valid() && (L.perms || {}).player !== false;
  // הגרסה נקבעת פעם אחת בטעינה; אם היא משתנה (הפעלה, ביטול, שינוי המתג בניהול) – טוענים מחדש
  const PLAYER = playerNow();
  if (PLAYER) document.documentElement.classList.add('player');
  // אייפון, בדפדפן, עם קישור הפעלה: מסירים את ה-manifest, כדי ש"הוסף למסך הבית" ישמור את הכתובת הנוכחית – עם הקישור בתוכה
  if (kParam && isIOS() && !isStandalone()) { const m = document.querySelector('link[rel="manifest"]'); if (m) m.remove(); }
  // תיאור המכשיר: זהה בספארי ובאפליקציה שבמסך הבית – כך הקישור עובר ביניהן דרך השרת
  const fp = () => [screen.width, screen.height, devicePixelRatio, navigator.language, Intl.DateTimeFormat().resolvedOptions().timeZone].join('|');
  const api = async (path, body) => (await fetch(`${WORKER}/${path}`, body ? { method: 'POST', body: JSON.stringify(body) } : undefined)).json();
  const reload = () => { try { location.replace(location.pathname); } catch { location.reload(); } };

  const WHY = () => ({
    used: T('הקישור הזה כבר הופעל בטלפון אחר. כל קישור עובד על טלפון אחד.', 'This link was already activated on another phone. Each link works on one phone.'),
    revoked: T('הקישור בוטל.', 'This link was cancelled.'), expired: T('תוקף הקישור הסתיים.', 'This link has expired.'), gone: T('הקישור הועבר לטלפון אחר.', 'This link was moved to another phone.'),
    bad: T('הקישור לא תקין. כדאי להעתיק אותו שוב במלואו.', 'The link is not valid. Copy it again in full.'), net: T('אין חיבור לרשת. צריך חיבור רק להפעלה הראשונה.', 'No connection. A connection is needed only for the first activation.'),
  });
  const steps = () => (isIOS()
    ? [[T('כפתור השיתוף', 'Share button'), T('בספארי: הריבוע עם החץ, בתחתית המסך', 'In Safari: the square with the arrow, at the bottom')], [T('הוסף למסך הבית', 'Add to Home Screen'), T('גוללים מעט למטה ברשימה', 'Scroll down a little in the list')], [T('פותחים מהאייקון החדש', 'Open from the new icon'), T('האפליקציה תופיע במסך הבית', 'The app appears on the home screen')]]
    : [[T('תפריט הדפדפן ⋮', 'Browser menu ⋮'), T('למעלה, בפינת המסך', 'At the top corner')], [T('התקנת האפליקציה', 'Install app'), T('או "הוספה למסך הבית"', 'or "Add to Home screen"')]]);
  const stepsHtml = () => `<ol class="lic-steps">${steps().map(([t, d]) => `<li><b>${t}</b><span>${d}</span></li>`).join('')}</ol>`;
  const fmtDate = (t) => new Date(t).toLocaleDateString(en() ? 'en-GB' : 'he-IL', { day: 'numeric', month: 'numeric', year: 'numeric' });
  const clean = (s) => String(s || '').replace(/[<>&"']/g, '');

  function gate() {   // מסך הנעילה: מופיע רק כשהאכיפה פועלת ואין קישור בתוקף
    const lock = cfg.enforce && !valid();
    document.documentElement.classList.toggle('locked', lock);
    if (!lock) { if (gateEl) gateEl.remove(); gateEl = null; return; }
    const wait = isIOS() && !isStandalone();   // באייפון ההפעלה נעשית מהאפליקציה שבמסך הבית
    if (!gateEl) {
      gateEl = document.createElement('div');
      gateEl.className = 'lic-gate'; gateEl.setAttribute('role', 'dialog'); gateEl.setAttribute('aria-modal', 'true');
      document.body.append(gateEl);
      gateEl.addEventListener('submit', async (e) => {
        e.preventDefault();
        const m = TOKEN.exec(gateEl.querySelector('input').value), btn = gateEl.querySelector('button');
        if (!m) { why = 'bad'; return gate(); }
        btn.disabled = true; await activate(m[0]); if (gateEl) gateEl.querySelector('button').disabled = false;
      });
    }
    const inp = gateEl.querySelector('input'), typed = inp ? inp.value : '';
    gateEl.innerHTML = `<div class="lic-box"><img src="icons/icon-192.png" alt="" width="76" height="76">
      <h2>${T('נדרש קישור הפעלה', 'An activation link is required')}</h2>
      <p class="lic-msg">${why ? WHY()[why] || WHY().bad : wait && kParam ? T('הקישור התקבל. כדי להפעיל אותו, מוסיפים את האפליקציה למסך הבית ופותחים אותה משם:', 'The link was received. To activate it, add the app to the home screen and open it from there:') : T('כדי להשתמש באפליקציה צריך קישור הפעלה אישי.', 'A personal activation link is needed to use the app.')}</p>
      ${wait ? stepsHtml() + (kParam ? `<p class="lic-note" style="margin:-6px 0 14px">${T('אחרי הפתיחה מהאייקון האפליקציה תופעל לבד.', 'After opening from the icon, the app activates by itself.')}</p>` : '') : ''}
      <form class="lic-form" ${wait && kParam && !why ? 'hidden' : ''}>
        <input dir="ltr" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="P.xxxxxxxx.xxxx" aria-label="${T('קישור או קוד הפעלה', 'Activation link or code')}">
        <button class="btn primary block">${T('הפעלה', 'Activate')}</button>
        <p class="lic-note">${T('מדביקים כאן את הקישור או את הקוד שקיבלתם.', 'Paste here the link or the code you received.')}</p>
      </form></div>`;
    if (typed) gateEl.querySelector('input').value = typed;
  }

  // אישור אחרי הפעלה מוצלחת: למי הקישור, עד מתי, ושהוא עובד בטלפון הזה בלבד. ״המשך״ טוען את הגרסה שהקישור פותח.
  function activated() {
    if (gateEl) { gateEl.remove(); gateEl = null; }
    const el = document.createElement('div');
    el.className = 'lic-gate'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true');
    const st = isStandalone() ? '' : `<p class="lic-note" style="margin:0 0 8px">${T('כדי לפתוח אותה כמו כל אפליקציה, כדאי להוסיף אותה למסך הבית:', 'To open it like any app, add it to the home screen:')}</p>${stepsHtml()}`;
    el.innerHTML = `<div class="lic-box"><img src="icons/icon-192.png" alt="" width="76" height="76"><div><span class="lic-ok">✓</span></div>
      <h2>${T('האפליקציה הופעלה', 'The app is activated')}</h2>
      <p class="lic-msg">${L.name ? T(`קישור ההפעלה של <b>${clean(L.name)}</b> נקלט`, `The activation link for <b>${clean(L.name)}</b> was accepted`) : T('קישור ההפעלה נקלט', 'The activation link was accepted')}, ${T('והוא בתוקף עד', 'and it is valid until')} ${fmtDate(L.exp)}. ${T('הקישור עובד בטלפון הזה בלבד.', 'The link works on this phone only.')}</p>
      ${st}<button class="btn primary block">${T('המשך', 'Continue')}</button></div>`;
    el.querySelector('button').addEventListener('click', reload);
    document.body.append(el);
  }

  async function activate(tok) {
    why = '';
    try {
      const r = await api('lic/activate', { token: tok, dev, app: APP });
      if (r.ok) { L = { id: r.id, name: r.name, exp: r.exp, perms: r.perms || {}, token: tok, t: Date.now() }; put(K, L); document.documentElement.classList.remove('locked'); activated(); return true; }
      why = r.why || 'bad'; if (L && L.token === tok) { L = null; put(K, null); }
    } catch { why = 'net'; }
    gate();
    return false;
  }
  async function check() {
    if (!L) return;
    try {
      const r = await api('lic/check', { id: L.id, dev });
      if (r.ok) { L = Object.assign({}, L, { name: r.name, exp: r.exp, perms: r.perms || {}, t: Date.now() }); put(K, L); }
      else if (['revoked', 'expired', 'gone', 'bad'].includes(r.why)) { why = r.why; L = null; put(K, null); }
    } catch { /* אין רשת: ממשיכים לפי תקופת החסד */ }
    if (playerNow() !== PLAYER && !(cfg.enforce && !valid())) return reload();   // הגרסה השתנתה
    gate();
  }

  async function init() {
    gate();
    try { const c = await api(`lic/cfg?app=${APP}`); if (typeof c.enforce === 'boolean') { cfg = { enforce: c.enforce }; put(KC, cfg); } } catch { /* אין רשת: לפי ההגדרה האחרונה שנשמרה */ }
    const browserOnIos = isIOS() && !isStandalone();
    // אפליקציה מותקנת שנפתחת עם הקישור שבכתובת שלה: מפעילים רק כשאין קישור בתוקף (ולא דורסים קישור חדש יותר שהודבק)
    if (kParam && (!L || L.token !== kParam) && !(isStandalone() && valid())) {
      // באייפון מפעילים רק מהאפליקציה שבמסך הבית, כדי שההפעלה האחת לא תתבזבז על הדפדפן. הקישור מחכה לה בשרת רבע שעה.
      if (browserOnIos) api('lic/hand-put', { app: APP, fp: fp(), k: kParam }).catch(() => {});
      else { await activate(kParam); return; }
    } else if (cfg.enforce && !valid() && isIOS() && isStandalone()) {
      // האפליקציה שבמסך הבית נפתחה בלי קישור: בודקים אם מחכה לה אחד מהדפדפן
      const asked = get(KH) || 0; put(KH, Math.min(9, asked + 1));
      for (let n = 0; n < (asked < 6 ? 3 : 1) && !valid(); n++) {
        try { const r = await api('lic/hand-get', { app: APP, fp: fp() }); if (r && r.k) { put(KH, 9); await activate(r.k); return; } } catch { break; }
        await new Promise((res) => setTimeout(res, 3000));
      }
    }
    if (L && Date.now() - (L.t || 0) > RECHECK) await check(); else gate();
    if (PLAYER && valid()) syncRemote();
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden && L && Date.now() - (L.t || 0) > RECHECK) check().then(() => { if (PLAYER && valid()) syncRemote(); }); });

  // ───── המדיה שפורסמה (גרסת משתמש הקצה) ─────
  let remote = PLAYER ? get(KR) : null;
  const listeners = new Set();
  const mediaUrl = (key, f) => `${WORKER}/breathe/m?k=${encodeURIComponent(key)}&id=${L ? L.id : ''}&dev=${dev}&v=${(f && f.added) || 0}`;
  async function syncRemote() {
    try {
      const r = await api('breathe/manifest', { id: L.id, dev });
      if (!r.ok || !r.manifest) return;
      if (remote && remote.v === r.manifest.v) return;
      remote = r.manifest; put(KR, remote);
      listeners.forEach((f) => { try { f(remote); } catch { /* */ } });
    } catch { /* אין רשת: לפי מה שנשמר */ }
  }

  // ───── פרסום (בעל המוצר): סיסמת הניהול ← העלאת הקבצים שהשתנו ← קביעת הרשימה ─────
  let sess = '';
  async function login(pw) { const r = await api('breathe/session', { pw }); if (r.ok) sess = r.sess; return !!r.ok; }
  async function serverList() { const r = await api('breathe/list', { s: sess }); if (!r.ok) throw new Error('auth'); return r.manifest; }
  async function upload(key, blob, type) {
    let last;
    for (let n = 0; n < 3; n++) {
      try {
        const res = await fetch(`${WORKER}/breathe/put?k=${encodeURIComponent(key)}&s=${encodeURIComponent(sess)}`, { method: 'POST', headers: { 'Content-Type': type || blob.type || 'application/octet-stream' }, body: blob });
        const j = await res.json(); if (j.ok) return; last = new Error(j.why || 'upload'); if (res.status === 401 || res.status === 413 || res.status === 400) break;
      } catch (e) { last = e; }
      await new Promise((r) => setTimeout(r, 1500 * (n + 1)));
    }
    throw last || new Error('upload');
  }
  async function publish(files, deck) { const r = await api('breathe/publish', { s: sess, files, deck }); if (!r.ok) throw new Error(r.why === 'auth' ? 'auth' : (r.why || 'publish') + (r.k ? ' ' + r.k : '')); return r; }

  const status = () => (valid() ? T(`קישור הפעלה${L.name ? ` עבור ${clean(L.name)}` : ''} · בתוקף עד ${fmtDate(L.exp)}`, `Activation link${L.name ? ` for ${clean(L.name)}` : ''} · valid until ${fmtDate(L.exp)}`) : '');

  return {
    PLAYER, init, activate, status, valid, enforced: () => !!cfg.enforce, findToken: (s) => { const m = TOKEN.exec(String(s || '')); return m ? m[0] : ''; },
    remote: () => remote, onRemote: (f) => { listeners.add(f); }, mediaUrl,
    login, serverList, upload, publish, MAX_UPLOAD: 99 * 1024 * 1024,
  };
})();

// תרגום לאנגלית של המחרוזות החדשות בממשק (המילון הראשי נוצר אוטומטית ב-js/i18n.js)
if (typeof I18N !== 'undefined') {
  Object.assign(I18N.dict, {
    'קישור הפעלה': 'Activation link', 'קישור הפעלה: הדבקת קישור או קוד': 'Activation link: paste a link or code',
    'אין קישור הפעלה במכשיר הזה.': 'There is no activation link on this device.',
    'קיבלתם קישור או קוד חדש? הדביקו אותו כאן. כל קישור עובד על טלפון אחד.': 'Got a new link or code? Paste it here. Each link works on one phone.',
    'קישור או קוד': 'Link or code', 'הפעלה': 'Activate', 'בודק…': 'Checking…',
    'הקישור לא תקין. כדאי להעתיק אותו שוב במלואו.': 'The link is not valid. Copy it again in full.',
    'ההפעלה לא הצליחה. בדקו את הקישור ואת החיבור לרשת.': 'Activation failed. Check the link and your connection.',
    'ההגדרות, הגבולות והמשימות שלכם נשמרים במכשיר הזה בלבד. קישור ההפעלה נבדק מול השרת בפתיחת האפליקציה.': 'Your settings, limits and tasks are stored on this device only. The activation link is checked with the server when the app opens.',
    'פרסום המדיה למשתמשים עם קישור הפעלה': 'Publish the media to users with an activation link', 'פרסום המדיה': 'Publish the media', 'פרסום': 'Publish',
    'מתפרסמים גם המשימות שהוספתם. תמונות הפרופיל, השמות, הגבולות וההגדרות שלכם לא מתפרסמים. קובץ שהוסר אצלכם יוסר גם מהשרת.': 'Tasks you added are published too. Your profile photos, names, limits and settings are not published. A file you removed is removed from the server as well.',
    'סיסמת הניהול': 'Admin password', 'הסרת כל המדיה מהשרת': 'Remove all media from the server', 'להסיר את כל המדיה מהשרת?': 'Remove all media from the server?',
    'המשתמשים יראו איורים במקום תמונות וסרטונים. הקבצים שבמכשיר שלכם לא נמחקים.': 'Users will see illustrations instead of photos and videos. The files on your device are not deleted.',
    'כן, להסיר': 'Yes, remove', 'מפרסם…': 'Publishing…', 'מתחבר לשרת': 'Connecting to the server', 'מעדכן את הרשימה בשרת': 'Updating the list on the server',
    'השאירו את האפליקציה פתוחה עד הסיום. בפעם הראשונה זה יכול לקחת כמה דקות.': 'Keep the app open until it finishes. The first time can take a few minutes.',
    'הסיסמה לא נכונה': 'Wrong password', 'זו הסיסמה של מסך הניהול של קישורי ההפעלה.': 'This is the password of the activation links admin screen.', 'ניסיון נוסף': 'Try again',
    'המדיה הוסרה מהשרת': 'The media was removed from the server', 'פורסם': 'Published', 'הפרסום לא הושלם': 'Publishing did not finish',
    'המשתמשים יקבלו את העדכון בפתיחה הבאה של האפליקציה.': 'Users get the update the next time they open the app.',
    'הכניסה פגה. נסו שוב.': 'The sign-in expired. Try again.', 'בדקו את החיבור לרשת ונסו שוב. קבצים שכבר הועלו לא יועלו פעם נוספת.': 'Check your connection and try again. Files already uploaded are not uploaded again.',
    '🖼🎬 יש מדיה': '🖼🎬 Has media',
  });
  (I18N.rx = I18N.rx || []).push(
    ['^בודק קובץ (\\d+) מתוך (\\d+)$', 'Checking file $1 of $2'], ['^מעלה קובץ (\\d+) מתוך (\\d+) \\((.+)\\)$', 'Uploading file $1 of $2 ($3)'],
    ['^(\\d+) תמונות וסרטונים של משימות יועלו לאחסון הפרטי שלכם, ויוצגו רק למי שקיבל מכם קישור הפעלה\\. כך המשתמשים מקבלים אפליקציה מוכנה, בלי פרומפטים והעלאות\\.$', '$1 task photos and videos will be uploaded to your private storage and shown only to people you gave an activation link. Users get a ready app, with no prompts or uploads.'],
    ['^(\\d+) קבצים זמינים עכשיו למשתמשים עם קישור הפעלה\\. (\\d+) הועלו עכשיו(?:, ו-(\\d+) הוסרו מהשרת)?\\.$', '$1 files are now available to users with an activation link. $2 uploaded now.'],
  );
}
