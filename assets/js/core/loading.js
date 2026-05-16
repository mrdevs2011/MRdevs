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
        loading.innerHTML = `
            <div class="mrdev-loading-icon">
                <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="loadingBg" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#24A1DE"/>
                            <stop offset="100%" stop-color="#70C7FF"/>
                        </linearGradient>
                    </defs>
                    <circle cx="20" cy="20" r="20" fill="url(#loadingBg)"/>
                    <path class="loading-tri" d="M20,7 L34,31 L6,31 Z" fill="white" fill-opacity="0.93"/>
                </svg>
            </div>
        `;
        
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