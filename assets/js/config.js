// assets/js/config.js — kalitlarni /api/config dan yuklaydi
// window.__ENV__ ga bog'liq emas

let MRDEV_CONFIG = null;

export async function getConfig() {
    if (MRDEV_CONFIG) return MRDEV_CONFIG;

    const res = await fetch('/api/config');
    if (!res.ok) throw new Error('Config yuklanmadi');
    const data = await res.json();

    MRDEV_CONFIG = {
        main:       data.main,
        secondary:  data.secondary,
        groupboard: data.groupboard,
        supabase:   data.supabase,
        app:        data.app
    };

    return MRDEV_CONFIG;
}

export default MRDEV_CONFIG;
