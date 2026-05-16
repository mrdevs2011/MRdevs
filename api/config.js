// api/config.js — Firebase config ni server tomonidan beradi
// Kalitlar hech qachon HTML ga tushmaydi

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store'); // cache qilinmasin

    res.status(200).json({
        main: {
            apiKey:            process.env.VITE_MAIN_API_KEY             || "",
            authDomain:        process.env.VITE_MAIN_AUTH_DOMAIN         || "",
            databaseURL:       process.env.VITE_MAIN_DATABASE_URL        || "",
            projectId:         process.env.VITE_MAIN_PROJECT_ID          || "",
            storageBucket:     process.env.VITE_MAIN_STORAGE_BUCKET      || "",
            messagingSenderId: process.env.VITE_MAIN_MESSAGING_SENDER_ID || "",
            appId:             process.env.VITE_MAIN_APP_ID              || "",
            measurementId:     process.env.VITE_MAIN_MEASUREMENT_ID      || ""
        },
        secondary: {
            apiKey:            process.env.VITE_SECONDARY_API_KEY             || "",
            authDomain:        process.env.VITE_SECONDARY_AUTH_DOMAIN         || "",
            databaseURL:       process.env.VITE_SECONDARY_DATABASE_URL        || "",
            projectId:         process.env.VITE_SECONDARY_PROJECT_ID          || "",
            storageBucket:     process.env.VITE_SECONDARY_STORAGE_BUCKET      || "",
            messagingSenderId: process.env.VITE_SECONDARY_MESSAGING_SENDER_ID || "",
            appId:             process.env.VITE_SECONDARY_APP_ID              || "",
            measurementId:     process.env.VITE_SECONDARY_MEASUREMENT_ID      || ""
        },
        groupboard: {
            apiKey:            process.env.VITE_GROUPBOARD_API_KEY             || "",
            authDomain:        process.env.VITE_GROUPBOARD_AUTH_DOMAIN         || "",
            databaseURL:       process.env.VITE_GROUPBOARD_DATABASE_URL        || "",
            projectId:         process.env.VITE_GROUPBOARD_PROJECT_ID          || "",
            storageBucket:     process.env.VITE_GROUPBOARD_STORAGE_BUCKET      || "",
            messagingSenderId: process.env.VITE_GROUPBOARD_MESSAGING_SENDER_ID || "",
            appId:             process.env.VITE_GROUPBOARD_APP_ID              || "",
            measurementId:     process.env.VITE_GROUPBOARD_MEASUREMENT_ID      || ""
        },
        supabase: {
            url: process.env.VITE_SUPABASE_URL || "",
            key: process.env.VITE_SUPABASE_KEY || ""
        },
        app: {
            name:    process.env.VITE_APP_NAME          || "MRDEV",
            version: process.env.VITE_APP_VERSION       || "7.0",
            theme:   process.env.VITE_APP_DEFAULT_THEME || "dark"
        }
    });
}
