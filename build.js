// build.js — env.js yaratmaydi, HTML ga ham inject qilmaydi
// Barcha kalitlar /api/config orqali server tomonidan beriladi

const fs = require('fs');

// Eski env.js ni o'chirib tashla
if (fs.existsSync('env.js')) {
    fs.unlinkSync('env.js');
    console.log('🗑️  Eski env.js o\'chirildi');
}

console.log('✅ Build tugadi. Kalitlar /api/config orqali beriladi.');
