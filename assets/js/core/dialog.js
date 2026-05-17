// ==================== MRDEV DIALOG v1.0 ====================
// Native confirm/alert/prompt o'rniga zamonaviy in-DOM dialog.
// Promise asosida ishlaydi — await bilan ishlatiladi.

let _styleInjected = false;

function injectStyle() {
    if (_styleInjected) return;
    _styleInjected = true;
    const s = document.createElement('style');
    s.textContent = `
.mrdev-dlg-backdrop {
    position: fixed; inset: 0; z-index: 99998;
    background: rgba(0,0,0,0.32);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    opacity: 0; transition: opacity 0.18s cubic-bezier(0.2,0,0,1);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
}
.mrdev-dlg-backdrop.show { opacity: 1; }
.mrdev-dlg {
    background: var(--surface, #faf9f7);
    border: 1px solid var(--border, rgba(0,0,0,0.07));
    border-radius: var(--radius-lg, 18px);
    box-shadow: var(--shadow-xl, 0 8px 32px rgba(0,0,0,0.12));
    width: 100%; max-width: 340px;
    transform: translateY(16px) scale(0.97);
    transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1);
    overflow: hidden;
}
.mrdev-dlg-backdrop.show .mrdev-dlg { transform: translateY(0) scale(1); }
.mrdev-dlg-body {
    padding: 24px 24px 20px;
}
.mrdev-dlg-icon {
    width: 40px; height: 40px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 14px;
    font-size: 20px;
}
.mrdev-dlg-icon.warn { background: var(--red-dim, rgba(192,57,43,0.08)); color: var(--red, #c0392b); }
.mrdev-dlg-icon.info { background: var(--accent-dim, rgba(42,125,225,0.08)); color: var(--accent, #2a7de1); }
.mrdev-dlg-title {
    font-size: 15px; font-weight: 600;
    color: var(--text, #1c1a17);
    margin-bottom: 6px; line-height: 1.3;
    font-family: var(--font-sans, system-ui, sans-serif);
}
.mrdev-dlg-msg {
    font-size: 13px; color: var(--text-3, #7d7a74);
    line-height: 1.5;
    font-family: var(--font-sans, system-ui, sans-serif);
}
.mrdev-dlg-footer {
    display: flex; gap: 8px; padding: 0 16px 16px;
    justify-content: flex-end;
}
.mrdev-dlg-btn {
    padding: 8px 18px; border-radius: var(--radius-full, 9999px);
    font-size: 13px; font-weight: 500; border: none; cursor: pointer;
    transition: all 0.15s; font-family: var(--font-sans, system-ui, sans-serif);
    outline: none;
}
.mrdev-dlg-btn:focus-visible { box-shadow: 0 0 0 2px var(--accent, #2a7de1); }
.mrdev-dlg-btn.cancel {
    background: var(--surface-2, #f2f0eb);
    color: var(--text-2, #4a4741);
    border: 1px solid var(--border, rgba(0,0,0,0.07));
}
.mrdev-dlg-btn.cancel:hover { background: var(--surface-3, #e8e4dd); }
.mrdev-dlg-btn.confirm-ok {
    background: var(--accent, #2a7de1); color: #fff;
}
.mrdev-dlg-btn.confirm-ok:hover { background: var(--accent-2, #1e6bd1); }
.mrdev-dlg-btn.danger-ok {
    background: var(--red, #c0392b); color: #fff;
}
.mrdev-dlg-btn.danger-ok:hover { filter: brightness(0.9); }
@media (prefers-reduced-motion: reduce) {
    .mrdev-dlg-backdrop, .mrdev-dlg { transition: none; }
}
`;
    document.head.appendChild(s);
}

function createDialog({ icon = 'warn', title = '', message = '', okLabel = 'OK', cancelLabel = null, okClass = 'danger-ok' }) {
    injectStyle();
    const backdrop = document.createElement('div');
    backdrop.className = 'mrdev-dlg-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');

    const iconSvgs = {
        warn: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></svg>`,
        info:  `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>`,
    };

    backdrop.innerHTML = `
<div class="mrdev-dlg">
  <div class="mrdev-dlg-body">
    <div class="mrdev-dlg-icon ${icon}">${iconSvgs[icon] || iconSvgs.warn}</div>
    ${title ? `<div class="mrdev-dlg-title">${title}</div>` : ''}
    ${message ? `<div class="mrdev-dlg-msg">${message}</div>` : ''}
  </div>
  <div class="mrdev-dlg-footer">
    ${cancelLabel ? `<button class="mrdev-dlg-btn cancel" data-action="cancel">${cancelLabel}</button>` : ''}
    <button class="mrdev-dlg-btn ${okClass}" data-action="ok">${okLabel}</button>
  </div>
</div>`;

    return backdrop;
}

/**
 * Zamonaviy confirm dialog.
 * @param {string} message  — asosiy matn
 * @param {object} [opts]   — { title, okLabel, cancelLabel, danger }
 * @returns {Promise<boolean>}
 *
 * @example
 * if (await mrdevConfirm('Tarixni tozalash?')) { ... }
 */
export function mrdevConfirm(message, opts = {}) {
    return new Promise((resolve) => {
        const el = createDialog({
            icon:        opts.danger !== false ? 'warn' : 'info',
            title:       opts.title || '',
            message,
            okLabel:     opts.okLabel     || "Ha",
            cancelLabel: opts.cancelLabel || "Bekor",
            okClass:     opts.danger !== false ? 'danger-ok' : 'confirm-ok',
        });

        document.body.appendChild(el);
        requestAnimationFrame(() => el.classList.add('show'));

        function close(result) {
            el.classList.remove('show');
            setTimeout(() => { if (el.parentNode) el.remove(); }, 220);
            resolve(result);
        }

        el.addEventListener('click', (e) => {
            const action = e.target.closest('[data-action]')?.dataset.action;
            if (action === 'ok')     close(true);
            if (action === 'cancel') close(false);
            if (e.target === el)     close(false);
        });

        el.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close(false);
            if (e.key === 'Enter')  close(true);
        });

        setTimeout(() => el.querySelector('[data-action="ok"]')?.focus(), 50);
    });
}
