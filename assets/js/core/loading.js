// ==================== MRDEV UNIVERSAL LOADING v1.0 ====================
// Barcha joyda bir xil ishlatish uchun

class MrdevLoading {
    /**
     * Konteyner ichida loading ko'rsatish
     * @param {string|HTMLElement} container - CSS selector yoki element
     * @returns {HTMLElement} loading elementi
     */
    static show(container) {
        const el = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;
        
        if (!el) return null;

        // Avvalgi loadingni o'chirish
        this.hide(el);

        // Loading yaratish
        const loading = document.createElement('div');
        loading.className = 'mrdev-loading';
        loading.innerHTML = '<div class="mrdev-loading-bars"></div>';
        
        // Container position relative bo'lishi kerak
        const computed = getComputedStyle(el);
        if (computed.position === 'static') {
            el.style.position = 'relative';
        }

        el.appendChild(loading);
        
        // Animatsiya boshlanishi uchun kichik kechiktirish
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                loading.classList.add('show');
            });
        });

        return loading;
    }

    /**
     * Loadingni yashirish
     * @param {string|HTMLElement} container
     */
    static hide(container) {
        const el = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;
        
        if (!el) return;

        const loading = el.querySelector('.mrdev-loading');
        if (loading) {
            loading.classList.remove('show');
            setTimeout(() => {
                if (loading.parentNode) loading.remove();
            }, 350);
        }
    }

    /**
     * Global (butun sahifa) loading
     */
    static showGlobal() {
        return this.show(document.body);
    }

    static hideGlobal() {
        this.hide(document.body);
    }
}

window.MrdevLoading = MrdevLoading;