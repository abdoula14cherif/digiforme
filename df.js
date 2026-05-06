/* ================================================
   DIGIFORM — Shared JS Utilities  (df.js)
   Include in every page AFTER df.css
   ================================================ */

const DF = {
  SB:   'https://rxhjuetoxyjrairroycb.supabase.co',
  ANON: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4aGp1ZXRveHlqcmFpcnJveWNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwOTkxMjksImV4cCI6MjA5MTY3NTEyOX0.FTk6DNeI2FSsY6Eg1mKC64lj1-aS9fzTyzTlQbuGn-Q',
  SESS_KEY: 'dg_sess',
  FAVS_KEY: 'dg_favs',

  AVATAR_COLORS: ['#00D4FF','#FFB800','#00E5A0','#9B6DFF','#FF6B35','#FF4F6A','#0099FF','#FF7A00','#25D366','#B04FFF','#00CED1','#FF69B4'],
  COUNTRY_FLAG: {CI:'🇨🇮',CM:'🇨🇲',SN:'🇸🇳',BJ:'🇧🇯',BF:'🇧🇫',ML:'🇲🇱',GH:'🇬🇭',TG:'🇹🇬',OTHER:'🌍'},
  COUNTRY_NAME: {CI:"Côte d'Ivoire",CM:'Cameroun',SN:'Sénégal',BJ:'Bénin',BF:'Burkina Faso',ML:'Mali',GH:'Ghana',TG:'Togo',OTHER:'International'},
  JOB_EMOJI: {marketing:'📣',seo:'🔍',design:'🎨',dev:'💻','e-commerce':'🛒',commercial:'💼',finance:'💰',formation:'🎓',coach:'🎯',consultant:'🧠',manager:'📊',communication:'📡',digital:'🌐',web:'🌐'},

  // ── Session ──
  getSession() {
    try { return JSON.parse(localStorage.getItem(this.SESS_KEY) || 'null'); } catch { return null; }
  },
  setSession(s) {
    try { localStorage.setItem(this.SESS_KEY, JSON.stringify(s)); } catch {}
  },
  clearSession() {
    try { localStorage.removeItem(this.SESS_KEY); } catch {}
  },
  requireAuth(redirectTo = 'auth.html') {
    const s = this.getSession();
    if (!s) { window.location.href = redirectTo; return null; }
    return s;
  },
  redirectIfAuth(to = 'dashboard.html') {
    const s = this.getSession();
    if (s) window.location.href = to;
  },

  // ── Favs ──
  getFavs() { try { return JSON.parse(localStorage.getItem(this.FAVS_KEY) || '[]'); } catch { return []; } },
  setFavs(f) { try { localStorage.setItem(this.FAVS_KEY, JSON.stringify(f)); } catch {} },
  toggleFav(id) {
    const favs = this.getFavs();
    const idx = favs.indexOf(id);
    if (idx > -1) favs.splice(idx, 1); else favs.push(id);
    this.setFavs(favs); return favs.includes(id);
  },

  // ── API ──
  async db(path, opts = {}, token) {
    try {
      const r = await fetch(`${this.SB}/rest/v1/${path}`, {
        ...opts,
        headers: {
          apikey: this.ANON,
          Authorization: `Bearer ${token || this.ANON}`,
          'Content-Type': 'application/json',
          ...(['POST','PATCH','PUT'].includes(opts.method) ? { Prefer: 'return=representation' } : {}),
          ...(opts.headers || {})
        }
      });
      let data; try { data = await r.json(); } catch {}
      return { ok: r.ok, data, status: r.status };
    } catch(e) { return { ok: false, data: null, status: 0 }; }
  },
  async authReq(ep, body) {
    try {
      const r = await fetch(`${this.SB}/auth/v1/${ep}`, {
        method:'POST', headers:{'Content-Type':'application/json',apikey:this.ANON},
        body: JSON.stringify(body)
      });
      return { ok: r.ok, data: await r.json() };
    } catch { return { ok:false, data:null }; }
  },

  // ── Toast ──
  _toastTm: null,
  toast(msg, type = 'ok') {
    clearTimeout(this._toastTm);
    let el = document.getElementById('df-toast');
    if (!el) { el = document.createElement('div'); el.id='df-toast'; document.body.appendChild(el); }
    el.textContent = msg; el.className = 'show ' + type;
    this._toastTm = setTimeout(() => el.classList.remove('show'), 4000);
  },

  // ── Helpers ──
  initials(name) { return (name||'?').split(' ').map(w=>w[0]).filter(Boolean).slice(0,2).join('').toUpperCase(); },
  avatarColor(idx) { return this.AVATAR_COLORS[Math.abs(idx) % this.AVATAR_COLORS.length]; },
  cleanPhone(p) { return (p||'').replace(/[^0-9+]/g,''); },
  fmtPrice(n) { return Number(n).toLocaleString('fr-FR'); },
  today() { return new Date().toISOString().slice(0,10); },
  sleep(ms) { return new Promise(r => setTimeout(r, ms)); },
  isNew(dateStr) { return (new Date() - new Date(dateStr)) < 7 * 86400000; },
  jobEmoji(job) {
    if (!job) return '🌟';
    const k = Object.keys(this.JOB_EMOJI).find(k => job.toLowerCase().includes(k));
    return this.JOB_EMOJI[k] || '🌟';
  },
  countryCode(phone) {
    const p = phone || '';
    if (p.startsWith('+225')) return 'CI';
    if (p.startsWith('+237')) return 'CM';
    if (p.startsWith('+221')) return 'SN';
    if (p.startsWith('+229')) return 'BJ';
    if (p.startsWith('+226')) return 'BF';
    if (p.startsWith('+223')) return 'ML';
    if (p.startsWith('+233')) return 'GH';
    if (p.startsWith('+228')) return 'TG';
    return 'OTHER';
  },

  // ── Nav active state ──
  setNavActive(pageId) {
    document.querySelectorAll('.nb').forEach(b => {
      b.classList.toggle('on', b.dataset.page === pageId);
    });
  },

  // ── Scroll top btn ──
  initScrollTop() {
    const btn = document.getElementById('scroll-top');
    if (!btn) return;
    window.addEventListener('scroll', () => btn.classList.toggle('show', scrollY > 350));
    btn.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
  },

  // ── Download helpers ──
  downloadFile(content, filename, mime) {
    const blob = new Blob([content], { type: mime });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = filename; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  },
  generateCSV(contacts) {
    const H = ['Nom','Prénom','Téléphone','Email','Profession','Pays','Réseau'].map(f=>`"${f}"`).join(',');
    const R = contacts.map(c => {
      const parts = (c.full_name||'').split(' ');
      return [parts.slice(1).join(' '), parts[0]||'', c.phone||'', c.email||'', c.profession||'',
        this.COUNTRY_NAME[c.country_code||this.countryCode(c.phone||'')]||'', 'DIGIFORM · DF']
        .map(f=>`"${(f||'').replace(/"/g,'""')}"`)
        .join(',');
    });
    return '\uFEFF' + [H,...R].join('\r\n');
  },
  toVCard(c) {
    const p = this.cleanPhone(c.phone);
    const parts = (c.full_name||'').split(' ');
    return ['BEGIN:VCARD','VERSION:3.0',
      `FN:${c.full_name||'Membre DIGIFORM'}`,
      `N:${parts.slice(1).join(' ')};${parts[0]};;;`,
      p ? `TEL;TYPE=CELL:${p}` : '',
      c.email ? `EMAIL:${c.email}` : '',
      c.profession ? `TITLE:${c.profession}` : '',
      'ORG:DIGIFORM Network · DF',
      `NOTE:Contact DIGIFORM · DF · ${new Date().toLocaleDateString('fr-FR')}`,
      'END:VCARD'
    ].filter(Boolean).join('\r\n');
  },
  generateVCF(contacts) { return contacts.map(c => this.toVCard(c)).join('\r\n\r\n'); },

  // ── Shared NAV HTML ──
  navHTML(active) {
    const links = [
      { page:'dashboard', href:'dashboard.html', ico:'🏠', lbl:'Accueil' },
      { page:'dashboard', href:'dashboard.html', ico:'🗂️', lbl:'Catalogue', cls:'cat' },
      { page:'network',   href:'network.html',   ico:'🌐', lbl:'Réseau' },
      { page:'profile',   href:'profile.html',   ico:'👤', lbl:'Profil' },
    ];
    return `<nav id="df-nav">${links.map(l=>`
      <a class="nb${l.page===active?' on':''}" href="${l.href}" data-page="${l.page}">
        <div class="nb-dot"></div>
        <span class="nb-ico">${l.ico}</span>
        <span class="nb-lbl">${l.lbl}</span>
      </a>`).join('')}
    </nav>`;
  }
};
