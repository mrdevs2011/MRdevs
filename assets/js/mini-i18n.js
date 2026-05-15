// ==================== MRDEV MINI-I18N v1.0 ====================
// Barcha mini app'lar uchun markaziy tarjima yordamchisi.
// Ishlatish:
//   import { mt, initMiniI18n, onLangChange } from '../../assets/js/mini-i18n.js';
//   initMiniI18n();
//   mt('save')  // → "Saqlash" / "Сохранить" / "Save"

const miniTranslations = {
    uz: {
        // ===== UMUMIY =====
        guest:        "Mehmon",
        save:         "Saqlash",
        saving:       "Saqlanmoqda...",
        clear:        "Tozalash",
        cleared:      "Tozalandi",
        cancel:       "Bekor qilish",
        close:        "Yopish",
        delete:       "O'chirish",
        deleted:      "O'chirildi",
        add:          "Qo'shish",
        search:       "Qidirish",
        loading:      "Yuklanmoqda...",
        load:         "Yuklash",
        copy:         "Nusxalash",
        copied:       "Nusxalandi",
        share:        "Ulashish",
        open:         "Ochish",
        back:         "Orqaga",
        new:          "Yangi",
        error:        "Xatolik",
        success:      "Muvaffaqiyat",
        yes:          "Ha",
        no:           "Yo'q",
        login_req:    "Hisobga kiring",
        cloud_saved:  "Bulutga saqlandi! ",
        local_saved:  "Lokalga saqlandi",
        local_only:   "Faqat lokalga saqlandi",
        history_empty:"Tarix bo'sh",
        history:      "Tarix",
        clear_history:"Tarixni tozalash?",

        // ===== VAQT BIRLIKLARINI TARJIMA =====
        just_now:     "Hozir",
        hour:         "soat",
        minute:       "daqiqa",
        second:       "sekund",
        days: ['Yakshanba','Dushanba','Seshanba','Chorshanba','Payshanba','Juma','Shanba'],
        months: ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'],

        // ===== STOPWATCH =====
        start:        "Boshlash",
        pause:        "Pauza",
        reset:        "Qayta",
        lap:          "Lap",
        laps_empty:   "Lap mavjud emas",
        sessions:     "Sessiyalar tarixi",
        best_lap:     "Eng yaxshi",
        worst_lap:    "Eng sekin",
        avg_lap:      "O'rtacha",

        // ===== TIMER =====
        ready:        "Tayyor",
        running:      "Ishlamoqda",
        paused_s:     "Pauzada",
        finished:     "Tugadi!",
        restore:      "Tiklash",
        enter_time:   "Vaqt kiriting",
        last_timers:  "Oxirgi taymerlar",
        time_up:      "Vaqt tugadi",

        // ===== CALCULATOR =====
        calc_error:   "Xato",
        calc_history: "Hisob-kitoblar tarixi",

        // ===== CLOCK =====
        online:       "Online",
        offline:      "Offline",
        internet_time:"Internet vaqti",
        device_time:  "Qurilma vaqti",
        local_time:   "Mahalliy vaqt",
        sync:         "Sinxronlash",
        alarms:       "Alarmlar",
        new_alarm:    "Yangi alarm",
        alarm_saved:  "Alarm saqlandi",
        alarm_deleted:"Alarm o'chirildi",
        alarm_label:  "Nomi (ixtiyoriy)",
        alarm_time_l: "Vaqt",
        alarm_active: "Faol",
        alarm_ringing:"Alarm: ",
        alarm_name_ph:"Alarm nomi...",

        // ===== BINGO =====
        level:        "Daraja",
        games:        "O'yinlar",
        game_mode:    "O'yin rejimi",
        score:        "Hisob",
        draw:         "Durang",
        two_players:  "2 kishi",
        one_device:   "Bir qurilmada",
        robot:        "Robot",
        ai:           "Sun'iy intellekt",
        bot_level:    "Robot darajasi",
        play_bot:     "Robot bilan o'ynash",
        play_2p:      "2 kishi o'ynash",
        restart:      "Qayta o'ynash",
        lobby:        "Lobby",
        thinking:     "Robot o'ylamoqda...",
        turn:         "Navbat: ",
        last_games:   "Oxirgi o'yinlar",
        no_history:   "Hali o'yin tarixi yo'q",
        level_up:     "LEVEL UP! ",
        diff_0:       "Juda oson (0%)",
        diff_0d:      "Robot tasodifiy o'ynaydi",
        diff_easy:    "Oson",
        diff_easyD:   "Robot ko'pincha xato qiladi",
        diff_mid:     "O'rta",
        diff_midD:    "Robot ba'zan xato qiladi",
        diff_hard:    "Qiyin",
        diff_hardD:   "Robot kam xato qiladi",
        diff_vhard:   "Juda qiyin",
        diff_vhardD:  "Robot deyarli mukammal",
        diff_100:     "Mukammal (100%)",
        diff_100D:    "Robot hech qachon yutqazmaydi!",

        // ===== BOARD =====
        clear_board:  "Doskani tozalash?",

        // ===== EXAMER =====
        fill_fields:  "Barcha maydonlarni to'ldiring",
        enter_name:   "Exam nomini kiriting",
        add_question: "Kamida 1 ta savol qo'shing",
        exam_saved:   "Exam saqlandi! ID: ",
        delete_exam:  "Exam'ni o'chirish?",
        my_exams:     "Mening exam'larim",
        all_exams:    "Barcha exam'lar",
        no_questions: "Hali savol qo'shilmagan",
        q_count:      " savol",

        // ===== MUSIC =====
        no_music:     "Hali musiqalar yo'q",
        delete_audio: "ni o'chirish?",
        mic_perm:     "Mikrofon ruxsati kerak!",
        login_music:  "Avval hisobga kiring",
        rec_first:    "Avval audio yozing yoki yuklang",
        music_saved:  "Musiqa saqlandi!",
        delete_error: "O'chirishda xatolik",
        load_error:   "Yuklashda xatolik",
        rec_name_ph:  "Yozuv nomini kiriting...",
        musics:       "Musiqalar",
        add_music:    "Qo'shish",

        // ===== QR =====
        qr_error:     "QR yaratishda xatolik",
        qr_first:     "Avval QR kod yarating",
        downloaded:   "Yuklab olindi",
        no_share:     "Bu qurilma ulashishni qo'llab quvvatlamaydi",
        camera_on:    "Kamera ishga tushdi",
        camera_perm:  "Kamera ruxsati kerak!",
        qr_found:     "QR kod topildi!",
        qr_not_found: "QR kod topilmadi",
        img_load_err: "Rasm yuklanmadi",
        generate:     "Yaratish",
        scan:         "Skanerlash",
        wifi_tab:     "WiFi QR",

        // ===== SPLITVIEW =====
        url_saved:    "URL saqlandi",
        all_saved:    "Barcha URL'lar saqlandi!",
        muted:        "Ovozlar o'chirildi",
        clear_videos: "Barcha videolarni tozalash?",
        load_video:   "Avval video yuklang",
        login_split:  "Hisobga kiring",
    },

    ru: {
        // ===== UMUMIY =====
        guest:        "Гость",
        save:         "Сохранить",
        saving:       "Сохранение...",
        clear:        "Очистить",
        cleared:      "Очищено",
        cancel:       "Отмена",
        close:        "Закрыть",
        delete:       "Удалить",
        deleted:      "Удалено",
        add:          "Добавить",
        search:       "Поиск",
        loading:      "Загрузка...",
        load:         "Загрузить",
        copy:         "Копировать",
        copied:       "Скопировано",
        share:        "Поделиться",
        open:         "Открыть",
        back:         "Назад",
        new:          "Новый",
        error:        "Ошибка",
        success:      "Успешно",
        yes:          "Да",
        no:           "Нет",
        login_req:    "Войдите в аккаунт",
        cloud_saved:  "Сохранено в облаке! ",
        local_saved:  "Сохранено локально",
        local_only:   "Только локальное сохранение",
        history_empty:"История пуста",
        history:      "История",
        clear_history:"Очистить историю?",

        just_now:     "Только что",
        hour:         "час",
        minute:       "минута",
        second:       "секунда",
        days: ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'],
        months: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],

        start:        "Старт",
        pause:        "Пауза",
        reset:        "Сброс",
        lap:          "Круг",
        laps_empty:   "Нет кругов",
        sessions:     "История сессий",
        best_lap:     "Лучший",
        worst_lap:    "Худший",
        avg_lap:      "Среднее",

        ready:        "Готово",
        running:      "Идёт",
        paused_s:     "Пауза",
        finished:     "Завершено!",
        restore:      "Сбросить",
        enter_time:   "Введите время",
        last_timers:  "Последние таймеры",
        time_up:      "Время вышло",

        calc_error:   "Ошибка",
        calc_history: "История вычислений",

        online:       "Онлайн",
        offline:      "Офлайн",
        internet_time:"Время интернета",
        device_time:  "Время устройства",
        local_time:   "Местное время",
        sync:         "Синхронизировать",
        alarms:       "Будильники",
        new_alarm:    "Новый будильник",
        alarm_saved:  "Будильник сохранён",
        alarm_deleted:"Будильник удалён",
        alarm_label:  "Название (необяз.)",
        alarm_time_l: "Время",
        alarm_active: "Активен",
        alarm_ringing:"Будильник: ",
        alarm_name_ph:"Название будильника...",

        level:        "Уровень",
        games:        "Игры",
        game_mode:    "Режим игры",
        score:        "Счёт",
        draw:         "Ничья",
        two_players:  "2 игрока",
        one_device:   "На одном устройстве",
        robot:        "Робот",
        ai:           "Искусственный интеллект",
        bot_level:    "Уровень робота",
        play_bot:     "Играть с роботом",
        play_2p:      "Игра 2 игрока",
        restart:      "Переиграть",
        lobby:        "Лобби",
        thinking:     "Робот думает...",
        turn:         "Ход: ",
        last_games:   "Последние игры",
        no_history:   "Истории игр нет",
        level_up:     "УРОВЕНЬ ВВЕРХ! ",
        diff_0:       "Очень легко (0%)",
        diff_0d:      "Робот играет случайно",
        diff_easy:    "Легко",
        diff_easyD:   "Робот часто ошибается",
        diff_mid:     "Средне",
        diff_midD:    "Робот иногда ошибается",
        diff_hard:    "Сложно",
        diff_hardD:   "Робот редко ошибается",
        diff_vhard:   "Очень сложно",
        diff_vhardD:  "Робот почти идеален",
        diff_100:     "Идеально (100%)",
        diff_100D:    "Робот никогда не проиграет!",

        clear_board:  "Очистить доску?",

        fill_fields:  "Заполните все поля",
        enter_name:   "Введите название экзамена",
        add_question: "Добавьте минимум 1 вопрос",
        exam_saved:   "Экзамен сохранён! ID: ",
        delete_exam:  "Удалить экзамен?",
        my_exams:     "Мои экзамены",
        all_exams:    "Все экзамены",
        no_questions: "Вопросы не добавлены",
        q_count:      " вопр.",

        no_music:     "Музыки ещё нет",
        delete_audio: " удалить?",
        mic_perm:     "Нужен доступ к микрофону!",
        login_music:  "Войдите в аккаунт",
        rec_first:    "Сначала запишите или загрузите аудио",
        music_saved:  "Музыка сохранена!",
        delete_error: "Ошибка удаления",
        load_error:   "Ошибка загрузки",
        rec_name_ph:  "Введите название записи...",
        musics:       "Музыка",
        add_music:    "Добавить",

        qr_error:     "Ошибка создания QR",
        qr_first:     "Сначала создайте QR код",
        downloaded:   "Скачано",
        no_share:     "Устройство не поддерживает отправку",
        camera_on:    "Камера запущена",
        camera_perm:  "Нужен доступ к камере!",
        qr_found:     "QR код найден!",
        qr_not_found: "QR код не найден",
        img_load_err: "Изображение не загружено",
        generate:     "Создать",
        scan:         "Сканировать",
        wifi_tab:     "WiFi QR",

        url_saved:    "URL сохранён",
        all_saved:    "Все URL сохранены!",
        muted:        "Звук отключён",
        clear_videos: "Очистить все видео?",
        load_video:   "Сначала загрузите видео",
        login_split:  "Войдите в аккаунт",
    },

    en: {
        // ===== UMUMIY =====
        guest:        "Guest",
        save:         "Save",
        saving:       "Saving...",
        clear:        "Clear",
        cleared:      "Cleared",
        cancel:       "Cancel",
        close:        "Close",
        delete:       "Delete",
        deleted:      "Deleted",
        add:          "Add",
        search:       "Search",
        loading:      "Loading...",
        load:         "Load",
        copy:         "Copy",
        copied:       "Copied",
        share:        "Share",
        open:         "Open",
        back:         "Back",
        new:          "New",
        error:        "Error",
        success:      "Success",
        yes:          "Yes",
        no:           "No",
        login_req:    "Please log in",
        cloud_saved:  "Saved to cloud! ",
        local_saved:  "Saved locally",
        local_only:   "Local save only",
        history_empty:"History is empty",
        history:      "History",
        clear_history:"Clear history?",

        just_now:     "Just now",
        hour:         "hour",
        minute:       "minute",
        second:       "second",
        days: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
        months: ['January','February','March','April','May','June','July','August','September','October','November','December'],

        start:        "Start",
        pause:        "Pause",
        reset:        "Reset",
        lap:          "Lap",
        laps_empty:   "No laps yet",
        sessions:     "Session history",
        best_lap:     "Best",
        worst_lap:    "Worst",
        avg_lap:      "Average",

        ready:        "Ready",
        running:      "Running",
        paused_s:     "Paused",
        finished:     "Finished!",
        restore:      "Reset",
        enter_time:   "Enter time",
        last_timers:  "Recent timers",
        time_up:      "Time is up",

        calc_error:   "Error",
        calc_history: "Calculation history",

        online:       "Online",
        offline:      "Offline",
        internet_time:"Internet time",
        device_time:  "Device time",
        local_time:   "Local time",
        sync:         "Sync",
        alarms:       "Alarms",
        new_alarm:    "New alarm",
        alarm_saved:  "Alarm saved",
        alarm_deleted:"Alarm deleted",
        alarm_label:  "Label (optional)",
        alarm_time_l: "Time",
        alarm_active: "Active",
        alarm_ringing:"Alarm: ",
        alarm_name_ph:"Alarm label...",

        level:        "Level",
        games:        "Games",
        game_mode:    "Game mode",
        score:        "Score",
        draw:         "Draw",
        two_players:  "2 players",
        one_device:   "On one device",
        robot:        "Robot",
        ai:           "Artificial intelligence",
        bot_level:    "Bot difficulty",
        play_bot:     "Play vs Robot",
        play_2p:      "2-player game",
        restart:      "Play again",
        lobby:        "Lobby",
        thinking:     "Robot is thinking...",
        turn:         "Turn: ",
        last_games:   "Recent games",
        no_history:   "No game history yet",
        level_up:     "LEVEL UP! ",
        diff_0:       "Very easy (0%)",
        diff_0d:      "Robot plays randomly",
        diff_easy:    "Easy",
        diff_easyD:   "Robot makes many mistakes",
        diff_mid:     "Medium",
        diff_midD:    "Robot makes some mistakes",
        diff_hard:    "Hard",
        diff_hardD:   "Robot rarely makes mistakes",
        diff_vhard:   "Very hard",
        diff_vhardD:  "Robot is near perfect",
        diff_100:     "Perfect (100%)",
        diff_100D:    "Robot never loses!",

        clear_board:  "Clear the board?",

        fill_fields:  "Please fill all fields",
        enter_name:   "Enter exam name",
        add_question: "Add at least 1 question",
        exam_saved:   "Exam saved! ID: ",
        delete_exam:  "Delete exam?",
        my_exams:     "My exams",
        all_exams:    "All exams",
        no_questions: "No questions added yet",
        q_count:      " questions",

        no_music:     "No music yet",
        delete_audio: " delete?",
        mic_perm:     "Microphone permission needed!",
        login_music:  "Please log in first",
        rec_first:    "Record or upload audio first",
        music_saved:  "Music saved!",
        delete_error: "Error deleting",
        load_error:   "Error loading",
        rec_name_ph:  "Enter recording name...",
        musics:       "Music",
        add_music:    "Add",

        qr_error:     "QR generation error",
        qr_first:     "Generate a QR code first",
        downloaded:   "Downloaded",
        no_share:     "This device doesn't support sharing",
        camera_on:    "Camera started",
        camera_perm:  "Camera permission needed!",
        qr_found:     "QR code found!",
        qr_not_found: "QR code not found",
        img_load_err: "Image failed to load",
        generate:     "Generate",
        scan:         "Scan",
        wifi_tab:     "WiFi QR",

        url_saved:    "URL saved",
        all_saved:    "All URLs saved!",
        muted:        "All sounds muted",
        clear_videos: "Clear all videos?",
        load_video:   "Load a video first",
        login_split:  "Please log in",
    }
};

// ==================== CORE ====================
let _lang = localStorage.getItem('mrdev_lang') || 'uz';

/**
 * Mini app tarjima funksiyasi.
 * mt('save') → "Saqlash" | "Сохранить" | "Save"
 */
export function mt(key) {
    return miniTranslations[_lang]?.[key]
        ?? miniTranslations.uz[key]
        ?? key;
}

/**
 * Mini app'ni i18n bilan ishga tushirish.
 * DOMContentLoaded dan OLDIN yoki ichida chaqirilsin.
 * - HTML dagi data-i18n-mini="key" elementlarni tarjima qiladi
 * - localStorage tilini o'qiydi
 * - languageChanged eventini tinglaydi
 */
export function initMiniI18n() {
    _lang = localStorage.getItem('mrdev_lang') || 'uz';
    document.documentElement.lang = _lang;
    _applyDOM();

    // Settings'da til o'zgarganda shu sahifa ham yangilansin
    // (storage event — boshqa tab/sahifadan o'zgarish)
    window.addEventListener('storage', function(e) {
        if (e.key === 'mrdev_lang' && e.newValue && e.newValue !== _lang) {
            _lang = e.newValue;
            document.documentElement.lang = _lang;
            _applyDOM();
            document.dispatchEvent(new CustomEvent('miniLangChanged', { detail: { lang: _lang } }));
        }
    });

    // Agar bir sahifada settings orqali o'zgarganda
    document.addEventListener('languageChanged', function(e) {
        if (e.detail?.lang && e.detail.lang !== _lang) {
            _lang = e.detail.lang;
            document.documentElement.lang = _lang;
            _applyDOM();
        }
    });
}

/**
 * Lang o'zgarganda custom callback ro'yxatdan o'tkazish.
 * Har bir mini app o'z UI'ini shu orqali yangilaydi.
 * onLangChange(() => { renderHistory(); updateButtons(); ... });
 */
export function onLangChange(callback) {
    document.addEventListener('miniLangChanged', function() {
        callback(_lang);
    });
    // Sahifa yuklanishi uchun ham chaqiramiz
    document.addEventListener('DOMContentLoaded', function() {
        callback(_lang);
    });
}

/**
 * Joriy tilni qaytarish.
 */
export function getCurrentMiniLang() {
    return _lang;
}

// ==================== INTERNAL ====================
function _applyDOM() {
    // data-i18n-mini="key" → textContent
    document.querySelectorAll('[data-i18n-mini]').forEach(function(el) {
        var key = el.getAttribute('data-i18n-mini');
        var val = mt(key);
        if (typeof val === 'string') {
            if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                el.placeholder = val;
            } else {
                el.textContent = val;
            }
        }
    });

    // data-i18n-mini-ph="key" → placeholder
    document.querySelectorAll('[data-i18n-mini-ph]').forEach(function(el) {
        var key = el.getAttribute('data-i18n-mini-ph');
        el.placeholder = mt(key);
    });

    // Trigger name — header da "Mehmon" / "Гость" / "Guest"
    // (foydalanuvchi login qilmagan holatda)
    var triggerName = document.getElementById('triggerNameMini');
    if (triggerName && (triggerName.textContent === 'Mehmon' || triggerName.textContent === 'Гость' || triggerName.textContent === 'Guest')) {
        triggerName.textContent = mt('guest');
    }
}
