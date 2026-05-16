// api/groq.js — Vercel Serverless Proxy
// 5 ta Groq API kalit server tomonida yashirinadi

const KEYS = [
    process.env.VITE_GROQ_API_KEY_1,
    process.env.VITE_GROQ_API_KEY_2,
    process.env.VITE_GROQ_API_KEY_3,
    process.env.VITE_GROQ_API_KEY_4,
    process.env.VITE_GROQ_API_KEY_5,
].filter(Boolean);

let idx = 0;

function nextKey() {
    if (!KEYS.length) return null;
    const key = KEYS[idx % KEYS.length];
    idx = (idx + 1) % KEYS.length;
    return key;
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    let lastError = null;

    for (let attempt = 0; attempt < KEYS.length; attempt++) {
        const key = nextKey();
        if (!key) return res.status(500).json({ error: 'API kalitlar sozlanmagan' });

        try {
            const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${key}`
                },
                body: JSON.stringify(req.body)
            });

            const data = await groqRes.json();

            if (groqRes.status === 429) {
                lastError = data;
                continue; // keyingi kalitga o'tadi
            }

            return res.status(groqRes.status).json(data);
        } catch (e) {
            lastError = { error: e.message };
            continue;
        }
    }

    return res.status(429).json(lastError || { error: 'Barcha API kalitlarda limit tugadi' });
}
