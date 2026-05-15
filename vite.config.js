// ==================== MRDEV VITE CONFIG v1.1 ====================
import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import { readdirSync, existsSync } from 'fs';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    // ==================== MULTI-PAGE INPUT ====================
    // 1. Asosiy sahifa (index.html)
    const input = { 
        main: resolve(__dirname, 'index.html') 
    };

    // 2. Root-level (ildiz) sahifalar: settings/ va about/
    const rootPages = ['settings', 'about'];
    for (const page of rootPages) {
        const htmlPath = resolve(__dirname, page, 'index.html');
        if (existsSync(htmlPath)) {
            input[page] = htmlPath;
        }
    }

    // 3. Subdirectory-based sahifalar: popular/ va mini/
    const subDirs = ['popular', 'mini'];
    for (const dir of subDirs) {
        if (!existsSync(dir)) continue;
        
        const apps = readdirSync(dir);
        for (const app of apps) {
            const htmlPath = resolve(__dirname, dir, app, 'index.html');
            if (existsSync(htmlPath)) {
                input[`${dir}_${app}`] = htmlPath;
            }
        }
    }

    return {
        // ==================== STATIC FILES ====================
        publicDir: 'public',

        // ==================== BUILD ====================
        build: {
            outDir: 'dist',
            // FIX: CSS code splitting o'chirildi — 20+ entry point bilan
            // Vite shared CSS ni ba'zi HTML larga link qo'shishni unutishi mumkin.
            // false qo'yilsa har bir page o'z CSS ni oladi, muammo yo'qoladi.
            cssCodeSplit: false,
            rollupOptions: {
                input,
                output: {
                    manualChunks: {
                        'firebase-core':  ['firebase/app'],
                        'firebase-auth':  ['firebase/auth'],
                        'firebase-db':    ['firebase/database'],
                        'firebase-store': ['firebase/firestore'],
                    }
                }
            },
            chunkSizeWarningLimit: 600,
        },

        // ==================== DEV SERVER ====================
        server: {
            port: 3000,
            open: true,
        },

        // ==================== ENV ====================
        envPrefix: 'VITE_',

        // ==================== PATHS ====================
        resolve: {
            alias: {
                '@core':    resolve(__dirname, 'assets/js/core'),
                '@ui':      resolve(__dirname, 'assets/js/ui'),
                '@features':resolve(__dirname, 'assets/js/features'),
                '@css':     resolve(__dirname, 'assets/css'),
                '@locales': resolve(__dirname, 'assets/locales'),
            }
        },

        // ==================== TEST ====================
        test: {
            environment: 'jsdom',
            globals: true,
            setupFiles: ['./tests/setup.js'],
            coverage: {
                provider: 'v8',
                reporter: ['text', 'html'],
                include: ['assets/js/**/*.js'],
                exclude: ['assets/js/core/logger.js']
            }
        }
    };
});