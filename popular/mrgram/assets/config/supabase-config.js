import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

async function loadConfig() {
    const res = await fetch("/api/config");
    if (!res.ok) throw new Error("Config yuklanmadi");
    return await res.json();
}

const cfg = await loadConfig();

if (!cfg.supabase?.url || !cfg.supabase?.key) {
    console.error("❌ mrgram/supabase-config: supabase config topilmadi!");
}

export const supabase = createClient(cfg.supabase.url, cfg.supabase.key);
export const BUCKET = "videos";
