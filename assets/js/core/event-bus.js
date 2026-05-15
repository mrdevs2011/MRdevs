// ==================== MRDEV EVENT BUS v1.0 ====================
// window.xxx = function() {...} o'rniga markaziy event tizimi.
//
// Muammo: script.js da 15+ funksiya window ga eksport qilingan edi.
// Bu: namespace ifloslantiradi, test qilib bo'lmaydi, xatolarga olib keladi.
//
// Yechim: Custom DOM eventlar orqali modullar bir-biri bilan gaplashadi.
//
// HTML da:
//   <button data-action="toggle-theme">Dark/Light</button>
//   <button data-action="show-auth-modal">Kirish</button>
//
// JS da:
//   EventBus.on('toggle-theme', () => toggleTheme());

const EventBus = {
    _handlers: {},

    /**
     * Hodisani tinglash
     * @param {string} event
     * @param {Function} handler
     */
    on(event, handler) {
        if (!this._handlers[event]) this._handlers[event] = [];
        this._handlers[event].push(handler);
        // DOM event ham tinglaydi (HTML elementlardan)
        // Named wrapper saqlanadi — keyinchalik off() orqali o'chirish mumkin
        const domHandler = (e) => handler(e.detail);
        if (!this._domHandlers) this._domHandlers = {};
        if (!this._domHandlers[event]) this._domHandlers[event] = [];
        this._domHandlers[event].push({ handler, domHandler });
        document.addEventListener(`mrdev:${event}`, domHandler);
    },

    /**
     * Hodisa tinglovchisini o'chirish
     * @param {string} event
     * @param {Function} handler
     */
    off(event, handler) {
        if (this._handlers[event]) {
            this._handlers[event] = this._handlers[event].filter(h => h !== handler);
        }
        if (this._domHandlers?.[event]) {
            const idx = this._domHandlers[event].findIndex(e => e.handler === handler);
            if (idx !== -1) {
                document.removeEventListener(`mrdev:${event}`, this._domHandlers[event][idx].domHandler);
                this._domHandlers[event].splice(idx, 1);
            }
        }
    },

    /**
     * Hodisani yoqish
     * @param {string} event
     * @param {*} detail
     */
    emit(event, detail = null) {
        // Ichki handlerlar
        (this._handlers[event] || []).forEach(h => h(detail));
        // DOM event (boshqa modullar ham tinglashi uchun)
        document.dispatchEvent(new CustomEvent(`mrdev:${event}`, { detail }));
    },

    /**
     * HTML data-action ni EventBus ga ulash
     * Misol: <button data-action="logout">Chiqish</button>
     */
    bindDataActions() {
        document.addEventListener('click', (e) => {
            const el = e.target.closest('[data-action]');
            if (!el) return;
            const action = el.getAttribute('data-action');
            const param  = el.getAttribute('data-action-param') || null;
            this.emit(action, param);
        });
    }
};

export default EventBus;
