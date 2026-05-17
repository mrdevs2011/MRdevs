// ==================== MRDEV DIALOG v1.0 ====================
// Native confirm() o'rniga zamonaviy Promise-based dialog.

let _injected = false;
function injectStyle() {
    if (_injected) return; _injected = true;
    const s = document.createElement('style');
    s.textContent = `
.mrdev-dlg-bd{position:fixed;inset:0;z-index:99998;background:rgba(0,0,0,.32);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity .18s cubic-bezier(.2,0,0,1);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px)}
.mrdev-dlg-bd.show{opacity:1}
.mrdev-dlg{background:var(--surface,#faf9f7);border:1px solid var(--border,rgba(0,0,0,.07));border-radius:var(--radius-lg,18px);box-shadow:var(--shadow-xl,0 8px 32px rgba(0,0,0,.12));width:100%;max-width:340px;transform:translateY(16px) scale(.97);transition:transform .22s cubic-bezier(.34,1.56,.64,1);overflow:hidden}
.mrdev-dlg-bd.show .mrdev-dlg{transform:translateY(0) scale(1)}
.mrdev-dlg-body{padding:24px 24px 16px}
.mrdev-dlg-icon{width:40px;height:40px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:14px}
.mrdev-dlg-icon.warn{background:var(--red-dim,rgba(192,57,43,.08));color:var(--red,#c0392b)}
.mrdev-dlg-icon.info{background:var(--accent-dim,rgba(42,125,225,.08));color:var(--accent,#2a7de1)}
.mrdev-dlg-title{font-size:15px;font-weight:600;color:var(--text,#1c1a17);margin-bottom:6px;line-height:1.3;font-family:var(--font-sans,system-ui,sans-serif)}
.mrdev-dlg-msg{font-size:13px;color:var(--text-3,#7d7a74);line-height:1.5;font-family:var(--font-sans,system-ui,sans-serif)}
.mrdev-dlg-footer{display:flex;gap:8px;padding:12px 16px 16px;justify-content:flex-end}
.mrdev-dlg-btn{padding:8px 18px;border-radius:var(--radius-full,9999px);font-size:13px;font-weight:500;border:none;cursor:pointer;transition:all .15s;font-family:var(--font-sans,system-ui,sans-serif);outline:none}
.mrdev-dlg-btn:focus-visible{box-shadow:0 0 0 2px var(--accent,#2a7de1)}
.mrdev-dlg-btn.dl-cancel{background:var(--surface-2,#f2f0eb);color:var(--text-2,#4a4741);border:1px solid var(--border,rgba(0,0,0,.07))}
.mrdev-dlg-btn.dl-cancel:hover{background:var(--surface-3,#e8e4dd)}
.mrdev-dlg-btn.dl-ok{background:var(--accent,#2a7de1);color:#fff}
.mrdev-dlg-btn.dl-ok:hover{background:var(--accent-2,#1e6bd1)}
.mrdev-dlg-btn.dl-danger{background:var(--red,#c0392b);color:#fff}
.mrdev-dlg-btn.dl-danger:hover{filter:brightness(.9)}
@media(prefers-reduced-motion:reduce){.mrdev-dlg-bd,.mrdev-dlg{transition:none}}`;
    document.head.appendChild(s);
}

const WARN_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>`;
const INFO_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>`;

export function mrdevConfirm(message, opts = {}) {
    return new Promise((resolve) => {
        injectStyle();
        const danger = opts.danger !== false;
        const bd = document.createElement('div');
        bd.className = 'mrdev-dlg-bd';
        bd.setAttribute('role','dialog'); bd.setAttribute('aria-modal','true');
        bd.innerHTML = `<div class="mrdev-dlg">
<div class="mrdev-dlg-body">
  <div class="mrdev-dlg-icon ${danger?'warn':'info'}">${danger?WARN_SVG:INFO_SVG}</div>
  ${opts.title?`<div class="mrdev-dlg-title">${opts.title}</div>`:''}
  <div class="mrdev-dlg-msg">${message}</div>
</div>
<div class="mrdev-dlg-footer">
  <button class="mrdev-dlg-btn dl-cancel" data-a="no">${opts.cancelLabel||'Bekor'}</button>
  <button class="mrdev-dlg-btn ${danger?'dl-danger':'dl-ok'}" data-a="yes">${opts.okLabel||'Ha'}</button>
</div></div>`;
        document.body.appendChild(bd);
        requestAnimationFrame(() => bd.classList.add('show'));
        const close = (v) => {
            bd.classList.remove('show');
            setTimeout(() => bd.parentNode && bd.remove(), 230);
            resolve(v);
        };
        bd.addEventListener('click', e => {
            const a = e.target.closest('[data-a]')?.dataset.a;
            if (a === 'yes') close(true);
            else if (a === 'no' || e.target === bd) close(false);
        });
        bd.addEventListener('keydown', e => {
            if (e.key === 'Escape') close(false);
            if (e.key === 'Enter') close(true);
        });
        setTimeout(() => bd.querySelector('[data-a="yes"]')?.focus(), 50);
    });
}
