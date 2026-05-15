// ==================== MRDEV GLOBAL CONFIG v8.2 ====================
// import.meta.env dan o'qiydi — Vite build vaqtida inline qiladi
// Env o'zgaruvchilar faqat Vercel Dashboard > Settings > Env Vars da saqlansin

const MRDEV_CONFIG = {
    main: {
        apiKey:            import.meta.env.VITE_MAIN_API_KEY,
        authDomain:        import.meta.env.VITE_MAIN_AUTH_DOMAIN,
        databaseURL:       import.meta.env.VITE_MAIN_DATABASE_URL,
        projectId:         import.meta.env.VITE_MAIN_PROJECT_ID,
        storageBucket:     import.meta.env.VITE_MAIN_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_MAIN_MESSAGING_SENDER_ID,
        appId:             import.meta.env.VITE_MAIN_APP_ID,
        measurementId:     import.meta.env.VITE_MAIN_MEASUREMENT_ID
    },
    secondary: {
        apiKey:            import.meta.env.VITE_SECONDARY_API_KEY,
        authDomain:        import.meta.env.VITE_SECONDARY_AUTH_DOMAIN,
        databaseURL:       import.meta.env.VITE_SECONDARY_DATABASE_URL,
        projectId:         import.meta.env.VITE_SECONDARY_PROJECT_ID,
        storageBucket:     import.meta.env.VITE_SECONDARY_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_SECONDARY_MESSAGING_SENDER_ID,
        appId:             import.meta.env.VITE_SECONDARY_APP_ID,
        measurementId:     import.meta.env.VITE_SECONDARY_MEASUREMENT_ID
    },
    groupboard: {
        apiKey:            import.meta.env.VITE_GROUPBOARD_API_KEY,
        authDomain:        import.meta.env.VITE_GROUPBOARD_AUTH_DOMAIN,
        databaseURL:       import.meta.env.VITE_GROUPBOARD_DATABASE_URL,
        projectId:         import.meta.env.VITE_GROUPBOARD_PROJECT_ID,
        storageBucket:     import.meta.env.VITE_GROUPBOARD_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_GROUPBOARD_MESSAGING_SENDER_ID,
        appId:             import.meta.env.VITE_GROUPBOARD_APP_ID,
        measurementId:     import.meta.env.VITE_GROUPBOARD_MEASUREMENT_ID
    },
    supabase: {
        url: import.meta.env.VITE_SUPABASE_URL,
        key: import.meta.env.VITE_SUPABASE_KEY
    },
    app: {
        name:    import.meta.env.VITE_APP_NAME    || "MRDEV",
        version: import.meta.env.VITE_APP_VERSION || "8.0",
        theme:   import.meta.env.VITE_APP_THEME   || "dark"
    }
};

// ==================== EXPORT ====================
export default MRDEV_CONFIG;
