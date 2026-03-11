import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Inject fonts once
function useFont() {
  useEffect(() => {
    if (document.getElementById('lp-fonts')) return;
    const link = document.createElement('link');
    link.id = 'lp-fonts';
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,700;12..96,800&display=swap';
    document.head.appendChild(link);
  }, []);
}

// Inject CSS once
const STYLES = `
  .lp { --bg:#080810; --s1:#0F0F1A; --s2:#13131F; --b1:rgba(255,255,255,0.06); --b2:rgba(255,255,255,0.11);
    --text:#EDEAF5; --muted:#55556A; --muted2:#8A8AA8;
    --lime:#C8F135; --lime-d:rgba(200,241,53,0.1); --lime-b:rgba(200,241,53,0.22);
    --indigo:#6366F1; --indigo-d:rgba(99,102,241,0.15); --indigo-g:rgba(99,102,241,0.28);
    --violet:#8B5CF6; --amber:#F59E0B; --em:#10B981;
    background:var(--bg); color:var(--text);
    font-family:'Plus Jakarta Sans',sans-serif; font-size:16px; line-height:1.6; overflow-x:hidden; }

  .lp::before { content:''; position:fixed; inset:0;
    background-image:radial-gradient(rgba(255,255,255,0.032) 1px,transparent 1px);
    background-size:32px 32px; pointer-events:none; z-index:0; }

  /* ── NAV ── */
  .lp-nav { position:fixed; top:0; left:0; right:0; z-index:100; padding:16px 48px;
    display:flex; align-items:center; justify-content:space-between;
    border-bottom:1px solid var(--b1); background:rgba(8,8,16,0.82); backdrop-filter:blur(18px); }
  .lp-logo { font-family:'Bricolage Grotesque',sans-serif; font-weight:800; font-size:19px;
    color:var(--text); text-decoration:none; display:flex; align-items:center; gap:10px; cursor:pointer; }
  .lp-logo-mark { width:30px; height:30px; background:var(--lime); border-radius:8px;
    display:flex; align-items:center; justify-content:center; font-size:15px;
    box-shadow:0 0 18px rgba(200,241,53,0.38); flex-shrink:0; }
  .lp-nav-links { display:flex; align-items:center; gap:30px; list-style:none; }
  .lp-nav-links a { color:var(--muted2); text-decoration:none; font-size:14px; font-weight:500; transition:color 0.2s; }
  .lp-nav-links a:hover { color:var(--text); }
  .lp-btn-cta { background:var(--lime); color:#080810; padding:9px 20px; border-radius:8px;
    font-weight:700; font-size:14px; border:none; cursor:pointer;
    transition:box-shadow 0.2s,transform 0.2s; font-family:'Plus Jakarta Sans',sans-serif; }
  .lp-btn-cta:hover { box-shadow:0 0 22px rgba(200,241,53,0.45); transform:translateY(-1px); }

  /* ── HERO ── */
  .lp-hero { position:relative; z-index:1; min-height:100vh;
    display:flex; flex-direction:column; align-items:center; justify-content:center;
    padding:140px 24px 64px; text-align:center; overflow:hidden; }
  .lp-glow1 { position:absolute; top:38%; left:50%; transform:translate(-50%,-50%);
    width:800px; height:500px;
    background:radial-gradient(ellipse,rgba(99,102,241,0.11) 0%,transparent 65%); pointer-events:none; }
  .lp-glow2 { position:absolute; top:52%; left:28%; transform:translate(-50%,-50%);
    width:360px; height:280px;
    background:radial-gradient(ellipse,rgba(200,241,53,0.05) 0%,transparent 65%); pointer-events:none; }
  .lp-badge { display:inline-flex; align-items:center; gap:8px;
    background:var(--lime-d); border:1px solid var(--lime-b); color:var(--lime);
    padding:6px 14px; border-radius:20px; font-size:11px; font-weight:700;
    letter-spacing:0.1em; text-transform:uppercase; margin-bottom:28px;
    animation:lpFadeUp 0.6s ease both; }
  .lp-live-dot { width:7px; height:7px; background:var(--lime); border-radius:50%;
    box-shadow:0 0 8px var(--lime); animation:lpPulse 2s infinite; }
  .lp-h1 { font-family:'Bricolage Grotesque',sans-serif;
    font-size:clamp(44px,7.5vw,96px); font-weight:800; line-height:0.95;
    letter-spacing:-0.04em; max-width:960px;
    animation:lpFadeUp 0.6s 0.1s ease both; }
  .lp-h1 em { font-style:normal; color:var(--lime); }
  .lp-h1 .ghost { color:transparent; -webkit-text-stroke:1px rgba(255,255,255,0.14); }
  .lp-hero-sub { font-size:clamp(15px,1.8vw,19px); color:var(--muted2); max-width:520px;
    margin:28px auto 0; font-weight:300; line-height:1.75;
    animation:lpFadeUp 0.6s 0.2s ease both; }
  .lp-hero-actions { display:flex; gap:12px; margin-top:40px; flex-wrap:wrap;
    justify-content:center; animation:lpFadeUp 0.6s 0.3s ease both; }
  .lp-btn-primary { background:var(--lime); color:#080810; padding:14px 28px; border-radius:10px;
    font-weight:700; font-size:15px; text-decoration:none; border:none; cursor:pointer;
    transition:box-shadow 0.2s,transform 0.2s; display:inline-flex; align-items:center; gap:8px;
    font-family:'Plus Jakarta Sans',sans-serif; }
  .lp-btn-primary:hover { box-shadow:0 0 28px rgba(200,241,53,0.42); transform:translateY(-2px); }
  .lp-btn-ghost { background:transparent; color:var(--text); padding:14px 28px; border-radius:10px;
    font-weight:500; font-size:15px; text-decoration:none; border:1px solid var(--b2); cursor:pointer;
    transition:border-color 0.2s,transform 0.2s; display:inline-flex; align-items:center; gap:8px;
    font-family:'Plus Jakarta Sans',sans-serif; }
  .lp-btn-ghost:hover { border-color:rgba(255,255,255,0.26); transform:translateY(-2px); }
  .lp-hero-meta { margin-top:18px; font-size:12px; color:var(--muted);
    animation:lpFadeUp 0.6s 0.4s ease both; }

  /* ── MOCKUP ── */
  .lp-mockup { margin-top:64px; position:relative; width:100%; max-width:920px;
    animation:lpFadeUp 0.9s 0.5s ease both; }
  .lp-toast-stack { position:absolute; bottom:-8px; left:-28px;
    display:flex; flex-direction:column; gap:8px; z-index:10; }
  .lp-toast { background:var(--s2); border:1px solid var(--b2); border-radius:12px;
    padding:10px 14px; display:flex; align-items:center; gap:10px;
    box-shadow:0 8px 32px rgba(0,0,0,0.5); min-width:220px; }
  .lp-toast:nth-child(1) { animation:lpToastIn 0.4s 1s ease both; }
  .lp-toast:nth-child(2) { animation:lpToastIn 0.4s 1.3s ease both; }
  .lp-toast-icon { font-size:18px; flex-shrink:0; }
  .lp-toast-title { font-size:11px; font-weight:700; color:var(--text); }
  .lp-toast-sub { font-size:10px; color:var(--muted2); }
  .lp-shell { background:var(--s1); border:1px solid var(--b2); border-radius:16px; overflow:hidden;
    box-shadow:0 40px 120px rgba(0,0,0,0.7),0 0 0 1px rgba(255,255,255,0.04); }
  .lp-bar { background:#0A0A14; padding:12px 16px; display:flex; align-items:center; gap:10px;
    border-bottom:1px solid var(--b1); }
  .lp-dots { display:flex; gap:6px; }
  .lp-dots span { width:10px; height:10px; border-radius:50%; }
  .lp-dots span:nth-child(1){background:#FF5F57} .lp-dots span:nth-child(2){background:#FFBD2E} .lp-dots span:nth-child(3){background:#28CA41}
  .lp-bar-title { font-size:12px; color:var(--muted); margin-left:8px; font-family:monospace; }
  .lp-mock-body { display:flex; height:360px; }
  .lp-dsidebar { width:56px; background:#09090F; border-right:1px solid var(--b1);
    display:flex; flex-direction:column; align-items:center; padding:16px 0; gap:6px; }
  .lp-dnav { width:36px; height:36px; border-radius:9px;
    display:flex; align-items:center; justify-content:center; font-size:16px; cursor:pointer; }
  .lp-dnav.on { background:rgba(99,102,241,0.2); }
  .lp-dlist { width:220px; border-right:1px solid var(--b1); display:flex; flex-direction:column; flex-shrink:0; }
  .lp-dlist-hdr { padding:12px 14px; border-bottom:1px solid var(--b1); font-size:11px; font-weight:700;
    color:var(--muted2); text-transform:uppercase; letter-spacing:0.08em;
    display:flex; justify-content:space-between; }
  .lp-dlist-hdr span { color:var(--lime); font-size:10px; }
  .lp-conv { padding:10px 14px; border-bottom:1px solid var(--b1); cursor:pointer; }
  .lp-conv.on { background:rgba(99,102,241,0.08); }
  .lp-conv-top { display:flex; justify-content:space-between; margin-bottom:3px; }
  .lp-conv-name { font-size:12px; font-weight:600; color:#D0D0E8; }
  .lp-conv-time { font-size:10px; color:var(--muted); }
  .lp-conv-prev { font-size:11px; color:var(--muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .lp-cbadge { display:inline-block; padding:1px 6px; border-radius:10px; font-size:9px; font-weight:700; }
  .lp-cbadge.open { background:rgba(16,185,129,0.15); color:var(--em); }
  .lp-cbadge.ai { background:rgba(139,92,246,0.15); color:var(--violet); }
  .lp-dchat { flex:1; display:flex; flex-direction:column; min-width:0; }
  .lp-dchat-hdr { padding:10px 16px; border-bottom:1px solid var(--b1);
    display:flex; align-items:center; gap:10px; }
  .lp-davatar { width:28px; height:28px; border-radius:50%;
    background:linear-gradient(135deg,var(--indigo),var(--violet));
    display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:#fff; }
  .lp-dchat-name { font-size:13px; font-weight:700; color:var(--text); }
  .lp-dchat-status { font-size:10px; color:var(--em); display:flex; align-items:center; gap:4px; }
  .lp-sdot { width:5px; height:5px; background:var(--em); border-radius:50%; }
  .lp-msgs { flex:1; padding:14px 16px; display:flex; flex-direction:column; gap:8px; overflow:hidden; }
  .lp-msg { max-width:75%; padding:8px 12px; border-radius:10px; font-size:11px; line-height:1.5; }
  .lp-msg.v { background:rgba(255,255,255,0.06); color:#C0C0D8; border-radius:10px 10px 2px 10px; align-self:flex-end; }
  .lp-msg.a { background:var(--indigo); color:#fff; border-radius:10px 10px 10px 2px; }
  .lp-msg.ai { background:rgba(139,92,246,0.2); color:#C4B5FD; border-radius:10px 10px 10px 2px; border:1px solid rgba(139,92,246,0.3); }
  .lp-ai-lbl { font-size:9px; background:rgba(139,92,246,0.4); padding:1px 5px; border-radius:3px; margin-right:5px; font-weight:700; }
  .lp-dinput { padding:8px 12px; border-top:1px solid var(--b1); display:flex; gap:8px; align-items:center; }
  .lp-dinput-fake { flex:1; height:28px; background:rgba(255,255,255,0.05); border-radius:20px; border:1px solid var(--b1); }
  .lp-dsend { width:28px; height:28px; background:var(--indigo); border-radius:50%;
    display:flex; align-items:center; justify-content:center; font-size:12px; color:#fff; flex-shrink:0; }
  .lp-dinfo { width:180px; border-left:1px solid var(--b1); padding:14px 12px;
    display:flex; flex-direction:column; gap:12px; flex-shrink:0; }
  .lp-info-lbl { font-size:10px; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:6px; }
  .lp-irow { display:flex; justify-content:space-between; margin-bottom:4px; }
  .lp-ik { font-size:11px; color:var(--muted2); }
  .lp-iv { font-size:11px; color:var(--text); font-weight:600; }
  .lp-ibadge { padding:2px 8px; border-radius:10px; font-size:10px; font-weight:700; background:rgba(200,241,53,0.12); color:var(--lime); }
  .lp-idiv { height:1px; background:var(--b1); }
  .lp-mini-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .lp-mini { display:flex; flex-direction:column; gap:2px; }
  .lp-mini-val { font-size:20px; font-weight:800; font-family:'Bricolage Grotesque',sans-serif; }
  .lp-mini-lbl { font-size:10px; color:var(--muted); }

  /* ── STATS BAR ── */
  .lp-stats { position:relative; z-index:1; border-top:1px solid var(--b1); border-bottom:1px solid var(--b1); }
  .lp-stats-inner { max-width:1100px; margin:0 auto; padding:0 24px;
    display:grid; grid-template-columns:repeat(4,1fr); }
  .lp-stat-cell { padding:28px 24px; border-right:1px solid var(--b1); display:flex; flex-direction:column; gap:4px; }
  .lp-stat-cell:last-child { border-right:none; }
  .lp-stat-num { font-family:'Bricolage Grotesque',sans-serif; font-size:40px; font-weight:800; line-height:1; letter-spacing:-0.03em; }
  .lp-stat-num.lime{color:var(--lime)} .lp-stat-num.ind{color:#818CF8} .lp-stat-num.vio{color:#A78BFA} .lp-stat-num.em{color:var(--em)}
  .lp-stat-lbl { font-size:13px; color:var(--muted2); }

  /* ── SECTIONS ── */
  .lp-sec { position:relative; z-index:1; }
  .lp-container { max-width:1100px; margin:0 auto; padding:0 24px; }
  .lp-tag { display:inline-block; font-size:11px; font-weight:700; letter-spacing:0.1em;
    text-transform:uppercase; color:var(--lime); margin-bottom:16px; }
  .lp-h2 { font-family:'Bricolage Grotesque',sans-serif; font-size:clamp(30px,4vw,50px);
    font-weight:800; line-height:1.08; letter-spacing:-0.025em; max-width:640px; }
  .lp-sub { font-size:16px; color:var(--muted2); max-width:500px; margin-top:16px; font-weight:300; line-height:1.7; }

  /* ── FEATURES ── */
  .lp-feat-split { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:start; margin-top:72px; }
  .lp-feat-list { display:flex; flex-direction:column; }
  .lp-feat-row { display:flex; gap:18px; padding:24px 0; border-bottom:1px solid var(--b1); cursor:pointer; transition:all 0.2s; }
  .lp-feat-row:first-child { border-top:1px solid var(--b1); }
  .lp-feat-row:hover .lp-feat-title { color:var(--lime); }
  .lp-feat-icon { width:40px; height:40px; flex-shrink:0; background:var(--s2); border:1px solid var(--b2);
    border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:18px; margin-top:2px; }
  .lp-feat-title { font-family:'Bricolage Grotesque',sans-serif; font-size:17px; font-weight:700; margin-bottom:6px; transition:color 0.2s; }
  .lp-feat-desc { font-size:14px; color:var(--muted2); line-height:1.65; }
  .lp-feat-visual { position:sticky; top:100px; }
  .lp-vpanel { background:var(--s1); border:1px solid var(--b2); border-radius:16px; overflow:hidden;
    box-shadow:0 24px 80px rgba(0,0,0,0.55); }
  .lp-vhdr { padding:12px 16px; background:#09090F; border-bottom:1px solid var(--b1);
    display:flex; align-items:center; gap:8px; }
  .lp-vtitle { font-size:12px; color:var(--muted); font-family:monospace; }
  .lp-analytics { padding:20px; }
  .lp-arow { display:flex; gap:10px; margin-bottom:16px; }
  .lp-acard { flex:1; background:var(--s2); border:1px solid var(--b1); border-radius:10px; padding:14px 12px; }
  .lp-acard .v { font-family:'Bricolage Grotesque',sans-serif; font-size:22px; font-weight:800; }
  .lp-acard .v.g{color:var(--em)} .lp-acard .v.i{color:#818CF8} .lp-acard .v.vi{color:#A78BFA} .lp-acard .v.a{color:var(--amber)}
  .lp-acard .l { font-size:10px; color:var(--muted); margin-top:2px; }
  .lp-chart { background:var(--s2); border:1px solid var(--b1); border-radius:10px; padding:14px; }
  .lp-chart-title { font-size:10px; color:var(--muted); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:12px; }
  .lp-bars { display:flex; align-items:flex-end; gap:5px; height:60px; }
  .lp-bars .b { flex:1; border-radius:3px 3px 0 0; }
  .lp-sbars { margin-top:14px; display:flex; flex-direction:column; gap:8px; }
  .lp-sb { display:flex; flex-direction:column; gap:3px; }
  .lp-sb-top { display:flex; justify-content:space-between; }
  .lp-sb-name { font-size:10px; color:var(--muted2); }
  .lp-sb-cnt { font-size:10px; color:var(--muted); }
  .lp-sb-track { height:4px; background:var(--b2); border-radius:2px; }
  .lp-sb-fill { height:100%; border-radius:2px; background:var(--violet); }

  /* ── HOW IT WORKS ── */
  .lp-timeline { margin-top:72px; position:relative; }
  .lp-tline { position:absolute; top:28px; left:28px; right:28px; height:1px;
    background:linear-gradient(90deg,var(--indigo) 0%,var(--violet) 50%,var(--lime) 100%); opacity:0.3; }
  .lp-tsteps { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; position:relative; z-index:1; }
  .lp-tstep { display:flex; flex-direction:column; align-items:flex-start; gap:16px; }
  .lp-tnode { width:56px; height:56px; border-radius:14px;
    display:flex; align-items:center; justify-content:center; font-size:22px; flex-shrink:0; }
  .lp-tnode.n1{background:rgba(99,102,241,0.2);border:1px solid rgba(99,102,241,0.4);box-shadow:0 0 24px rgba(99,102,241,0.2)}
  .lp-tnode.n2{background:rgba(139,92,246,0.2);border:1px solid rgba(139,92,246,0.4);box-shadow:0 0 24px rgba(139,92,246,0.2)}
  .lp-tnode.n3{background:rgba(200,241,53,0.15);border:1px solid rgba(200,241,53,0.3);box-shadow:0 0 24px rgba(200,241,53,0.15)}
  .lp-tnode.n4{background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);box-shadow:0 0 24px rgba(16,185,129,0.15)}
  .lp-tnum { font-size:10px; font-weight:700; color:var(--muted); letter-spacing:0.08em; text-transform:uppercase; }
  .lp-ttitle { font-family:'Bricolage Grotesque',sans-serif; font-size:16px; font-weight:700; }
  .lp-tdesc { font-size:13px; color:var(--muted2); line-height:1.65; }

  /* ── MODES ── */
  .lp-modes-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:1px;
    background:var(--b1); border:1px solid var(--b1); border-radius:20px; overflow:hidden; margin-top:64px; }
  .lp-mode { background:var(--s1); padding:36px 28px; display:flex; flex-direction:column; transition:background 0.2s; }
  .lp-mode:hover { background:var(--s2); }
  .lp-mode-hdr { display:flex; align-items:center; gap:12px; margin-bottom:16px; }
  .lp-mode-icon { width:44px; height:44px; border-radius:12px;
    display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
  .lp-mode-icon.live{background:rgba(200,241,53,0.12);border:1px solid rgba(200,241,53,0.25)}
  .lp-mode-icon.ai{background:rgba(139,92,246,0.15);border:1px solid rgba(139,92,246,0.3)}
  .lp-mode-icon.lead{background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.25)}
  .lp-mode-title { font-family:'Bricolage Grotesque',sans-serif; font-size:18px; font-weight:700; }
  .lp-mode-desc { font-size:13px; color:var(--muted2); line-height:1.7; margin-bottom:20px; }

  /* chat mock */
  .lp-cmock { background:var(--s2); border:1px solid var(--b1); border-radius:12px; overflow:hidden; }
  .lp-cmhdr { background:var(--indigo); padding:10px 12px; display:flex; align-items:center; gap:8px; }
  .lp-cmav { width:24px; height:24px; background:rgba(255,255,255,0.2); border-radius:50%;
    display:flex; align-items:center; justify-content:center; font-size:11px; }
  .lp-cmname { font-size:11px; font-weight:700; color:#fff; }
  .lp-cmst { font-size:9px; color:rgba(255,255,255,0.65); display:flex; align-items:center; gap:3px; }
  .lp-cmdot { width:5px; height:5px; background:#4ADE80; border-radius:50%; }
  .lp-cmmsgs { padding:10px; display:flex; flex-direction:column; gap:6px; background:#0A0A14; }
  .lp-cmmsg { padding:6px 9px; border-radius:8px; font-size:10px; line-height:1.5; max-width:80%; }
  .lp-cmmsg.a{background:var(--indigo);color:#fff;border-radius:8px 8px 8px 2px}
  .lp-cmmsg.v{background:rgba(255,255,255,0.07);color:#C0C0D8;border-radius:8px 8px 2px 8px;align-self:flex-end}
  .lp-typing { display:flex; gap:3px; padding:8px 12px; }
  .lp-typing span { width:5px; height:5px; background:var(--muted); border-radius:50%; animation:lpTyping 1.2s infinite; }
  .lp-typing span:nth-child(2){animation-delay:0.2s} .lp-typing span:nth-child(3){animation-delay:0.4s}

  /* ai mock */
  .lp-aimock { background:var(--s2); border:1px solid var(--b1); border-radius:12px; padding:12px; }
  .lp-airow { display:flex; align-items:center; gap:8px; padding:6px 0; border-bottom:1px solid var(--b1); }
  .lp-airow:last-of-type { border-bottom:none; }
  .lp-aiicon { width:24px; height:24px; background:rgba(139,92,246,0.15); border-radius:6px;
    display:flex; align-items:center; justify-content:center; font-size:11px; flex-shrink:0; }
  .lp-aitxt { font-size:10px; color:var(--muted2); flex:1; }
  .lp-aist { font-size:9px; font-weight:700; }
  .lp-aist.on{color:var(--lime)} .lp-aist.off{color:var(--muted)}
  .lp-ai-last { margin-top:10px; padding:8px; background:rgba(139,92,246,0.08);
    border:1px solid rgba(139,92,246,0.2); border-radius:8px; }
  .lp-ai-last-lbl { font-size:9px; color:var(--violet); font-weight:700; margin-bottom:3px; }
  .lp-ai-last-txt { font-size:10px; color:var(--muted2); }

  /* lead mock */
  .lp-lmock { background:var(--s2); border:1px solid var(--b1); border-radius:12px; padding:12px; }
  .lp-lrow { display:flex; justify-content:space-between; align-items:center; padding:6px 0; border-bottom:1px solid var(--b1); }
  .lp-lrow:last-of-type { border-bottom:none; }
  .lp-lname { font-size:11px; font-weight:600; color:var(--text); }
  .lp-lsvc { font-size:9px; color:var(--muted); }
  .lp-lbadge { font-size:9px; font-weight:700; padding:2px 7px; border-radius:10px; }
  .lp-lbadge.new{background:rgba(200,241,53,0.12);color:var(--lime)}
  .lp-lbadge.hot{background:rgba(245,158,11,0.12);color:var(--amber)}
  .lp-lbadge.conv{background:rgba(16,185,129,0.12);color:var(--em)}
  .lp-lexport { font-size:10px; color:var(--lime); font-weight:700; cursor:pointer; display:flex; justify-content:flex-end; margin-top:10px; }

  /* ── EMBED ── */
  .lp-embed-split { display:grid; grid-template-columns:1fr 1fr; gap:72px; align-items:center; margin-top:64px; }
  .lp-code-block { background:var(--s1); border:1px solid var(--b2); border-radius:16px; overflow:hidden;
    box-shadow:0 16px 48px rgba(0,0,0,0.4); }
  .lp-code-bar { padding:12px 18px; background:#09090F; border-bottom:1px solid var(--b1);
    display:flex; align-items:center; gap:8px; }
  .lp-cdot { width:10px; height:10px; border-radius:50%; }
  .lp-cdot:nth-child(1){background:#FF5F57} .lp-cdot:nth-child(2){background:#FFBD2E} .lp-cdot:nth-child(3){background:#28CA41}
  .lp-cfile { font-size:11px; color:var(--muted); margin-left:8px; font-family:monospace; }
  .lp-pre { padding:24px; overflow-x:auto; }
  .lp-code { font-family:'Fira Code','Cascadia Code',monospace; font-size:12.5px; line-height:1.75; }
  .tk{color:#7DD3FC} .ta{color:#86EFAC} .tv{color:#FCA5A5} .tc{color:#4B5563;font-style:italic} .tn{color:var(--lime)}
  .lp-eps { display:flex; flex-direction:column; gap:20px; }
  .lp-ep { display:flex; gap:16px; align-items:flex-start; }
  .lp-epnum { width:28px; height:28px; border-radius:8px; flex-shrink:0;
    background:var(--lime-d); border:1px solid var(--lime-b);
    display:flex; align-items:center; justify-content:center;
    font-size:12px; font-weight:800; color:var(--lime); font-family:'Bricolage Grotesque',sans-serif; }
  .lp-ep-title { font-size:15px; font-weight:700; margin-bottom:4px; }
  .lp-ep-desc { font-size:13px; color:var(--muted2); line-height:1.65; }
  .lp-ppills { display:flex; flex-wrap:wrap; gap:8px; margin-top:28px; }
  .lp-ppill { padding:6px 14px; border-radius:20px; font-size:12px; font-weight:500;
    background:var(--s2); border:1px solid var(--b2); color:var(--muted2); }

  /* ── CTA ── */
  .lp-cta-box { background:var(--s1); border:1px solid var(--b2); border-radius:24px;
    padding:80px 48px; text-align:center; position:relative; overflow:hidden; }
  .lp-cta-box::before { content:''; position:absolute; top:0; left:50%; transform:translateX(-50%);
    width:600px; height:1px; background:linear-gradient(90deg,transparent,var(--indigo),var(--lime),transparent); }
  .lp-cta-glow { position:absolute; top:-100px; left:50%; transform:translateX(-50%);
    width:500px; height:300px; background:radial-gradient(ellipse,rgba(99,102,241,0.1) 0%,transparent 70%); pointer-events:none; }
  .lp-cta-actions { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; position:relative; }

  /* ── FOOTER ── */
  .lp-footer { border-top:1px solid var(--b1); padding:36px 48px;
    display:flex; align-items:center; justify-content:space-between;
    flex-wrap:wrap; gap:16px; position:relative; z-index:1; }
  .lp-footer-left { display:flex; align-items:center; gap:20px; }
  .lp-footer-copy { font-size:13px; color:var(--muted); }
  .lp-footer-links { display:flex; gap:24px; list-style:none; }
  .lp-footer-links a { font-size:13px; color:var(--muted); text-decoration:none; transition:color 0.2s; }
  .lp-footer-links a:hover { color:var(--text); }

  /* ── ANIMATIONS ── */
  @keyframes lpFadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes lpPulse { 0%,100%{opacity:1;box-shadow:0 0 8px var(--lime)} 50%{opacity:0.5;box-shadow:0 0 16px var(--lime)} }
  @keyframes lpTyping { 0%,60%,100%{transform:translateY(0);opacity:0.4} 30%{transform:translateY(-4px);opacity:1} }
  @keyframes lpToastIn { from{opacity:0;transform:translateX(-16px)} to{opacity:1;transform:translateX(0)} }

  .lp-reveal { opacity:0; transform:translateY(28px); transition:opacity 0.7s ease,transform 0.7s ease; }
  .lp-reveal.lp-visible { opacity:1; transform:translateY(0); }
  .lp-d1{transition-delay:0.1s} .lp-d2{transition-delay:0.2s} .lp-d3{transition-delay:0.3s}

  /* ── RESPONSIVE ── */
  @media(max-width:900px){
    .lp-nav{padding:16px 20px}
    .lp-nav-links{display:none}
    .lp-mock-body{flex-direction:column;height:auto}
    .lp-dsidebar,.lp-dinfo{display:none}
    .lp-dlist{width:100%;border-right:none;border-bottom:1px solid var(--b1);max-height:140px;overflow:hidden}
    .lp-feat-split,.lp-embed-split{grid-template-columns:1fr;gap:48px}
    .lp-feat-visual{position:static}
    .lp-tline{display:none}
    .lp-tsteps{grid-template-columns:1fr 1fr}
    .lp-modes-grid{grid-template-columns:1fr}
    .lp-stats-inner{grid-template-columns:1fr 1fr}
    .lp-stat-cell:nth-child(2){border-right:none}
    .lp-stat-cell{border-bottom:1px solid var(--b1)}
    .lp-cta-box{padding:48px 24px}
    .lp-footer{padding:28px 20px;flex-direction:column;align-items:flex-start}
    .lp-toast-stack{display:none}
    .lp-hero{padding:110px 20px 50px}
  }
`;

function injectStyles() {
  if (document.getElementById('lp-styles')) return;
  const el = document.createElement('style');
  el.id = 'lp-styles';
  el.textContent = STYLES;
  document.head.appendChild(el);
}

export default function Landing() {
  const navigate = useNavigate();
  useFont();

  // Inject CSS
  useEffect(() => { injectStyles(); }, []);

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('lp-visible'); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.lp-reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    window.OpenChatConfig = {
      installId: 'pQPBF55AQNemTiYIj0utnWqSNTD3',
    };
    if (document.getElementById('oc-widget-script')) return;
    const script = document.createElement('script');
    script.id = 'oc-widget-script';
    script.src = 'https://cdn.jsdelivr.net/gh/Dipesh-Das97/openchat@v1.1/widget/dist/widget.js';
    script.async = true;
    document.body.appendChild(script);
    // Cleanup when navigating away
    return () => {
      document.getElementById('oc-widget-script')?.remove();
      document.getElementById('openchat-bubble')?.remove();
      document.getElementById('openchat-window')?.remove();
      document.getElementById('oc-styles')?.remove();
    };
  }, []);


  // Counter animation
  const statsRef = useRef(null);
  useEffect(() => {
    const els = document.querySelectorAll('[data-lp-target]');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.lpTarget);
        if (!target) return;
        let cur = 0;
        const step = Math.ceil(target / 20);
        const timer = setInterval(() => {
          cur = Math.min(cur + step, target);
          el.textContent = cur;
          if (cur >= target) clearInterval(timer);
        }, 40);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="lp">

      {/* NAV */}
      <nav className="lp-nav">
        <div className="lp-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="lp-logo-mark">💬</div>
          OpenChat
        </div>
        <ul className="lp-nav-links">
          <li><a href="#lp-features" onClick={e => { e.preventDefault(); scrollTo('lp-features'); }}>Features</a></li>
          <li><a href="#lp-how" onClick={e => { e.preventDefault(); scrollTo('lp-how'); }}>How it works</a></li>
          <li><a href="#lp-modes" onClick={e => { e.preventDefault(); scrollTo('lp-modes'); }}>Modes</a></li>
        </ul>
        <button className="lp-btn-cta" onClick={() => navigate('/register')}>Get started →</button>
      </nav>

      {/* HERO */}
      <section className="lp-hero">
        <div className="lp-glow1" />
        <div className="lp-glow2" />

        <div className="lp-badge"><div className="lp-live-dot" /> Open source · Free to use</div>

        <h1 className="lp-h1">
          Your website.<br /><em>Alive</em> with chat.<br />
          <span className="ghost">Convert visitors.</span>
        </h1>

        <p className="lp-hero-sub">
          Real-time chat, AI fallback, lead capture — all from a single script tag. Works on any website in under 5 minutes.
        </p>

        <div className="lp-hero-actions">
          <button className="lp-btn-primary" onClick={() => navigate('/register')}>Start for free →</button>
          <button className="lp-btn-ghost" onClick={() => navigate('/login')}>Sign in</button>
        </div>
        <p className="lp-hero-meta">No credit card · MIT License · Self-hostable</p>

        {/* Dashboard mockup */}
        <div className="lp-mockup">
          <div className="lp-toast-stack">
            <div className="lp-toast">
              <div className="lp-toast-icon">💬</div>
              <div><div className="lp-toast-title">New message from Rahul</div><div className="lp-toast-sub">What are your pricing plans?</div></div>
            </div>
            <div className="lp-toast">
              <div className="lp-toast-icon">📋</div>
              <div><div className="lp-toast-title">Lead captured — Priya S.</div><div className="lp-toast-sub">Interested in Web Development</div></div>
            </div>
          </div>

          <div className="lp-shell">
            <div className="lp-bar">
              <div className="lp-dots"><span /><span /><span /></div>
              <div className="lp-bar-title">openchat · dashboard · Conversations</div>
            </div>
            <div className="lp-mock-body">
              {/* Sidebar */}
              <div className="lp-dsidebar">
                {['🏠', '🗨️', '📋', '📦', '⚙️'].map((ic, i) => (
                  <div key={i} className={`lp-dnav${i === 1 ? ' on' : ''}`}>{ic}</div>
                ))}
              </div>
              {/* Conversation list */}
              <div className="lp-dlist">
                <div className="lp-dlist-hdr">Chats <span>● Online</span></div>
                {[
                  { name: 'Rahul Mehta', time: '2m ago', prev: 'What are your pricing plans?', badge: 'open', on: true },
                  { name: 'Priya Sharma', time: '18m ago', prev: '📋 Lead form submitted', badge: 'ai' },
                  { name: 'Alex Chen', time: '1h ago', prev: 'Do you offer custom dev?' },
                ].map((c, i) => (
                  <div key={i} className={`lp-conv${c.on ? ' on' : ''}`}>
                    <div className="lp-conv-top">
                      <span className="lp-conv-name">{c.name}</span>
                      <span className="lp-conv-time">{c.time}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="lp-conv-prev">{c.prev}</div>
                      {c.badge && <span className={`lp-cbadge ${c.badge}`}>{c.badge === 'open' ? 'Open' : 'AI'}</span>}
                    </div>
                  </div>
                ))}
              </div>
              {/* Chat panel */}
              <div className="lp-dchat">
                <div className="lp-dchat-hdr">
                  <div className="lp-davatar">R</div>
                  <div>
                    <div className="lp-dchat-name">Rahul Mehta</div>
                    <div className="lp-dchat-status"><span className="lp-sdot" /> Active now</div>
                  </div>
                </div>
                <div className="lp-msgs">
                  <div className="lp-msg a">Hi Rahul! 👋 How can I help you today?</div>
                  <div className="lp-msg v">Hi! What are your pricing plans?</div>
                  <div className="lp-msg ai"><span className="lp-ai-lbl">AI</span>We offer flexible plans starting from free. Pro includes AI reply, lead capture &amp; analytics.</div>
                  <div className="lp-msg v">Yes please! Do you have a free trial?</div>
                </div>
                <div className="lp-dinput">
                  <div className="lp-dinput-fake" />
                  <div className="lp-dsend">↑</div>
                </div>
              </div>
              {/* Info panel */}
              <div className="lp-dinfo">
                <div>
                  <div className="lp-info-lbl">Visitor</div>
                  <div className="lp-irow"><span className="lp-ik">Name</span><span className="lp-iv">Rahul M.</span></div>
                  <div className="lp-irow"><span className="lp-ik">Status</span><span className="lp-ibadge">New</span></div>
                  <div className="lp-irow"><span className="lp-ik">Page</span><span className="lp-iv" style={{ fontSize: 10 }}>/pricing</span></div>
                </div>
                <div className="lp-idiv" />
                <div>
                  <div className="lp-info-lbl">Today</div>
                  <div className="lp-mini-grid">
                    <div className="lp-mini"><div className="lp-mini-val">12</div><div className="lp-mini-lbl">Chats</div></div>
                    <div className="lp-mini"><div className="lp-mini-val" style={{ color: 'var(--lime)' }}>4</div><div className="lp-mini-lbl">Leads</div></div>
                  </div>
                </div>
                <div className="lp-idiv" />
                <div>
                  <div className="lp-info-lbl">AI Status</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 6, height: 6, background: 'var(--lime)', borderRadius: '50%', boxShadow: '0 0 6px var(--lime)' }} />
                    <span style={{ fontSize: 11, color: 'var(--muted2)' }}>Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="lp-stats">
        <div className="lp-stats-inner">
          {[
            { val: 2, cls: 'lime', lbl: 'lines to embed', target: 2 },
            { val: 5, cls: 'ind', lbl: 'minute setup', target: 5 },
            { val: 6, cls: 'vio', lbl: 'platforms supported', target: 6 },
            { val: 'MIT', cls: 'em', lbl: 'open source license', target: null },
          ].map((s, i) => (
            <div key={i} className="lp-stat-cell">
              <div className={`lp-stat-num ${s.cls}`} data-lp-target={s.target || undefined}>{s.val}</div>
              <div className="lp-stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section className="lp-sec" id="lp-features" style={{ padding: '120px 0' }}>
        <div className="lp-container">
          <span className="lp-tag lp-reveal">Features</span>
          <h2 className="lp-h2 lp-reveal">Built for the way<br />you actually work.</h2>
          <p className="lp-sub lp-reveal">Every feature designed around real chat workflows — not enterprise bloat.</p>

          <div className="lp-feat-split">
            <div className="lp-feat-list lp-reveal">
              {[
                { icon: '⚡', title: 'Real-time Messaging', desc: 'Firebase-powered. Messages arrive instantly — no polling, no page refresh. See visitors typing in real time.' },
                { icon: '🤖', title: 'AI Fallback Engine', desc: "When you're offline, AI steps in immediately. It answers from your knowledge base and collects leads when it can't help." },
                { icon: '📋', title: 'Lead Capture & CRM', desc: 'Name, email, phone, company, services — all captured in a smart form. Track status, export CSV, follow up from your dashboard.' },
                { icon: '📊', title: 'Analytics Dashboard', desc: 'Conversation trends, leads by service, conversion rates — all visualized in a real-time analytics home tab.' },
                { icon: '🎨', title: 'Fully Customizable Widget', desc: "Your colors, position, welcome message, avatar. The widget matches your brand — not the other way around." },
              ].map((f, i) => (
                <div key={i} className="lp-feat-row">
                  <div className="lp-feat-icon">{f.icon}</div>
                  <div>
                    <div className="lp-feat-title">{f.title}</div>
                    <div className="lp-feat-desc">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Analytics visual */}
            <div className="lp-feat-visual lp-reveal lp-d2">
              <div className="lp-vpanel">
                <div className="lp-vhdr">
                  <div className="lp-dots"><span /><span /><span /></div>
                  <div className="lp-vtitle">Dashboard — Analytics</div>
                </div>
                <div className="lp-analytics">
                  <div className="lp-arow">
                    {[{ v: '24', c: 'g', l: 'Total Chats' }, { v: '11', c: 'i', l: 'Total Leads' }, { v: '8', c: 'vi', l: 'Open' }, { v: '3', c: 'a', l: 'Converted' }].map((a, i) => (
                      <div key={i} className="lp-acard"><div className={`v ${a.c}`}>{a.v}</div><div className="l">{a.l}</div></div>
                    ))}
                  </div>
                  <div className="lp-chart">
                    <div className="lp-chart-title">Conversations · Last 7 days</div>
                    <div className="lp-bars">
                      {[30, 55, 40, 70, 50, 85, 100].map((h, i) => (
                        <div key={i} className="b" style={{
                          height: `${h}%`,
                          background: i === 6 ? 'var(--indigo)' : `rgba(99,102,241,${0.2 + h / 200})`,
                          boxShadow: i === 6 ? '0 0 12px var(--indigo-g)' : 'none',
                        }} />
                      ))}
                    </div>
                  </div>
                  <div className="lp-sbars">
                    <div className="lp-chart-title" style={{ marginTop: 14, marginBottom: 8 }}>Leads by service</div>
                    {[['Web Development', 6, 100], ['Mobile App', 4, 67], ['SEO / Marketing', 3, 50], ['UI/UX Design', 2, 33]].map(([n, c, w]) => (
                      <div key={n} className="lp-sb">
                        <div className="lp-sb-top"><span className="lp-sb-name">{n}</span><span className="lp-sb-cnt">{c}</span></div>
                        <div className="lp-sb-track"><div className="lp-sb-fill" style={{ width: `${w}%` }} /></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="lp-sec" id="lp-how" style={{ paddingBottom: 120 }}>
        <div className="lp-container">
          <span className="lp-tag lp-reveal">How it works</span>
          <h2 className="lp-h2 lp-reveal">From zero to live<br />in 5 minutes.</h2>
          <p className="lp-sub lp-reveal">No backend. No config files. No DevOps. Just paste and go.</p>

          <div className="lp-timeline lp-reveal">
            <div className="lp-tline" />
            <div className="lp-tsteps">
              {[
                { cls: 'n1', icon: '⚙️', step: 'Step 01', title: 'Sign up & configure', desc: 'Create an account, set your brand colors, welcome message, and enable features — AI reply, lead form, working hours.' },
                { cls: 'n2', icon: '📦', step: 'Step 02', title: 'Copy your embed code', desc: 'Head to the Docs tab in your dashboard. Your install ID is pre-filled. Copy two lines.' },
                { cls: 'n3', icon: '🚀', step: 'Step 03', title: 'Paste & publish', desc: 'Drop the snippet before your </body> tag — or follow the guide for React, WordPress, Shopify, or Wix.' },
                { cls: 'n4', icon: '💬', step: 'Step 04', title: 'Start converting', desc: 'Toggle online in your dashboard. Chat with visitors live. AI handles the rest when you\'re away.' },
              ].map((s, i) => (
                <div key={i} className={`lp-tstep${i > 0 ? ` lp-d${i}` : ''}`}>
                  <div className={`lp-tnode ${s.cls}`}>{s.icon}</div>
                  <div>
                    <div className="lp-tnum">{s.step}</div>
                    <div className="lp-ttitle">{s.title}</div>
                    <div className="lp-tdesc">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MODES */}
      <section className="lp-sec" id="lp-modes" style={{ paddingBottom: 120 }}>
        <div className="lp-container">
          <span className="lp-tag lp-reveal">Three modes</span>
          <h2 className="lp-h2 lp-reveal">One tool.<br />Every scenario.</h2>
          <p className="lp-sub lp-reveal">Enable one or all three. Mix and match based on how your team operates.</p>

          <div className="lp-modes-grid">
            {/* Live chat */}
            <div className="lp-mode lp-reveal">
              <div className="lp-mode-hdr">
                <div className="lp-mode-icon live">💬</div>
                <div className="lp-mode-title">Live Chat</div>
              </div>
              <div className="lp-mode-desc">Real-time conversations with your visitors. Get browser notifications, reply instantly, take over from AI at any time.</div>
              <div className="lp-cmock">
                <div className="lp-cmhdr">
                  <div className="lp-cmav">💬</div>
                  <div>
                    <div className="lp-cmname">Acme Support</div>
                    <div className="lp-cmst"><span className="lp-cmdot" /> Agent online</div>
                  </div>
                </div>
                <div className="lp-cmmsgs">
                  <div className="lp-cmmsg a">Hi! 👋 How can I help you today?</div>
                  <div className="lp-cmmsg v">I need help with pricing</div>
                  <div className="lp-cmmsg a">Sure! We have 3 plans. Which fits — startup, team, or enterprise?</div>
                  <div className="lp-typing"><span /><span /><span /></div>
                </div>
              </div>
            </div>

            {/* AI mode */}
            <div className="lp-mode lp-reveal lp-d1">
              <div className="lp-mode-hdr">
                <div className="lp-mode-icon ai">🤖</div>
                <div className="lp-mode-title">AI Chatbot</div>
              </div>
              <div className="lp-mode-desc">Feed your knowledge base — services, FAQs, pricing. AI answers instantly. Falls back to lead capture when it can't help.</div>
              <div className="lp-aimock">
                <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, fontWeight: 700 }}>Knowledge Base</div>
                {[['💰', 'Pricing & Plans', true], ['🛠️', 'Services Offered', true], ['📞', 'Contact & Support', true], ['❓', 'FAQ', false]].map(([ic, lbl, on]) => (
                  <div key={lbl} className="lp-airow">
                    <div className="lp-aiicon">{ic}</div>
                    <div className="lp-aitxt">{lbl}</div>
                    <div className={`lp-aist ${on ? 'on' : 'off'}`}>{on ? '● Active' : '○ Draft'}</div>
                  </div>
                ))}
                <div className="lp-ai-last">
                  <div className="lp-ai-last-lbl">🤖 AI — Last triggered</div>
                  <div className="lp-ai-last-txt">"Do you offer mobile apps?" → Answered from KB ✓</div>
                </div>
              </div>
            </div>

            {/* Lead gen */}
            <div className="lp-mode lp-reveal lp-d2">
              <div className="lp-mode-hdr">
                <div className="lp-mode-icon lead">📋</div>
                <div className="lp-mode-title">Lead Generation</div>
              </div>
              <div className="lp-mode-desc">Capture name, email, phone, services of interest. Track pipeline status. Export CSV. All from your dashboard.</div>
              <div className="lp-lmock">
                <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, fontWeight: 700 }}>Recent Leads</div>
                {[['Priya Sharma', 'Web Development', 'new'], ['Rahul Mehta', 'Mobile App', 'hot'], ['Alex Chen', 'SEO / Marketing', 'conv'], ['Sara Kim', 'UI/UX Design', 'new']].map(([name, svc, badge]) => (
                  <div key={name} className="lp-lrow">
                    <div><div className="lp-lname">{name}</div><div className="lp-lsvc">{svc}</div></div>
                    <span className={`lp-lbadge ${badge}`}>{badge === 'conv' ? 'Converted' : badge === 'hot' ? 'Hot' : 'New'}</span>
                  </div>
                ))}
                <div className="lp-lexport">Export CSV →</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EMBED */}
      <section className="lp-sec" style={{ paddingBottom: 120 }}>
        <div className="lp-container">
          <div className="lp-embed-split">
            <div>
              <span className="lp-tag lp-reveal">Zero-config embed</span>
              <h2 className="lp-h2 lp-reveal">Two lines.<br />That's the whole<br />integration.</h2>
              <div className="lp-eps lp-reveal" style={{ marginTop: 32 }}>
                {[
                  ['1', 'Set your config', 'Your install ID is pre-filled in the Docs tab. Optionally pass a brand color and company name.'],
                  ['2', 'Load the widget', 'One script tag. The widget loads async — zero impact on your page performance or Core Web Vitals.'],
                  ['3', 'Works everywhere', 'Plain HTML, React/Next.js, WordPress, Shopify, Wix, Webflow — each platform has a dedicated guide.'],
                ].map(([n, t, d]) => (
                  <div key={n} className="lp-ep">
                    <div className="lp-epnum">{n}</div>
                    <div><div className="lp-ep-title">{t}</div><div className="lp-ep-desc">{d}</div></div>
                  </div>
                ))}
              </div>
              <div className="lp-ppills lp-reveal">
                {['🌐 HTML', '⚛️ React', '🔵 WordPress', '🛍️ Shopify', '🟡 Wix', '🔷 Webflow'].map(p => (
                  <span key={p} className="lp-ppill">{p}</span>
                ))}
              </div>
            </div>

            <div className="lp-code-block lp-reveal lp-d2">
              <div className="lp-code-bar">
                <div className="lp-cdot" /><div className="lp-cdot" /><div className="lp-cdot" />
                <span className="lp-cfile">index.html</span>
              </div>
              <pre className="lp-pre">
                <code className="lp-code" dangerouslySetInnerHTML={{
                  __html:
                    `<span class="tc">&lt;!-- Before &lt;/body&gt; --&gt;</span>

<span class="tk">&lt;script&gt;</span>
  <span class="ta">window.OpenChatConfig</span> = {
    <span class="ta">installId</span>:    <span class="tv">"your-install-id"</span>,
    <span class="ta">primaryColor</span>: <span class="tv">"#4F46E5"</span>,   <span class="tc">// optional</span>
    <span class="ta">companyName</span>:  <span class="tv">"Acme Inc"</span>,    <span class="tc">// optional</span>
    <span class="ta">position</span>:     <span class="tv">"bottom-right"</span>, <span class="tc">// optional</span>
  }
<span class="tk">&lt;/script&gt;</span>

<span class="tk">&lt;script </span><span class="ta">src</span>=<span class="tv">"https://cdn.openchat.dev/widget.js"</span>
        <span class="ta">defer</span><span class="tk">&gt;&lt;/script&gt;</span>

<span class="tc">&lt;!-- That's it. Widget loads async. --&gt;</span>`
                }} />
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="lp-sec" style={{ paddingBottom: 120 }}>
        <div className="lp-container">
          <div className="lp-cta-box lp-reveal">
            <div className="lp-cta-glow" />
            <span className="lp-tag" style={{ position: 'relative' }}>Open source</span>
            <h2 className="lp-h2" style={{ margin: '0 auto', position: 'relative' }}>Your visitors are talking.<br />Are you listening?</h2>
            <p className="lp-sub" style={{ margin: '16px auto 40px', position: 'relative' }}>
              Free forever. MIT licensed. No vendor lock-in. Deploy on your own infrastructure or use our hosted version.
            </p>
            <div className="lp-cta-actions">
              <button className="lp-btn-primary" onClick={() => navigate('/register')}>Get started free →</button>
              <button className="lp-btn-ghost" onClick={() => navigate('/login')}>Sign in to dashboard</button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer-left">
          <div className="lp-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="lp-logo-mark" style={{ width: 26, height: 26, fontSize: 13 }}>💬</div>
            OpenChat
          </div>
          <span className="lp-footer-copy">© 2026 · MIT License</span>
        </div>

        <a
          href="https://dipeshdas98.wixstudio.com/my-portfolio"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none',
            opacity: 0.55, transition: 'opacity 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = 1}
          onMouseLeave={e => e.currentTarget.style.opacity = 0.55}
        >
          <img
            src="https://firebasestorage.googleapis.com/v0/b/homerunner-staging.appspot.com/o/businessImages%2FChatGPT%20Image%20Feb%2021%2C%202026%2C%2001_23_21%20PM-Photoroom.png?alt=media&token=a804b2ab-306e-4369-a6b0-7d4b4c1bc3eb"
            alt="codedbyDipesh"
            style={{ height: '100px', filter: 'brightness(20)' }}
          />
          <span style={{
            fontSize: '12px', color: 'var(--muted2)',
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500
          }}>
            Dipesh Das
          </span>
        </a>

        <ul className="lp-footer-links">
          <li><a href="#lp-features" onClick={e => { e.preventDefault(); scrollTo('lp-features'); }}>Features</a></li>
          <li><a href="#lp-how" onClick={e => { e.preventDefault(); scrollTo('lp-how'); }}>How it works</a></li>
          <li><a href="#lp-modes" onClick={e => { e.preventDefault(); scrollTo('lp-modes'); }}>Modes</a></li>
          <li><a href="#" onClick={e => { e.preventDefault(); navigate('/register'); }}>Get started →</a></li>
        </ul>
      </footer>

    </div>
  );
}