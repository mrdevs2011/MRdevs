// ==================== MRDEV GLOBAL CONFIG v8.1 ====================
// window.__ENV__ dan o'qiydi (build.js yaratadi yoki Vercel env)

const ENV = (typeof window !== 'undefined' && window.__ENV__) || {};

const MRDEV_CONFIG = {
    main: {
        apiKey:            ENV.VITE_MAIN_API_KEY             || "",
        authDomain:        ENV.VITE_MAIN_AUTH_DOMAIN         || "",
        databaseURL:       ENV.VITE_MAIN_DATABASE_URL        || "",
        projectId:         ENV.VITE_MAIN_PROJECT_ID          || "",
        storageBucket:     ENV.VITE_MAIN_STORAGE_BUCKET      || "",
        messagingSenderId: ENV.VITE_MAIN_MESSAGING_SENDER_ID || "",
        appId:             ENV.VITE_MAIN_APP_ID              || "",
        measurementId:     ENV.VITE_MAIN_MEASUREMENT_ID      || ""
    },
    secondary: {
        apiKey:            ENV.VITE_SECONDARY_API_KEY             || "",
        authDomain:        ENV.VITE_SECONDARY_AUTH_DOMAIN         || "",
        databaseURL:       ENV.VITE_SECONDARY_DATABASE_URL        || "",
        projectId:         ENV.VITE_SECONDARY_PROJECT_ID          || "",
        storageBucket:     ENV.VITE_SECONDARY_STORAGE_BUCKET      || "",
        messagingSenderId: ENV.VITE_SECONDARY_MESSAGING_SENDER_ID || "",
        appId:             ENV.VITE_SECONDARY_APP_ID              || "",
        measurementId:     ENV.VITE_SECONDARY_MEASUREMENT_ID      || ""
    },
    groupboard: {
        apiKey:            ENV.VITE_GROUPBOARD_API_KEY             || "",
        authDomain:        ENV.VITE_GROUPBOARD_AUTH_DOMAIN         || "",
        databaseURL:       ENV.VITE_GROUPBOARD_DATABASE_URL        || "",
        projectId:         ENV.VITE_GROUPBOARD_PROJECT_ID          || "",
        storageBucket:     ENV.VITE_GROUPBOARD_STORAGE_BUCKET      || "",
        messagingSenderId: ENV.VITE_GROUPBOARD_MESSAGING_SENDER_ID || "",
        appId:             ENV.VITE_GROUPBOARD_APP_ID              || "",
        measurementId:     ENV.VITE_GROUPBOARD_MEASUREMENT_ID      || ""
    },
    supabase: {
        url: ENV.VITE_SUPABASE_URL || "",
        key: ENV.VITE_SUPABASE_KEY || ""
    },
    app: {
        name:    ENV.VITE_APP_NAME          || "MRDEV",
        version: ENV.VITE_APP_VERSION       || "8.0",
        theme:   ENV.VITE_APP_DEFAULT_THEME || "dark"
    }
};

// ==================== EXPORT ====================
export default MRDEV_CONFIG;