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
                <svg viewBox="0 0 80 80">
                    <circle class="splash-circle" cx="40" cy="40" r="36"/>
                    <text class="splash-text" x="40" y="46" text-anchor="middle">MR</text>
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