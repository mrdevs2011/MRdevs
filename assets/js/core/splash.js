// ==================== MRDEV SPLASH SCREEN v1.0 ====================
// Sahifa yuklanganda avtomatik ishlaydi

class MrdevSplash {
    constructor() {
        this.splash = null;
        this.init();
    }

    init() {
        // Splash element yaratish
        this.splash = document.createElement('div');
        this.splash.className = 'mrdev-splash';
        this.splash.innerHTML = `
            <div class="mrdev-splash-logo">
                <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="splashBg" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#24A1DE"/>
                            <stop offset="100%" stop-color="#70C7FF"/>
                        </linearGradient>
                    </defs>
                    <circle cx="40" cy="40" r="40" fill="url(#splashBg)"/>
                    <path class="splash-triangle" d="M40,14 L67,62 L13,62 Z" fill="white" fill-opacity="0.93"/>
                </svg>
            </div>
        `;
        document.body.prepend(this.splash);

        // Sahifa yuklanganda yashirish
        window.addEventListener('load', () => {
            this.hide();
        });

        // Agar 3 soniyada yuklanmasa, majburiy yashirish
        setTimeout(() => {
            if (this.splash && !this.splash.classList.contains('hidden')) {
                this.hide();
            }
        }, 3000);
    }

    hide() {
        if (!this.splash) return;
        this.splash.classList.add('hidden');
        // Animatsiya tugagach DOM dan o'chirish
        setTimeout(() => {
            if (this.splash && this.splash.parentNode) {
                this.splash.remove();
            }
        }, 600);
    }
}

// Avtomatik ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    new MrdevSplash();
});