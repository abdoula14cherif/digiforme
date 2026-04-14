import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────────────────── */
const SB   = "https://rxhjuetoxyjrairroycb.supabase.co";
const ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4aGp1ZXRveHlqcmFpcnJveWNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwOTkxMjksImV4cCI6MjA5MTY3NTEyOX0.FTk6DNeI2FSsY6Eg1mKC64lj1-aS9fzTyzTlQbuGn-Q";
const TC   = { livre:"#FFB800", formation:"#FF6B35", logiciel:"#00E5A0", audio:"#B04FFF" };
const TYPES = [
  { id:"all",       label:"Tout",       emoji:"🌐", color:"#00D4FF" },
  { id:"livre",     label:"Livres",     emoji:"📚", color:"#FFB800" },
  { id:"formation", label:"Formations", emoji:"🎬", color:"#FF6B35" },
  { id:"logiciel",  label:"Logiciels",  emoji:"💻", color:"#00E5A0" },
  { id:"audio",     label:"Audio",      emoji:"🎧", color:"#B04FFF" },
];

/* ─────────────────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: 100%; overscroll-behavior: none; }
body { background: #070B17 !important; color: #E8EEFF; font-family: 'DM Sans', sans-serif; }
#root, body > div { background: #070B17; }
.dg-root {
  background: #070B17;
  color: #E8EEFF;
  font-family: 'DM Sans', sans-serif;
  min-height: 100vh;
  max-width: 430px;
  margin: 0 auto;
  position: relative;
  overflow-x: hidden;
}
::-webkit-scrollbar { width: 3px; height: 3px; }
::-webkit-scrollbar-thumb { background: #1E2D55; border-radius: 3px; }

@keyframes dg-spin  { to { transform: rotate(360deg); } }
@keyframes dg-fin   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
@keyframes dg-cin   { from { opacity:0; transform:translateY(20px) scale(.97); } to { opacity:1; transform:none; } }
@keyframes dg-sc    { from { transform:translateX(0); } to { transform:translateX(-50%); } }
@keyframes dg-fl    { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-7px); } }
@keyframes dg-sh    { from { background-position:-200%; } to { background-position:200%; } }
@keyframes dg-ov    { from { opacity:0; } to { opacity:1; } }
@keyframes dg-bt    { from { transform:translateY(100%); } to { transform:translateY(0); } }
@keyframes dg-rt    { from { transform:translateX(100%); } to { transform:translateX(0); } }
@keyframes dg-logo  { 0% { opacity:0; transform:translateY(28px) scale(.88); } 70% { transform:translateY(-3px) scale(1.01); } 100% { opacity:1; transform:none; } }
@keyframes dg-shake { 0%,100%{transform:translateX(0)} 25%,75%{transform:translateX(-5px)} 50%{transform:translateX(5px)} }

.dg-page  { animation: dg-fin .42s cubic-bezier(.22,1,.36,1) both; }
.dg-card  { cursor:pointer; animation:dg-cin .4s cubic-bezier(.22,1,.36,1) both; transition:transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s; }
.dg-card:hover { transform:translateY(-5px) scale(1.03); box-shadow:0 20px 44px rgba(0,0,0,.55); }
.dg-bnr   { animation:dg-sc 32s linear infinite; display:flex; gap:13px; width:max-content; }
.dg-bnr:hover { animation-play-state:paused; }
.dg-shim  { background:linear-gradient(90deg,#0D1426 25%,#1E2D55 50%,#0D1426 75%); background-size:200%; animation:dg-sh 1.5s infinite; }
.dg-btn   { border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-weight:600; transition:all .22s; display:inline-flex; align-items:center; justify-content:center; gap:7px; }
.dg-btn:hover:not(:disabled) { transform:translateY(-2px); }
.dg-btn:active:not(:disabled) { transform:scale(.95); }
.dg-btn:disabled { opacity:.45; cursor:not-allowed; transform:none !important; }
.dg-cy  { background:linear-gradient(135deg,#00D4FF,#0099FF); color:#070B17; }
.dg-cy:hover:not(:disabled)  { box-shadow:0 8px 24px rgba(0,212,255,.4); }
.dg-go  { background:linear-gradient(135deg,#FFB800,#FF7A00); color:#070B17; }
.dg-go:hover:not(:disabled)  { box-shadow:0 8px 24px rgba(255,184,0,.4); }
.dg-wa  { background:linear-gradient(135deg,#25D366,#128C7E); color:#fff; }
.dg-wa:hover:not(:disabled)  { box-shadow:0 8px 24px rgba(37,211,102,.4); }
.dg-rb  { background:rgba(255,80,80,.1); color:#FF5050; border:1px solid rgba(255,80,80,.25) !important; }
.dg-inp {
  background:#131C35; border:1px solid #1E2D55; border-radius:12px;
  color:#E8EEFF; font-family:'DM Sans',sans-serif; font-size:14px;
  padding:12px 15px; width:100%; outline:none; transition:border-color .2s; display:block;
}
.dg-inp:focus { border-color:#00D4FF; box-shadow:0 0 0 3px rgba(0,212,255,.08); }
.dg-inp::placeholder { color:#3A4A6E; }
textarea.dg-inp { resize:vertical; min-height:80px; }
select.dg-inp   { cursor:pointer; -webkit-appearance:none; }
.dg-nb {
  display:flex; flex-direction:column; align-items:center; gap:3px;
  cursor:pointer; padding:7px 0; flex:1; background:none; border:none;
  font-family:'DM Sans',sans-serif; transition:all .2s;
}
.dg-nb:hover { opacity:.8; }
.dg-shake { animation:dg-shake .35s ease; }
`;

/* ─────────────────────────────────────────────────────────
   API HELPERS
───────────────────────────────────────────────────────── */
const getToken = (session) => session?.access_token || ANON;

const db = async (path, opts = {}, token = ANON) => {
  try {
    const res = await fetch(`${SB}/rest/v1/${path}`, {
      ...opts,
      headers: {
        apikey: ANON,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...(["POST","PATCH","PUT"].includes(opts.method) ? { Prefer: "return=representation" } : {}),
        ...(opts.headers || {}),
      },
    });
    let data; try { data = await res.json(); } catch {}
    return { ok: res.ok, data };
  } catch { return { ok: false, data: null }; }
};

const authReq = async (ep, body) => {
  try {
    const res = await fetch(`${SB}/auth/v1/${ep}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: ANON },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch { return { error: "network" }; }
};

const uploadImg = async (file, token) => {
  try {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
    const name = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const res = await fetch(`${SB}/storage/v1/object/digiform/${name}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token || ANON}`, apikey: ANON, "Content-Type": file.type, "x-upsert": "true" },
      body: file,
    });
    return res.ok ? `${SB}/storage/v1/object/public/digiform/${name}` : null;
  } catch { return null; }
};

/* ─────────────────────────────────────────────────────────
   UTILS
───────────────────────────────────────────────────────── */
const tc = (t) => TC[t] || "#00D4FF";
const te = (t) => TYPES.find(x => x.id === t)?.emoji || "📦";
const tp = (p) => Number(p).toLocaleString("fr-FR");
const fmtDate = (d) => new Date(d).toLocaleDateString("fr-FR", { day:"2-digit", month:"short", year:"numeric" });
const fmtTime = (d) => {
  const diff = Date.now() - new Date(d);
  if (diff < 60000) return "À l'instant";
  if (diff < 3600000) return `${Math.floor(diff/60000)}min`;
  if (diff < 86400000) return `${Math.floor(diff/3600000)}h`;
  return fmtDate(d);
};

/* ─────────────────────────────────────────────────────────
   GRADIENT TEXT
───────────────────────────────────────────────────────── */
const G = ({ g, children, style = {} }) => (
  <span style={{ background: g, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", display: "inline-block", lineHeight: 1.1, ...style }}>
    {children}
  </span>
);

const Logo = ({ size = 22 }) => (
  <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: size, lineHeight: 1 }}>
    <G g="linear-gradient(135deg,#fff 20%,#B0D8FF 100%)">DIGI</G>
    <G g="linear-gradient(135deg,#FFB800,#FF6A00)">FORM</G>
  </span>
);

/* ─────────────────────────────────────────────────────────
   SPLASH
───────────────────────────────────────────────────────── */
function Splash() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setP(v => { if (v >= 100) { clearInterval(t); return 100; } return v + 2.1; }), 54);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ position:"fixed", inset:0, background:"radial-gradient(ellipse 90% 70% at 50% 40%, #0D1D40, #070B17)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", zIndex:99999, gap:28, overflow:"hidden" }}>
      {[[220,"rgba(0,212,255,.07)","10%","5%",4.2],[160,"rgba(255,184,0,.05)","62%","62%",5.5],[110,"rgba(176,79,255,.06)","42%","36%",3]].map(([s,c,top,left,d],i) => (
        <div key={i} style={{ position:"absolute", width:s, height:s, borderRadius:"50%", background:c, top, left, filter:"blur(55px)", animation:`dg-fl ${d}s ease-in-out infinite`, animationDelay:`${i*.9}s` }} />
      ))}
      <div style={{ textAlign:"center", animation:"dg-logo 1s cubic-bezier(.22,1,.36,1) both", animationDelay:".3s", padding:"0 20px", width:"100%" }}>
        <div style={{ fontSize:11, letterSpacing:".38em", color:"#00D4FF", fontFamily:"'Syne',sans-serif", fontWeight:600, marginBottom:18, opacity:.9 }}>◆ PLATEFORME DIGITALE ◆</div>
        <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(36px,12vw,52px)", lineHeight:1, letterSpacing:"-.01em", whiteSpace:"nowrap" }}>
          <G g="linear-gradient(135deg,#fff 20%,#B0D8FF 100%)">DIGI</G>
          <G g="linear-gradient(135deg,#FFB800,#FF6A00)">FORM</G>
        </div>
        <div style={{ fontSize:12, color:"#5B6A90", marginTop:14, letterSpacing:".22em", animation:"dg-fin .5s ease both", animationDelay:"1.2s" }}>
          Savoir&nbsp;•&nbsp;Technologie&nbsp;•&nbsp;Excellence
        </div>
      </div>
      <div style={{ width:180, height:3, background:"#0D1426", borderRadius:3, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${p}%`, background:"linear-gradient(90deg,#00D4FF,#FFB800)", borderRadius:3, transition:"width .055s linear", boxShadow:"0 0 12px rgba(0,212,255,.8)" }} />
      </div>
      <div style={{ fontSize:10, color:"#3A4A6E", letterSpacing:".2em" }}>{p < 100 ? "CHARGEMENT..." : "PRÊT ✓"}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PAGE LOADER
───────────────────────────────────────────────────────── */
function PLoader() {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(7,11,23,.9)", backdropFilter:"blur(12px)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", zIndex:5000 }}>
      <div style={{ position:"relative", width:52, height:52 }}>
        {[0,9,18].map((ins,i) => (
          <div key={i} style={{ position:"absolute", inset:ins, borderRadius:"50%", border:"2px solid transparent", borderTop:`2px solid ${["#00D4FF","#FFB800","#FF6B35"][i]}`, animation:`dg-spin ${[.75,1.15,1.6][i]}s linear infinite`, animationDirection:i===1?"reverse":"normal" }} />
        ))}
      </div>
      <div style={{ fontSize:10, letterSpacing:".3em", color:"#5B6A90", marginTop:16, fontFamily:"'Syne',sans-serif" }}>CHARGEMENT…</div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   TOAST
───────────────────────────────────────────────────────── */
function Toast({ t }) {
  if (!t) return null;
  return (
    <div style={{ position:"fixed", top:70, left:"50%", transform:"translateX(-50%)", background: t.type==="error" ? "linear-gradient(135deg,#FF5050,#C00)" : "linear-gradient(135deg,#00E5A0,#00A060)", color:"white", padding:"10px 22px", borderRadius:20, zIndex:9999, fontWeight:600, fontSize:13, boxShadow:"0 10px 30px rgba(0,0,0,.6)", animation:"dg-fin .3s ease", whiteSpace:"nowrap", maxWidth:"90vw", textAlign:"center" }}>
      {t.msg}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   EMPTY
───────────────────────────────────────────────────────── */
function Empty({ msg, sub, emoji = "📭" }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"52px 24px", gap:13, textAlign:"center" }}>
      <div style={{ fontSize:50, animation:"dg-fl 3s ease-in-out infinite" }}>{emoji}</div>
      <div style={{ fontSize:15, fontWeight:600, color:"#8899BB" }}>{msg}</div>
      {sub && <div style={{ fontSize:12, color:"#3A4A6E", lineHeight:1.6 }}>{sub}</div>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   HEADER
───────────────────────────────────────────────────────── */
function Header({ session, unread, onBell, onProfile }) {
  return (
    <header style={{ position:"fixed", top:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:"rgba(7,11,23,.96)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,.07)", padding:"10px 14px", zIndex:200, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
      <div>
        <Logo size={21} />
        <div style={{ fontSize:10, color:"#5B6A90", marginTop:3 }}>Livres · Formations · Logiciels · Audio</div>
      </div>
      <div style={{ display:"flex", gap:9 }}>
        <button onClick={onBell} style={{ width:38, height:38, borderRadius:"50%", background:"rgba(255,184,0,.1)", border:"1px solid rgba(255,184,0,.22)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", position:"relative", fontSize:17 }}>
          🔔
          {unread > 0 && <div style={{ position:"absolute", top:-2, right:-2, width:18, height:18, borderRadius:"50%", background:"#FF5050", color:"white", fontSize:10, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{unread > 9 ? "9+" : unread}</div>}
        </button>
        <button onClick={onProfile} style={{ width:38, height:38, borderRadius:"50%", background:"linear-gradient(135deg,#00D4FF,#0099FF)", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontSize:17, border:"none" }}>
          {session ? "👤" : "🔐"}
        </button>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────────────────
   BOTTOM NAV
───────────────────────────────────────────────────────── */
function BottomNav({ tab, onTab, favCount }) {
  const items = [
    { id:"home", emoji:"🏠", label:"Accueil" },
    { id:"catalogue", emoji:"🗂️", label:"Catalogue" },
    { id:"favs", emoji:"❤️", label:"Favoris", badge: favCount },
    { id:"profile", emoji:"👤", label:"Profil" },
  ];
  return (
    <nav style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:"rgba(7,11,23,.97)", backdropFilter:"blur(20px)", borderTop:"1px solid rgba(255,255,255,.06)", padding:"5px 6px 18px", display:"flex", zIndex:500 }}>
      {items.map(n => (
        <button key={n.id} className="dg-nb" onClick={() => onTab(n.id)} style={{ color: tab === n.id ? "#00D4FF" : "#5B6A90", position:"relative" }}>
          {tab === n.id && <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:22, height:3, borderRadius:2, background:"linear-gradient(90deg,#00D4FF,#0099FF)" }} />}
          <span style={{ fontSize:21, display:"block", transform: tab===n.id ? "scale(1.22)" : "scale(1)", transition:"transform .28s cubic-bezier(.34,1.56,.64,1)" }}>{n.emoji}</span>
          <span style={{ fontSize:10, fontWeight: tab===n.id ? 600 : 400 }}>{n.label}</span>
          {(n.badge || 0) > 0 && <div style={{ position:"absolute", top:5, right:"16%", width:16, height:16, borderRadius:"50%", background:"#FF5050", color:"white", fontSize:9, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{n.badge}</div>}
        </button>
      ))}
    </nav>
  );
}

/* ─────────────────────────────────────────────────────────
   NOTIF PANEL
───────────────────────────────────────────────────────── */
function NotifPanel({ notifs, reads, session, onClose, onRead }) {
  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(7,11,23,.7)", backdropFilter:"blur(8px)", zIndex:600, animation:"dg-ov .22s" }} />
      <div style={{ position:"fixed", top:0, right:0, width:310, maxWidth:"93vw", height:"100vh", background:"#0D1426", borderLeft:"1px solid rgba(255,255,255,.08)", zIndex:700, animation:"dg-rt .3s cubic-bezier(.22,1,.36,1)", display:"flex", flexDirection:"column" }}>
        <div style={{ padding:"17px 13px", borderBottom:"1px solid rgba(255,255,255,.06)", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
          <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:16 }}>🔔 Notifications</span>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,.08)", border:"none", color:"#E8EEFF", width:30, height:30, borderRadius:"50%", cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>
        <div style={{ flex:1, overflowY:"auto", padding:10 }}>
          {!session
            ? <div style={{ padding:"40px 18px", textAlign:"center", color:"#5B6A90", fontSize:13, lineHeight:1.8 }}>🔒 Connectez-vous pour recevoir les notifications</div>
            : notifs.length === 0
              ? <Empty msg="Aucune notification" emoji="🔕" />
              : notifs.map(n => {
                  const isRead = reads.includes(n.id);
                  return (
                    <div key={n.id} onClick={() => !isRead && onRead(n.id)} style={{ padding:13, borderRadius:12, background: isRead ? "transparent" : "rgba(0,212,255,.06)", border:`1px solid ${isRead ? "rgba(255,255,255,.04)" : "rgba(0,212,255,.18)"}`, marginBottom:8, cursor: isRead ? "default" : "pointer" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8, marginBottom:5 }}>
                        <span style={{ fontSize:13, fontWeight:600, color:"#E8EEFF", flex:1 }}>{n.title}</span>
                        {!isRead && <div style={{ width:8, height:8, borderRadius:"50%", background:"#00D4FF", flexShrink:0, marginTop:3 }} />}
                      </div>
                      <div style={{ fontSize:12, color:"#8899BB", lineHeight:1.65 }}>{n.body}</div>
                      <div style={{ fontSize:10, color:"#3A4A6E", marginTop:6 }}>{fmtTime(n.created_at)}</div>
                    </div>
                  );
                })
          }
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   AUTH MODAL
───────────────────────────────────────────────────────── */
function AuthModal({ onAuth, onClose }) {
  const [mode, setMode]   = useState("login");
  const [f, setF]         = useState({ email:"", password:"", name:"", confirm:"" });
  const [busy, setBusy]   = useState(false);
  const [err, setErr]     = useState("");
  const pwdRef            = useRef();
  const u = (k, v) => setF(p => ({ ...p, [k]: v }));

  const submit = async () => {
    setErr(""); setBusy(true);
    if (mode === "login") {
      const d = await authReq("token?grant_type=password", { email: f.email, password: f.password });
      setBusy(false);
      if (d.access_token) onAuth(d);
      else setErr(d.error_description || d.message || "Identifiants incorrects");
    } else {
      if (!f.name.trim()) { setErr("Nom complet requis"); setBusy(false); return; }
      if (f.password.length < 6) { setErr("Mot de passe : 6 caractères minimum"); setBusy(false); return; }
      if (f.password !== f.confirm) { setErr("Mots de passe différents"); setBusy(false); return; }
      const d = await authReq("signup", { email: f.email, password: f.password, data: { full_name: f.name } });
      setBusy(false);
      if (d.access_token) onAuth(d);
      else if (d.user && !d.access_token) setErr("✉️ Confirmez votre email, puis connectez-vous.");
      else setErr(d.error_description || d.message || "Erreur d'inscription");
    }
  };

  const Spin = () => <span style={{ display:"inline-block", width:14, height:14, border:"2px solid rgba(0,0,0,.3)", borderTop:"2px solid #070B17", borderRadius:"50%", animation:"dg-spin .8s linear infinite" }} />;

  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(7,11,23,.88)", backdropFilter:"blur(14px)", zIndex:800, animation:"dg-ov .28s" }} />
      <div style={{ position:"fixed", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"92%", maxWidth:370, background:"#0D1426", borderRadius:24, border:"1px solid rgba(255,255,255,.09)", zIndex:900, animation:"dg-fin .35s cubic-bezier(.22,1,.36,1)", padding:"26px 22px" }}>
        <div style={{ textAlign:"center", marginBottom:22 }}>
          <Logo size={26} />
          <div style={{ fontSize:13, color:"#8899BB", marginTop:8 }}>{mode==="login" ? "Heureux de vous revoir 👋" : "Rejoignez la communauté 🚀"}</div>
        </div>
        <div style={{ display:"flex", background:"#131C35", borderRadius:12, padding:4, marginBottom:18, border:"1px solid rgba(255,255,255,.06)" }}>
          {[["login","🔑 Connexion"],["register","✨ Inscription"]].map(([m, l]) => (
            <button key={m} onClick={() => { setMode(m); setErr(""); }} className="dg-btn" style={{ flex:1, padding:"10px 0", borderRadius:9, fontSize:13, background: mode===m ? "linear-gradient(135deg,#00D4FF,#0099FF)" : "transparent", color: mode===m ? "#070B17" : "#5B6A90" }}>{l}</button>
          ))}
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {mode === "register" && <input className="dg-inp" placeholder="Nom complet" value={f.name} onChange={e => u("name", e.target.value)} />}
          <input className="dg-inp" type="email" placeholder="Adresse email" value={f.email} onChange={e => u("email", e.target.value)} />
          <input className="dg-inp" type="password" placeholder="Mot de passe (6+ caractères)" value={f.password} onChange={e => u("password", e.target.value)} onKeyDown={e => e.key==="Enter" && submit()} ref={mode==="login" ? pwdRef : undefined} />
          {mode === "register" && <input className="dg-inp" type="password" placeholder="Confirmer le mot de passe" value={f.confirm} onChange={e => u("confirm", e.target.value)} onKeyDown={e => e.key==="Enter" && submit()} />}
        </div>
        {err && <div style={{ marginTop:11, fontSize:12, color:"#FF8080", textAlign:"center", background:"rgba(255,80,80,.08)", padding:"10px 12px", borderRadius:10, lineHeight:1.55 }}>{err}</div>}
        <button className="dg-btn dg-cy" style={{ width:"100%", padding:15, borderRadius:14, fontSize:15, marginTop:13 }} onClick={submit} disabled={busy}>
          {busy ? <><Spin /> Chargement…</> : mode==="login" ? "🔓 Se connecter" : "✅ Créer mon compte"}
        </button>
        <button onClick={onClose} style={{ width:"100%", padding:9, background:"none", border:"none", color:"#5B6A90", fontSize:13, cursor:"pointer", marginTop:5, fontFamily:"'DM Sans',sans-serif" }}>Annuler</button>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   PRODUCT MODAL
───────────────────────────────────────────────────────── */
function ProductModal({ product, favs, onFav, onClose, onBuy, onAuthRequired }) {
  const c = tc(product.type);
  const isFav = favs.includes(product.id);
  const handleFav = () => { if (!onFav) return; onFav(product.id); };

  return (
    <>
      <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(7,11,23,.88)", backdropFilter:"blur(16px)", zIndex:1000, animation:"dg-ov .3s" }} />
      <div style={{ position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)", width:"100%", maxWidth:430, background:"#0D1426", borderRadius:"24px 24px 0 0", zIndex:1001, animation:"dg-bt .35s cubic-bezier(.22,1,.36,1)", maxHeight:"88vh", overflowY:"auto", border:"1px solid rgba(255,255,255,.08)", borderBottom:"none" }}>
        <div style={{ height:195, position:"relative", background: product.image_url ? `url(${product.image_url}) center/cover` : `linear-gradient(135deg,${c}28,#070B17)`, display:"flex", alignItems:"center", justifyContent:"center" }}>
          {!product.image_url && <span style={{ fontSize:70 }}>{te(product.type)}</span>}
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 30%,#0D1426)" }} />
          <button onClick={onClose} style={{ position:"absolute", top:14, right:14, width:34, height:34, borderRadius:"50%", background:"rgba(7,11,23,.78)", border:"none", cursor:"pointer", color:"#E8EEFF", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          <button onClick={handleFav} style={{ position:"absolute", top:14, left:14, width:34, height:34, borderRadius:"50%", background:"rgba(7,11,23,.78)", border:"none", cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>
            {isFav ? "❤️" : "🤍"}
          </button>
        </div>
        <div style={{ padding:"17px 17px 42px" }}>
          <div style={{ fontSize:10, color:c, fontWeight:700, marginBottom:6, letterSpacing:".06em" }}>{te(product.type)} {(product.type||"").toUpperCase()}{product.featured ? " · 🔥 VEDETTE" : ""}</div>
          <div style={{ fontSize:20, fontFamily:"'Syne',sans-serif", fontWeight:800, color:"#E8EEFF", lineHeight:1.3, marginBottom:10 }}>{product.title}</div>
          {product.description && <div style={{ fontSize:14, color:"#8899BB", lineHeight:1.8, marginBottom:16 }}>{product.description}</div>}
          <div style={{ background:"#131C35", borderRadius:14, padding:14, marginBottom:18, border:"1px solid rgba(255,184,0,.16)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:11, color:"#5B6A90", marginBottom:3 }}>Prix</div>
              <div style={{ fontSize:26, fontWeight:800, color:"#FFB800" }}>{tp(product.price)} <span style={{ fontSize:12, color:"#5B6A90" }}>FCFA</span></div>
            </div>
          </div>
          <button className="dg-btn dg-wa" style={{ width:"100%", padding:15, borderRadius:14, fontSize:16, marginBottom:10 }} onClick={() => onBuy(product)}>
            💬 Acheter via WhatsApp
          </button>
          <button className="dg-btn" onClick={onClose} style={{ width:"100%", padding:12, borderRadius:14, fontSize:14, background:"rgba(255,255,255,.05)", color:"#E8EEFF", border:"1px solid rgba(255,255,255,.1)" }}>Fermer</button>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   BANNER CARD
───────────────────────────────────────────────────────── */
function BannerCard({ product, onClick }) {
  const c = tc(product.type);
  return (
    <div onClick={onClick} style={{ width:246, height:152, borderRadius:17, flexShrink:0, overflow:"hidden", position:"relative", cursor:"pointer", background: product.image_url ? `url(${product.image_url}) center/cover` : `linear-gradient(135deg,${c}26,#0D1A3A)`, border:`1px solid ${c}24` }}>
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(7,11,23,.97),rgba(7,11,23,.12) 55%,transparent)" }} />
      <div style={{ position:"absolute", bottom:13, left:12, right:12 }}>
        <div style={{ display:"inline-block", background:`${c}22`, border:`1px solid ${c}40`, color:c, borderRadius:7, padding:"2px 9px", fontSize:10, fontWeight:700, marginBottom:5 }}>{te(product.type)} {(product.type||"").toUpperCase()}</div>
        <div style={{ fontSize:13, fontFamily:"'Syne',sans-serif", fontWeight:700, color:"#E8EEFF", lineHeight:1.3, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{product.title}</div>
        <div style={{ fontSize:12, color:"#FFB800", fontWeight:700, marginTop:4 }}>{tp(product.price)} FCFA</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PRODUCT CARD
───────────────────────────────────────────────────────── */
function ProductCard({ product, idx, favs, onFav, onClick }) {
  const c = tc(product.type);
  return (
    <div className="dg-card" onClick={onClick} style={{ background:"#0D1426", borderRadius:14, overflow:"hidden", border:"1px solid rgba(255,255,255,.06)", animationDelay:`${idx*.07}s`, position:"relative" }}>
      <div style={{ height:110, position:"relative", background: product.image_url ? `url(${product.image_url}) center/cover` : `linear-gradient(135deg,${c}18,#070B17 85%)`, display:"flex", alignItems:"center", justifyContent:"center" }}>
        {!product.image_url && <span style={{ fontSize:34 }}>{te(product.type)}</span>}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(to bottom,transparent 35%,#0D1426)" }} />
        <button onClick={e => { e.stopPropagation(); onFav(product.id); }} style={{ position:"absolute", top:7, right:7, width:27, height:27, borderRadius:"50%", background:"rgba(7,11,23,.78)", backdropFilter:"blur(6px)", border:"none", cursor:"pointer", fontSize:12, display:"flex", alignItems:"center", justifyContent:"center" }}>
          {favs.includes(product.id) ? "❤️" : "🤍"}
        </button>
        <div style={{ position:"absolute", top:7, left:7, background:`${c}22`, border:`1px solid ${c}38`, color:c, borderRadius:6, padding:"2px 7px", fontSize:9, fontWeight:700 }}>{(product.type||"").toUpperCase()}</div>
      </div>
      <div style={{ padding:"9px 10px 12px" }}>
        <div style={{ fontSize:12, fontFamily:"'Syne',sans-serif", fontWeight:700, color:"#E8EEFF", lineHeight:1.35, marginBottom:5, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{product.title}</div>
        <div style={{ fontSize:14, fontWeight:700, color:"#FFB800" }}>{tp(product.price)} <span style={{ fontSize:9, color:"#5B6A90" }}>FCFA</span></div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────────────────────── */
function HomePage({ products, loading, favs, onFav, onSelect, onTab }) {
  const featured = products.filter(p => p.featured);
  const src = featured.length > 0 ? featured : products.slice(0, 5);
  const banner = src.length > 0 ? [...src, ...src] : [];
  const Shim = ({ n = 4 }) => (
    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:11 }}>
      {[...Array(n)].map((_, i) => <div key={i} className="dg-shim" style={{ height:195, borderRadius:14 }} />)}
    </div>
  );

  return (
    <div className="dg-page" style={{ padding:"16px 13px" }}>
      <div style={{ background:"linear-gradient(135deg,#0C1830,#0D2845)", borderRadius:20, padding:"20px 17px", marginBottom:22, border:"1px solid rgba(0,212,255,.1)", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:-20, top:-20, width:130, height:130, borderRadius:"50%", background:"rgba(0,212,255,.07)", filter:"blur(35px)" }} />
        <div style={{ fontSize:11, color:"#5B6A90", marginBottom:5 }}>Bienvenue sur</div>
        <div style={{ marginBottom:6 }}><Logo size={28} /></div>
        <div style={{ fontSize:13, color:"#8899BB", marginBottom:17 }}>Livres · Formations · Logiciels · Audio</div>
        <div style={{ display:"flex", gap:10 }}>
          <button className="dg-btn dg-cy" style={{ padding:"10px 16px", borderRadius:10, fontSize:13 }} onClick={() => onTab("catalogue")}>🔍 Explorer</button>
          <button className="dg-btn dg-go" style={{ padding:"10px 16px", borderRadius:10, fontSize:13 }} onClick={() => onTab("catalogue")}>🔥 Tendances</button>
        </div>
      </div>

      {banner.length > 0 && (
        <div style={{ marginBottom:24 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:11 }}>
            <span style={{ fontSize:15, fontFamily:"'Syne',sans-serif", fontWeight:700 }}>🔥 À la Une</span>
            <button onClick={() => onTab("catalogue")} style={{ background:"none", border:"none", color:"#00D4FF", fontSize:13, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Voir tout →</button>
          </div>
          <div style={{ overflow:"hidden", borderRadius:17 }}>
            <div className="dg-bnr">{banner.map((p, i) => <BannerCard key={`${p.id}-${i}`} product={p} onClick={() => onSelect(p)} />)}</div>
          </div>
        </div>
      )}

      <div style={{ marginBottom:24 }}>
        <div style={{ fontSize:15, fontFamily:"'Syne',sans-serif", fontWeight:700, marginBottom:12 }}>Catégories</div>
        <div style={{ display:"flex", gap:9, overflowX:"auto", paddingBottom:4 }}>
          {TYPES.filter(t => t.id !== "all").map(t => (
            <div key={t.id} onClick={() => onTab("catalogue")} style={{ flexShrink:0, padding:"13px 14px", borderRadius:14, background:`linear-gradient(135deg,${t.color}18,${t.color}06)`, border:`1px solid ${t.color}22`, textAlign:"center", cursor:"pointer", minWidth:80 }}>
              <div style={{ fontSize:26, marginBottom:5 }}>{t.emoji}</div>
              <div style={{ fontSize:11, fontWeight:600, color:t.color }}>{t.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <span style={{ fontSize:15, fontFamily:"'Syne',sans-serif", fontWeight:700 }}>📦 Récents</span>
          <button onClick={() => onTab("catalogue")} style={{ background:"none", border:"none", color:"#00D4FF", fontSize:13, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Voir tout →</button>
        </div>
        {loading ? <Shim /> : products.length === 0 ? <Empty msg="Aucun produit" emoji="🛍️" /> : (
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:11 }}>
            {products.slice(0, 6).map((p, i) => <ProductCard key={p.id} product={p} idx={i} favs={favs} onFav={onFav} onClick={() => onSelect(p)} />)}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   CATALOGUE PAGE
───────────────────────────────────────────────────────── */
function CataloguePage({ products, loading, search, onSearch, filter, onFilter, favs, onFav, onSelect }) {
  const filtered = products.filter(p => {
    const mt = filter === "all" || p.type === filter;
    const ms = !search || (p.title||"").toLowerCase().includes(search.toLowerCase()) || (p.description||"").toLowerCase().includes(search.toLowerCase());
    return mt && ms;
  });
  return (
    <div className="dg-page" style={{ padding:"16px 13px" }}>
      <div style={{ position:"relative", marginBottom:11 }}>
        <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:16 }}>🔍</span>
        <input className="dg-inp" style={{ paddingLeft:42 }} placeholder="Rechercher un produit…" value={search} onChange={e => onSearch(e.target.value)} />
      </div>
      <div style={{ display:"flex", gap:7, overflowX:"auto", paddingBottom:5, marginBottom:17 }}>
        {TYPES.map(t => (
          <button key={t.id} onClick={() => onFilter(t.id)} className="dg-btn" style={{ flexShrink:0, padding:"8px 13px", borderRadius:18, fontSize:12, background: filter===t.id ? `linear-gradient(135deg,${t.color},${t.color}99)` : "rgba(255,255,255,.05)", color: filter===t.id ? "#070B17" : "#E8EEFF", border: filter===t.id ? "none" : "1px solid rgba(255,255,255,.1)" }}>
            {t.emoji} {t.label}
          </button>
        ))}
      </div>
      {loading ? (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:11 }}>
          {[...Array(6)].map((_, i) => <div key={i} className="dg-shim" style={{ height:195, borderRadius:14 }} />)}
        </div>
      ) : filtered.length === 0 ? <Empty msg="Aucun résultat" emoji="🔎" /> : (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:11 }}>
          {filtered.map((p, i) => <ProductCard key={p.id} product={p} idx={i} favs={favs} onFav={onFav} onClick={() => onSelect(p)} />)}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   FAVS PAGE
───────────────────────────────────────────────────────── */
function FavsPage({ products, favs, onFav, onSelect }) {
  return (
    <div className="dg-page" style={{ padding:"16px 13px" }}>
      {products.length === 0
        ? <Empty msg="Aucun favori" sub="Appuyez sur 🤍 pour sauvegarder" emoji="💔" />
        : <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:11 }}>
            {products.map((p, i) => <ProductCard key={p.id} product={p} idx={i} favs={favs} onFav={onFav} onClick={() => onSelect(p)} />)}
          </div>
      }
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PROFILE PAGE
───────────────────────────────────────────────────────── */
function ProfilePage({ session, profile, setProfile, onLogin, onLogout, onToast }) {
  const [editing, setEditing] = useState(false);
  const [f, setF]   = useState({ full_name:"", phone:"" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) setF({ full_name: profile.full_name || "", phone: profile.phone || "" });
  }, [profile]);

  const save = async () => {
    setSaving(true);
    const { ok } = await db(`profiles?id=eq.${session.user.id}`, { method:"PATCH", body: JSON.stringify({ ...f, updated_at: new Date().toISOString() }) }, session.access_token);
    setSaving(false);
    if (ok) { setProfile(p => ({ ...p, ...f })); setEditing(false); onToast("✅ Profil mis à jour !"); }
    else onToast("❌ Erreur", "error");
  };

  if (!session) return (
    <div className="dg-page" style={{ padding:"60px 22px", display:"flex", flexDirection:"column", alignItems:"center", gap:20, textAlign:"center" }}>
      <div style={{ fontSize:58, animation:"dg-fl 3s ease-in-out infinite" }}>👤</div>
      <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20 }}>Connectez-vous</div>
      <div style={{ color:"#8899BB", fontSize:14, lineHeight:1.75 }}>Créez un compte pour accéder à votre profil et recevoir les notifications.</div>
      <button className="dg-btn dg-cy" style={{ padding:"14px 40px", borderRadius:14, fontSize:16 }} onClick={onLogin}>🔑 Se connecter / S'inscrire</button>
    </div>
  );

  const ini = (profile?.full_name || session?.user?.email || "?").charAt(0).toUpperCase();

  return (
    <div className="dg-page" style={{ padding:"16px 13px" }}>
      <div style={{ background:"linear-gradient(135deg,#0C1830,#0D2845)", borderRadius:20, padding:"20px 16px", marginBottom:14, border:"1px solid rgba(0,212,255,.1)", display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ width:60, height:60, borderRadius:"50%", background:"linear-gradient(135deg,#00D4FF,#0099FF)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:800, color:"#070B17", flexShrink:0, fontFamily:"'Syne',sans-serif" }}>{ini}</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:16, fontFamily:"'Syne',sans-serif", fontWeight:700, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{profile?.full_name || "Utilisateur"}</div>
          <div style={{ fontSize:11, color:"#8899BB", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", marginTop:2 }}>{session.user.email}</div>
          {profile?.is_admin && <div style={{ display:"inline-block", background:"rgba(0,212,255,.12)", border:"1px solid rgba(0,212,255,.25)", color:"#00D4FF", borderRadius:7, padding:"2px 10px", fontSize:10, fontWeight:700, marginTop:5 }}>⚙️ ADMINISTRATEUR</div>}
        </div>
      </div>

      {editing ? (
        <div style={{ background:"#0D1426", borderRadius:16, padding:15, border:"1px solid rgba(255,255,255,.07)", marginBottom:12 }}>
          <div style={{ fontSize:13, fontWeight:600, color:"#E8EEFF", marginBottom:11 }}>✏️ Modifier le profil</div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            <div>
              <label style={{ fontSize:11, color:"#5B6A90", display:"block", marginBottom:4 }}>Nom complet</label>
              <input className="dg-inp" value={f.full_name} onChange={e => setF(p => ({ ...p, full_name: e.target.value }))} placeholder="Votre nom" />
            </div>
            <div>
              <label style={{ fontSize:11, color:"#5B6A90", display:"block", marginBottom:4 }}>Téléphone</label>
              <input className="dg-inp" value={f.phone} onChange={e => setF(p => ({ ...p, phone: e.target.value }))} placeholder="+225…" />
            </div>
            <div style={{ display:"flex", gap:9 }}>
              <button className="dg-btn dg-cy" style={{ flex:1, padding:12, borderRadius:11, fontSize:14 }} onClick={save} disabled={saving}>{saving ? "⏳…" : "✅ Sauvegarder"}</button>
              <button className="dg-btn" onClick={() => setEditing(false)} style={{ flex:1, padding:12, borderRadius:11, fontSize:14, background:"rgba(255,255,255,.05)", color:"#E8EEFF", border:"1px solid rgba(255,255,255,.1)" }}>Annuler</button>
            </div>
          </div>
        </div>
      ) : (
        <button className="dg-btn" onClick={() => setEditing(true)} style={{ width:"100%", padding:13, borderRadius:13, fontSize:14, background:"rgba(255,255,255,.05)", color:"#E8EEFF", border:"1px solid rgba(255,255,255,.1)", marginBottom:11 }}>✏️ Modifier le profil</button>
      )}

      {profile?.is_admin && (
        <a href="/admin" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, width:"100%", padding:13, borderRadius:13, fontSize:14, background:"linear-gradient(135deg,rgba(0,212,255,.12),rgba(0,153,255,.07))", color:"#00D4FF", border:"1px solid rgba(0,212,255,.25)", marginBottom:11, textDecoration:"none", fontFamily:"'DM Sans',sans-serif", fontWeight:600, boxSizing:"border-box" }}>
          ⚙️ Panneau Administrateur
        </a>
      )}

      <div style={{ background:"#0D1426", borderRadius:16, padding:15, border:"1px solid rgba(255,255,255,.06)", marginBottom:12 }}>
        <div style={{ fontSize:12, fontWeight:600, color:"#5B6A90", marginBottom:11 }}>Informations du compte</div>
        {[["📧 Email", session.user.email], ["📱 Téléphone", profile?.phone || "Non renseigné"], ["📅 Membre depuis", fmtDate(session.user.created_at || new Date().toISOString())]].map(([l, v]) => (
          <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingBottom:9, marginBottom:9, borderBottom:"1px solid rgba(255,255,255,.04)" }}>
            <span style={{ fontSize:12, color:"#5B6A90" }}>{l}</span>
            <span style={{ fontSize:12, color:"#E8EEFF", textAlign:"right", maxWidth:"60%", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{v}</span>
          </div>
        ))}
      </div>

      <button className="dg-btn dg-rb" style={{ width:"100%", padding:13, borderRadius:13, fontSize:14 }} onClick={onLogout}>🚪 Se déconnecter</button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────────────────── */
export default function App() {
  const [splash,     setSplash]     = useState(true);
  const [tab,        setTab]        = useState("home");
  const [trans,      setTrans]      = useState(false);
  const [products,   setProducts]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [favs,       setFavs]       = useState(() => { try { return JSON.parse(localStorage.getItem("dg_favs") || "[]"); } catch { return []; } });
  const [selected,   setSelected]   = useState(null);
  const [search,     setSearch]     = useState("");
  const [filter,     setFilter]     = useState("all");
  const [session,    setSession]    = useState(() => { try { return JSON.parse(localStorage.getItem("dg_sess") || "null"); } catch { return null; } });
  const [profile,    setProfile]    = useState(null);
  const [notifs,     setNotifs]     = useState([]);
  const [reads,      setReads]      = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showAuth,   setShowAuth]   = useState(false);
  const [toast,      setToast]      = useState(null);

  // Inject global styles once
  useEffect(() => {
    const el = document.createElement("style");
    el.id = "dg-styles";
    if (!document.getElementById("dg-styles")) {
      el.textContent = CSS;
      document.head.appendChild(el);
    }
    return () => { try { document.getElementById("dg-styles")?.remove(); } catch {} };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 3300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => { loadProducts(); loadNotifs(); }, []);

  useEffect(() => {
    if (session) { loadProfile(); loadReads(); }
    else { setProfile(null); setReads([]); }
  }, [session]);

  const loadProducts = async () => {
    setLoading(true);
    const { ok, data } = await db("products?order=created_at.desc");
    if (ok && Array.isArray(data)) setProducts(data);
    setLoading(false);
  };

  const loadNotifs = async () => {
    const { ok, data } = await db("notifications?order=created_at.desc");
    if (ok && Array.isArray(data)) setNotifs(data);
  };

  const loadProfile = async () => {
    if (!session?.user?.id) return;
    const { ok, data } = await db(`profiles?id=eq.${session.user.id}`, {}, session.access_token);
    if (ok && Array.isArray(data) && data[0]) setProfile(data[0]);
  };

  const loadReads = async () => {
    if (!session?.user?.id) return;
    const { ok, data } = await db(`notification_reads?user_id=eq.${session.user.id}&select=notification_id`, {}, session.access_token);
    if (ok && Array.isArray(data)) setReads(data.map(r => r.notification_id));
  };

  const markRead = async (nid) => {
    if (!session || reads.includes(nid)) return;
    await db("notification_reads", { method:"POST", body: JSON.stringify({ user_id: session.user.id, notification_id: nid }) }, session.access_token);
    setReads(r => [...r, nid]);
  };

  const onAuth = (data) => {
    const s = { access_token: data.access_token, refresh_token: data.refresh_token, user: data.user };
    setSession(s);
    try { localStorage.setItem("dg_sess", JSON.stringify(s)); } catch {}
    setShowAuth(false);
    showToast("✅ Connecté avec succès !");
  };

  const onLogout = () => {
    setSession(null); setProfile(null); setReads([]);
    try { localStorage.removeItem("dg_sess"); } catch {}
    showToast("👋 À bientôt !");
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const switchTab = (t) => {
    if (t === tab) return;
    setTrans(true);
    setTimeout(() => { setTab(t); setTrans(false); }, 360);
  };

  const toggleFav = (id) => {
    if (!session) { setShowAuth(true); return; }
    setFavs(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      try { localStorage.setItem("dg_favs", JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const openWA = (p) => {
    if (!session) { setShowAuth(true); return; }
    const num = (p.whatsapp_number || "").replace(/[^0-9+]/g, "");
    if (!num) { showToast("⚠️ Aucun WhatsApp configuré pour ce produit", "error"); return; }
    const msg = encodeURIComponent(`Bonjour 👋\nJe souhaite acquérir :\n\n📦 *${p.title}*\n💰 Prix : *${tp(p.price)} FCFA*\n\nMerci de confirmer la disponibilité 🙏`);
    window.open(`https://wa.me/${num}?text=${msg}`, "_blank");
  };

  const unread = notifs.filter(n => !reads.includes(n.id)).length;
  const favProducts = products.filter(p => favs.includes(p.id));

  if (splash) return <Splash />;

  return (
    <div className="dg-root">
      {trans && <PLoader />}
      <Toast t={toast} />
      {showAuth   && <AuthModal onAuth={onAuth} onClose={() => setShowAuth(false)} />}
      {showNotifs && <NotifPanel notifs={notifs} reads={reads} session={session} onClose={() => setShowNotifs(false)} onRead={markRead} />}

      <Header session={session} unread={unread} onBell={() => setShowNotifs(true)} onProfile={() => { if (session) switchTab("profile"); else setShowAuth(true); }} />

      <main style={{ paddingTop: 68, paddingBottom: 90, minHeight: "100vh" }}>
        {tab === "home"      && <HomePage      products={products} loading={loading} favs={favs} onFav={toggleFav} onSelect={setSelected} onTab={switchTab} />}
        {tab === "catalogue" && <CataloguePage products={products} loading={loading} search={search} onSearch={setSearch} filter={filter} onFilter={setFilter} favs={favs} onFav={toggleFav} onSelect={setSelected} />}
        {tab === "favs"      && <FavsPage      products={favProducts} favs={favs} onFav={toggleFav} onSelect={setSelected} />}
        {tab === "profile"   && <ProfilePage   session={session} profile={profile} setProfile={setProfile} onLogin={() => setShowAuth(true)} onLogout={onLogout} onToast={showToast} />}
      </main>

      <BottomNav tab={tab} onTab={switchTab} favCount={favProducts.length} />

      {selected && <ProductModal product={selected} favs={favs} onFav={toggleFav} onClose={() => setSelected(null)} onBuy={openWA} />}
    </div>
  );
}
