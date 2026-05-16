// ==================== MRDEV I18N v4.1 ====================
// Barcha ilovalar uchun markaziy tarjima tizimi

const translations = {
    uz: {
        // ========== HEADER & MENU ==========
        back: "Bosh sahifa",
        settings_title: "Sozlamalar",
        all_apps: "Barcha ilovalar",
        popular_apps: "Asosiy ilovalar",
        mini_apps: "Yordamchi ilovalar",
        search_placeholder: "Ilovalarni qidirish...",
        menu: "Menyu",
        close: "X",
        version: "MRDEV made with mr",
        user_role: "Foydalanuvchi",
        app_title: "MRDEV",

        // ========== AUTH & LOGIN ==========
        login: "Hisobga kirish",
        register: "Ro'yxatdan o'tish",
        logout: "Chiqish",
        email: "Email",
        password: "Parol",
        name: "Ism Familiya",
        or: "yoki",
        google_login: "Google orqali kirish",
        mrdev_login: "MRDEV ID orqali kirish",
        guest: "Mehmon",
        login_required: "Hisobga kiring",
        no_account: "Hisobingiz yo'qmi?",
        have_account: "Hisobingiz bormi?",
        email_required: "Username yoki email kiriting",
        password_required: "Parolni kiriting",
        name_required: "Ism kiriting (kamida 2 belgi)",
        password_length: "Parol kamida 6 belgi bo'lishi kerak",
        account_created: "Hisob yaratildi",
        username_placeholder: "username (username@mrdev.uz bo'ladi)",
        email_placeholder: "username@mrdev.uz",
        password_placeholder: "••••••••",
        password_placeholder_new: "Yangi parol (kamida 6 belgi)",
        name_placeholder: "Sardor Karimov",

        // ========== MRDEV ID ==========
        mrdev_id: "MRDEV ID kiriting",
        mrdev_id_placeholder: "# _ _ _ _ _ _",
        mrdev_id_desc: "# belgisi bilan boshlanadigan 7 xonali kod",
        mrdev_what_desc_small: "6 xonali raqam, # bilan boshlanadi. Kirish va ilovalardan foydalanish uchun kerak bo'ladi.",
        enter_code: "Kodni kiriting",
        code_sent: "Hisob egasiga yuborilgan 6 xonali kod",
        code_sent_desc: "Kod \"Parol xabarlari\" bo'limiga yuboriladi",
        resend_code: "Kod kelmadimi?",
        verify: "Tasdiqlash",
        mrdev_what: "MRDEV ID nima?",
        mrdev_what_desc: "MRDEV ID — shaxsiy raqamingiz",
        more_info: "Ko'proq bilish",
        pass_notifications: "Parol xabarlari",

        // ========== SETTINGS ==========
        dark_mode: "Qorong'i rejim",
        dark_mode_desc: "Interfeys ranglarini o'zgartirish",
        notifications: "Bildirishnomalar",
        notifications_desc: "Parol xabarlari va yangiliklar",
        notifications_disabled: "Bildirishnomalar o'chirilgan",
        language: "Til",
        language_desc: "Platforma tilini tanlash",
        cache: "Kesh va xotira",
        cache_desc: "vaqtinchalik ma'lumot",
        account: "Hisob",
        account_desc: "Hisobdan chiqish yoki loyiha haqida",
        about: "Loyiha haqida",
        clear: "Tozalash",
        cleared: "Kesh tozalandi",
        reload: "Qayta yuklash",

        // ========== ACCOUNT SWITCHER ==========
        accounts: "Hisoblar",
        add_account: "Hisob qo'shish",
        no_accounts: "Hali hisob qo'shilmagan",
        active: "Faol",
        switch: "O'tish",
        switch_to: "hisobiga o'tish",
        delete: "O'chirish",
        confirm_delete: "hisobini o'chirmoqchimisiz?",
        account_deleted: "Hisob o'chirildi",
        all_accounts_deleted: "Barcha hisoblar o'chirildi",
        max_accounts: "Maksimal 3 ta hisob qo'sha olasiz",
        accounts_limit: "ta hisob qo'sha olasiz",
        email_password: "Email/Parol",
        switched_to: "hisobiga o'tildi",

        // ========== COMMON ==========
        loading: "Yuklanmoqda...",
        error: "Xatolik",
        success: "Muvaffaqiyat",
        welcome: "Xush kelibsiz",
        logout_success: "Hisobdan chiqildi",
        logout_confirm: "Hisobdan chiqmoqchimisiz?",
        theme_toggle: "Rejimni almashtirish",
        profile: "Profil",
        my_id: "Mening ID",
        settings: "Sozlamalar",
        help: "Yordam",
        save: "Saqlash",
        cancel: "Bekor qilish",
        yes: "Ha",
        no: "Yo'q",
        ok: "OK",

        // ========== NOTIFICATIONS ==========
        no_notifications: "Xabarlar yo'q",
        pass_code: "Parol kodi",
        expires: "Muddati",
        used: "Ishlatilgan",
        active_status: "Faol",
        expired: "Muddati tugagan",

        // ========== DEVICES & ACCOUNTS ==========
        connected_accounts: "Ulangan hisoblar",
        no_connected_accounts: "Ulangan hisob topilmadi",
        connected_device_not_found: "Ulangan qurilma topilmadi",
        current_device: "Hozirgi qurilma",
        device_name_default: "Qurilma",
        apps_not_found: "Ilovalar topilmadi",

        // ========== MINI: CALCULATOR ==========
        calc_history_title:         "Hisob-kitoblar tarixi",
        calc_clear:                  "Tozalash",
        calc_history_empty:          "Tarix bo'sh",
        calc_history_clear_confirm:  "Tarixni tozalash?",
        calc_cleared:                "Tozalandi",

        // ========== MINI: BINGO ==========
        bingo_game_mode:      "O'yin rejimi",
        bingo_two_players:    "2 kishi",
        bingo_bot:            "Robot",
        bingo_bot_level:      "Robot darajasi",
        bingo_score:          "Hisob",
        bingo_last_games:     "Oxirgi o'yinlar",
        bingo_bot_thinking:   "Robot o'ylamoqda...",
        bingo_history_empty:  "Hali o'yin tarixi yo'q",
        bingo_draw_label:     "Durang",
        bingo_turn_prefix:    "Navbat: ",
        bingo_draw:           "Durang!",
        bingo_x_wins:         "X yutdi!",
        bingo_you_win:        "Siz yutdingiz!",
        bingo_o_wins:         "O yutdi!",
        bingo_bot_wins:       "Robot yutdi!",
        bingo_welcome:        "Xush kelibsiz, ",
        bingo_diff_0_label:   "Juda oson (0%)",
        bingo_diff_0_desc:    "Robot tasodifiy o'ynaydi",
        bingo_diff_easy_label:"Oson",
        bingo_diff_easy_desc: "Robot ko'pincha xato qiladi",
        bingo_diff_mid_label: "O'rta",
        bingo_diff_mid_desc:  "Robot ba'zan xato qiladi",
        bingo_diff_hard_label:"Qiyin",
        bingo_diff_hard_desc: "Robot kam xato qiladi",
        bingo_diff_vhard_label:"Juda qiyin",
        bingo_diff_vhard_desc:"Robot deyarli mukammal",
        bingo_diff_perf_label:"Mukammal (100%)",
        bingo_diff_perf_desc: "Robot hech qachon yutqazmaydi!",

        // ========== MINI: CLOCK ==========
        clock_local:          "Mahalliy vaqt",
        clock_internet:       "Internet vaqti",
        clock_device_time:    "Qurilma vaqti",
        clock_synced:         "Vaqt sinxronlandi",
        clock_no_internet:    "Internet yo'q",
        clock_no_alarms:      "Alarmlar mavjud emas",
        clock_alarm_deleted:  "Alarm o'chirildi",
        clock_new_alarm:      "Yangi alarm",
        clock_alarm_saved:    "Alarm saqlandi",
        clock_time_label:     "Vaqt",
        clock_name_label:     "Nomi (ixtiyoriy)",
        clock_active:         "Faol",
        clock_24h:            "24 soat",
        clock_12h:            "12 soat",
        clock_days:           ["Yakshanba","Dushanba","Seshanba","Chorshanba","Payshanba","Juma","Shanba"],
        clock_months:         ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"],

        // ========== MINI: TIMER ==========
        timer_last:           "Oxirgi taymerlar",
        timer_clear:          "Tozalash",
        timer_empty:          "Tarix bo'sh",
        timer_enter_time:     "Vaqt kiriting",
        timer_clear_confirm:  "Tarixni tozalash?",
        timer_cleared:        "Tozalandi",
        timer_hours:          "Soat",
        timer_minutes:        "Daqiqa",
        timer_seconds:        "Sekund",
        timer_ready:          "Tayyor",
        timer_running:        "Ishlamoqda",
        timer_paused:         "Pauzada",
        timer_done:           "Tugadi!",

        // ========== MINI: STOPWATCH ==========
        sw_start:             "Boshlash",
        sw_pause:             "Pauza",
        sw_laps_empty:        "Lap mavjud emas",
        sw_history_empty:     "Tarix bo'sh",
        sw_clear_confirm:     "Tarixni tozalash?",
        sw_cleared:           "Tozalandi",

        // ========== MINI: MUSIC ==========
        music_empty:          "Hali musiqalar yo'q",
        music_login_load:     "Musiqalarni yuklash uchun hisobga kiring",
        music_deleted:        "O'chirildi",
        music_delete_error:   "O'chirishda xatolik",
        music_load_error:     "Yuklashda xatolik",
        music_mic_required:   "Mikrofon ruxsati kerak!",
        music_login_save:     "Avval hisobga kiring",
        music_record_first:   "Avval audio yozing yoki yuklang",
        music_saved:          "Musiqa saqlandi!",
        music_tab_list:       "Musiqalar",
        music_tab_add:        "Qo'shish",
        music_page_title:     "Musiqalar",
        music_add_title:      "Audio qo'shish",
        music_upload_btn:     "Yoki fayl yuklash",
        music_delete_confirm: "ni o'chirish?",

        // ========== MINI: BOARD ==========
        board_saved_cloud:    "Bulutga saqlandi! ☁️",
        board_saved_local_only:"Faqat lokalga saqlandi",
        board_saved_local:    "Lokalga saqlandi",
        board_clear_confirm:  "Doskani tozalash?",

        // ========== MINI: SPLITVIEW ==========
        split_add_video:      "Video qo'shish",
        split_saved_urls:     "Saqlangan URL'lar",
        split_enter_url:      "URL kiriting",
        split_cancel:         "Bekor qilish",
        split_load:           "Yuklash",
        split_url_saved:      "URL saqlandi",
        split_muted:          "Ovozlar o'chirildi",
        split_clear_confirm:  "Barcha videolarni tozalash?",
        split_cleared:        "Tozalandi",
        split_no_saved:       "Saqlangan URL'lar yo'q",
        split_deleted:        "O'chirildi",
        split_load_first:     "Avval video yuklang",
        split_login_required: "Hisobga kiring",
        split_all_saved:      "Barcha URL'lar saqlandi!",
        split_error:          "Xatolik"
    },

    ru: {
        // ========== HEADER & MENU ==========
        back: "Главная",
        settings_title: "Настройки",
        all_apps: "Все приложения",
        popular_apps: "Основные приложения",
        mini_apps: "Вспомогательные приложения",
        search_placeholder: "Поиск приложений...",
        menu: "Меню",
        close: "X",
        version: "MRDEV сделано с любовью",
        user_role: "Пользователь",
        app_title: "MRDEV",

        // ========== AUTH & LOGIN ==========
        login: "Войти",
        register: "Регистрация",
        logout: "Выйти",
        email: "Email",
        password: "Пароль",
        name: "Имя Фамилия",
        or: "или",
        google_login: "Войти через Google",
        mrdev_login: "Войти через MRDEV ID",
        guest: "Гость",
        login_required: "Войдите в аккаунт",
        no_account: "Нет аккаунта?",
        have_account: "Есть аккаунт?",
        email_required: "Введите имя пользователя или email",
        password_required: "Введите пароль",
        name_required: "Введите имя (минимум 2 символа)",
        password_length: "Пароль должен быть не менее 6 символов",
        account_created: "Аккаунт создан",
        username_placeholder: "username (будет username@mrdev.uz)",
        email_placeholder: "username@mrdev.uz",
        password_placeholder: "••••••••",
        password_placeholder_new: "Новый пароль (мин. 6 символов)",
        name_placeholder: "Сардор Каримов",

        // ========== MRDEV ID ==========
        mrdev_id: "Введите MRDEV ID",
        mrdev_id_placeholder: "# _ _ _ _ _ _",
        mrdev_id_desc: "7-значный код, начинающийся с #",
        mrdev_what_desc_small: "6-значный номер, начинающийся с #. Нужен для входа и использования приложений.",
        enter_code: "Введите код",
        code_sent: "6-значный код отправлен владельцу аккаунта",
        code_sent_desc: "Код отправлен в раздел \"Парольные уведомления\"",
        resend_code: "Не пришёл код?",
        verify: "Подтвердить",
        mrdev_what: "Что такое MRDEV ID?",
        mrdev_what_desc: "MRDEV ID — ваш персональный номер",
        more_info: "Узнать больше",
        pass_notifications: "Парольные уведомления",

        // ========== SETTINGS ==========
        dark_mode: "Тёмный режим",
        dark_mode_desc: "Изменить цвета интерфейса",
        notifications: "Уведомления",
        notifications_desc: "Парольные уведомления и новости",
        notifications_disabled: "Уведомления выключены",
        language: "Язык",
        language_desc: "Выберите язык платформы",
        cache: "Кэш и память",
        cache_desc: "временных данных",
        account: "Аккаунт",
        account_desc: "Выйти или о проекте",
        about: "О проекте",
        clear: "Очистить",
        cleared: "Кэш очищен",
        reload: "Перезагрузить",

        // ========== ACCOUNT SWITCHER ==========
        accounts: "Аккаунты",
        add_account: "Добавить аккаунт",
        no_accounts: "Аккаунты не добавлены",
        active: "Активный",
        switch: "Переключить",
        switch_to: "переключиться на",
        delete: "Удалить",
        confirm_delete: "удалить аккаунт?",
        account_deleted: "Аккаунт удалён",
        all_accounts_deleted: "Все аккаунты удалены",
        max_accounts: "Максимум 3 аккаунта",
        accounts_limit: "аккаунтов можно добавить",
        email_password: "Email/Пароль",
        switched_to: "аккаунт активен",

        // ========== COMMON ==========
        loading: "Загрузка...",
        error: "Ошибка",
        success: "Успешно",
        welcome: "Добро пожаловать",
        logout_success: "Выход выполнен",
        logout_confirm: "Выйти из аккаунта?",
        theme_toggle: "Сменить тему",
        profile: "Профиль",
        my_id: "Мой ID",
        settings: "Настройки",
        help: "Помощь",
        save: "Сохранить",
        cancel: "Отмена",
        yes: "Да",
        no: "Нет",
        ok: "ОК",

        // ========== NOTIFICATIONS ==========
        no_notifications: "Нет уведомлений",
        pass_code: "Код пароля",
        expires: "Истекает",
        used: "Использован",
        active_status: "Активен",
        expired: "Истёк",

        // ========== DEVICES & ACCOUNTS ==========
        connected_accounts: "Подключённые аккаунты",
        no_connected_accounts: "Нет подключённых аккаунтов",
        connected_device_not_found: "Устройства не найдены",
        current_device: "Текущее устройство",
        device_name_default: "Устройство",
        apps_not_found: "Приложения не найдены",

        // ========== MINI: CALCULATOR ==========
        calc_history_title:         "История вычислений",
        calc_clear:                  "Очистить",
        calc_history_empty:          "История пуста",
        calc_history_clear_confirm:  "Очистить историю?",
        calc_cleared:                "Очищено",

        // ========== MINI: BINGO ==========
        bingo_game_mode:      "Режим игры",
        bingo_two_players:    "2 игрока",
        bingo_bot:            "Робот",
        bingo_bot_level:      "Уровень робота",
        bingo_score:          "Счёт",
        bingo_last_games:     "Последние игры",
        bingo_bot_thinking:   "Робот думает...",
        bingo_history_empty:  "История игр пуста",
        bingo_draw_label:     "Ничья",
        bingo_turn_prefix:    "Ход: ",
        bingo_draw:           "Ничья!",
        bingo_x_wins:         "X выиграл!",
        bingo_you_win:        "Вы выиграли!",
        bingo_o_wins:         "O выиграл!",
        bingo_bot_wins:       "Робот выиграл!",
        bingo_welcome:        "Добро пожаловать, ",
        bingo_diff_0_label:   "Очень легко (0%)",
        bingo_diff_0_desc:    "Робот играет случайно",
        bingo_diff_easy_label:"Легко",
        bingo_diff_easy_desc: "Робот часто ошибается",
        bingo_diff_mid_label: "Средне",
        bingo_diff_mid_desc:  "Робот иногда ошибается",
        bingo_diff_hard_label:"Сложно",
        bingo_diff_hard_desc: "Робот редко ошибается",
        bingo_diff_vhard_label:"Очень сложно",
        bingo_diff_vhard_desc:"Робот почти безупречен",
        bingo_diff_perf_label:"Идеально (100%)",
        bingo_diff_perf_desc: "Робот никогда не проигрывает!",

        // ========== MINI: CLOCK ==========
        clock_local:          "Местное время",
        clock_internet:       "Время по интернету",
        clock_device_time:    "Время устройства",
        clock_synced:         "Время синхронизировано",
        clock_no_internet:    "Нет интернета",
        clock_no_alarms:      "Нет будильников",
        clock_alarm_deleted:  "Будильник удалён",
        clock_new_alarm:      "Новый будильник",
        clock_alarm_saved:    "Будильник сохранён",
        clock_time_label:     "Время",
        clock_name_label:     "Название (необяз.)",
        clock_active:         "Активен",
        clock_24h:            "24 часа",
        clock_12h:            "12 часов",
        clock_days:           ["Воскресенье","Понедельник","Вторник","Среда","Четверг","Пятница","Суббота"],
        clock_months:         ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],

        // ========== MINI: TIMER ==========
        timer_last:           "Последние таймеры",
        timer_clear:          "Очистить",
        timer_empty:          "История пуста",
        timer_enter_time:     "Введите время",
        timer_clear_confirm:  "Очистить историю?",
        timer_cleared:        "Очищено",
        timer_hours:          "Часы",
        timer_minutes:        "Минуты",
        timer_seconds:        "Секунды",
        timer_ready:          "Готов",
        timer_running:        "Идёт",
        timer_paused:         "Пауза",
        timer_done:           "Готово!",

        // ========== MINI: STOPWATCH ==========
        sw_start:             "Старт",
        sw_pause:             "Пауза",
        sw_laps_empty:        "Нет кругов",
        sw_history_empty:     "История пуста",
        sw_clear_confirm:     "Очистить историю?",
        sw_cleared:           "Очищено",

        // ========== MINI: MUSIC ==========
        music_empty:          "Пока нет музыки",
        music_login_load:     "Войдите для загрузки музыки",
        music_deleted:        "Удалено",
        music_delete_error:   "Ошибка удаления",
        music_load_error:     "Ошибка загрузки",
        music_mic_required:   "Нужен доступ к микрофону!",
        music_login_save:     "Сначала войдите в аккаунт",
        music_record_first:   "Сначала запишите или загрузите аудио",
        music_saved:          "Музыка сохранена!",
        music_tab_list:       "Музыка",
        music_tab_add:        "Добавить",
        music_page_title:     "Музыка",
        music_add_title:      "Добавить аудио",
        music_upload_btn:     "Или загрузить файл",
        music_delete_confirm: " удалить?",

        // ========== MINI: BOARD ==========
        board_saved_cloud:    "Сохранено в облако! ☁️",
        board_saved_local_only:"Сохранено только локально",
        board_saved_local:    "Сохранено локально",
        board_clear_confirm:  "Очистить доску?",

        // ========== MINI: SPLITVIEW ==========
        split_add_video:      "Добавить видео",
        split_saved_urls:     "Сохранённые URL",
        split_enter_url:      "Введите URL",
        split_cancel:         "Отмена",
        split_load:           "Загрузить",
        split_url_saved:      "URL сохранён",
        split_muted:          "Звуки выключены",
        split_clear_confirm:  "Очистить все видео?",
        split_cleared:        "Очищено",
        split_no_saved:       "Нет сохранённых URL",
        split_deleted:        "Удалено",
        split_load_first:     "Сначала загрузите видео",
        split_login_required: "Войдите в аккаунт",
        split_all_saved:      "Все URL сохранены!",
        split_error:          "Ошибка"
    },

    en: {
        // ========== HEADER & MENU ==========
        back: "Home",
        settings_title: "Settings",
        all_apps: "All apps",
        popular_apps: "Popular apps",
        mini_apps: "Mini apps",
        search_placeholder: "Search apps...",
        menu: "Menu",
        close: "X",
        version: "MRDEV made with love",
        user_role: "User",
        app_title: "MRDEV",

        // ========== AUTH & LOGIN ==========
        login: "Login",
        register: "Register",
        logout: "Logout",
        email: "Email",
        password: "Password",
        name: "Full name",
        or: "or",
        google_login: "Sign in with Google",
        mrdev_login: "Sign in with MRDEV ID",
        guest: "Guest",
        login_required: "Please login",
        no_account: "Don't have an account?",
        have_account: "Already have an account?",
        email_required: "Enter username or email",
        password_required: "Enter password",
        name_required: "Enter name (at least 2 characters)",
        password_length: "Password must be at least 6 characters",
        account_created: "Account created",
        username_placeholder: "username (will be username@mrdev.uz)",
        email_placeholder: "username@mrdev.uz",
        password_placeholder: "••••••••",
        password_placeholder_new: "New password (min 6 chars)",
        name_placeholder: "Sardor Karimov",

        // ========== MRDEV ID ==========
        mrdev_id: "Enter MRDEV ID",
        mrdev_id_placeholder: "# _ _ _ _ _ _",
        mrdev_id_desc: "7-digit code starting with #",
        mrdev_what_desc_small: "6-digit number starting with #. Required for login and using apps.",
        enter_code: "Enter code",
        code_sent: "6-digit code sent to account owner",
        code_sent_desc: "Code sent to \"Password notifications\" section",
        resend_code: "Didn't receive code?",
        verify: "Verify",
        mrdev_what: "What is MRDEV ID?",
        mrdev_what_desc: "MRDEV ID — your personal number",
        more_info: "Learn more",
        pass_notifications: "Password notifications",

        // ========== SETTINGS ==========
        dark_mode: "Dark mode",
        dark_mode_desc: "Change interface colors",
        notifications: "Notifications",
        notifications_desc: "Password notifications and news",
        notifications_disabled: "Notifications disabled",
        language: "Language",
        language_desc: "Select platform language",
        cache: "Cache & storage",
        cache_desc: "temporary data",
        account: "Account",
        account_desc: "Logout or about project",
        about: "About",
        clear: "Clear",
        cleared: "Cache cleared",
        reload: "Reload",

        // ========== ACCOUNT SWITCHER ==========
        accounts: "Accounts",
        add_account: "Add account",
        no_accounts: "No accounts added",
        active: "Active",
        switch: "Switch",
        switch_to: "switch to",
        delete: "Delete",
        confirm_delete: "delete account?",
        account_deleted: "Account deleted",
        all_accounts_deleted: "All accounts deleted",
        max_accounts: "Maximum 3 accounts",
        accounts_limit: "accounts can be added",
        email_password: "Email/Password",
        switched_to: "account activated",

        // ========== COMMON ==========
        loading: "Loading...",
        error: "Error",
        success: "Success",
        welcome: "Welcome",
        logout_success: "Logged out",
        logout_confirm: "Logout from account?",
        theme_toggle: "Toggle theme",
        profile: "Profile",
        my_id: "My ID",
        settings: "Settings",
        help: "Help",
        save: "Save",
        cancel: "Cancel",
        yes: "Yes",
        no: "No",
        ok: "OK",

        // ========== NOTIFICATIONS ==========
        no_notifications: "No notifications",
        pass_code: "Password code",
        expires: "Expires",
        used: "Used",
        active_status: "Active",
        expired: "Expired",

        // ========== DEVICES & ACCOUNTS ==========
        connected_accounts: "Connected accounts",
        no_connected_accounts: "No connected accounts",
        connected_device_not_found: "No connected devices found",
        current_device: "Current device",
        device_name_default: "Device",
        apps_not_found: "Apps not found",

        // ========== MINI: CALCULATOR ==========
        calc_history_title:         "Calculation history",
        calc_clear:                  "Clear",
        calc_history_empty:          "History is empty",
        calc_history_clear_confirm:  "Clear history?",
        calc_cleared:                "Cleared",

        // ========== MINI: BINGO ==========
        bingo_game_mode:      "Game mode",
        bingo_two_players:    "2 players",
        bingo_bot:            "Bot",
        bingo_bot_level:      "Bot difficulty",
        bingo_score:          "Score",
        bingo_last_games:     "Recent games",
        bingo_bot_thinking:   "Bot thinking...",
        bingo_history_empty:  "No game history yet",
        bingo_draw_label:     "Draw",
        bingo_turn_prefix:    "Turn: ",
        bingo_draw:           "Draw!",
        bingo_x_wins:         "X wins!",
        bingo_you_win:        "You win!",
        bingo_o_wins:         "O wins!",
        bingo_bot_wins:       "Bot wins!",
        bingo_welcome:        "Welcome, ",
        bingo_diff_0_label:   "Very easy (0%)",
        bingo_diff_0_desc:    "Bot plays randomly",
        bingo_diff_easy_label:"Easy",
        bingo_diff_easy_desc: "Bot makes many mistakes",
        bingo_diff_mid_label: "Medium",
        bingo_diff_mid_desc:  "Bot makes some mistakes",
        bingo_diff_hard_label:"Hard",
        bingo_diff_hard_desc: "Bot rarely makes mistakes",
        bingo_diff_vhard_label:"Very hard",
        bingo_diff_vhard_desc:"Bot plays almost perfectly",
        bingo_diff_perf_label:"Perfect (100%)",
        bingo_diff_perf_desc: "Bot never loses!",

        // ========== MINI: CLOCK ==========
        clock_local:          "Local time",
        clock_internet:       "Internet time",
        clock_device_time:    "Device time",
        clock_synced:         "Time synced",
        clock_no_internet:    "No internet",
        clock_no_alarms:      "No alarms",
        clock_alarm_deleted:  "Alarm deleted",
        clock_new_alarm:      "New alarm",
        clock_alarm_saved:    "Alarm saved",
        clock_time_label:     "Time",
        clock_name_label:     "Name (optional)",
        clock_active:         "Active",
        clock_24h:            "24h",
        clock_12h:            "12h",
        clock_days:           ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
        clock_months:         ["January","February","March","April","May","June","July","August","September","October","November","December"],

        // ========== MINI: TIMER ==========
        timer_last:           "Recent timers",
        timer_clear:          "Clear",
        timer_empty:          "History is empty",
        timer_enter_time:     "Enter time",
        timer_clear_confirm:  "Clear history?",
        timer_cleared:        "Cleared",
        timer_hours:          "Hours",
        timer_minutes:        "Minutes",
        timer_seconds:        "Seconds",
        timer_ready:          "Ready",
        timer_running:        "Running",
        timer_paused:         "Paused",
        timer_done:           "Done!",

        // ========== MINI: STOPWATCH ==========
        sw_start:             "Start",
        sw_pause:             "Pause",
        sw_laps_empty:        "No laps yet",
        sw_history_empty:     "History is empty",
        sw_clear_confirm:     "Clear history?",
        sw_cleared:           "Cleared",

        // ========== MINI: MUSIC ==========
        music_empty:          "No music yet",
        music_login_load:     "Log in to load music",
        music_deleted:        "Deleted",
        music_delete_error:   "Delete error",
        music_load_error:     "Load error",
        music_mic_required:   "Microphone access needed!",
        music_login_save:     "Log in first",
        music_record_first:   "Record or upload audio first",
        music_saved:          "Music saved!",
        music_tab_list:       "Music",
        music_tab_add:        "Add",
        music_page_title:     "Music",
        music_add_title:      "Add audio",
        music_upload_btn:     "Or upload file",
        music_delete_confirm: " delete?",

        // ========== MINI: BOARD ==========
        board_saved_cloud:    "Saved to cloud! ☁️",
        board_saved_local_only:"Saved locally only",
        board_saved_local:    "Saved locally",
        board_clear_confirm:  "Clear board?",

        // ========== MINI: SPLITVIEW ==========
        split_add_video:      "Add video",
        split_saved_urls:     "Saved URLs",
        split_enter_url:      "Enter URL",
        split_cancel:         "Cancel",
        split_load:           "Load",
        split_url_saved:      "URL saved",
        split_muted:          "Muted",
        split_clear_confirm:  "Clear all videos?",
        split_cleared:        "Cleared",
        split_no_saved:       "No saved URLs",
        split_deleted:        "Deleted",
        split_load_first:     "Load a video first",
        split_login_required: "Log in",
        split_all_saved:      "All URLs saved!",
        split_error:          "Error"
    }
};

let currentLang = localStorage.getItem('mrdev_lang') || 'uz';

export function t(key) {
    return translations[currentLang]?.[key] || key;
}

export function setLanguage(lang) {
    if (translations[lang]) {
        currentLang = lang;
        localStorage.setItem('mrdev_lang', lang);
        document.documentElement.lang = lang;
        // Event dispatch - boshqa modullar ham tinglasin
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
        return true;
    }
    return false;
}

export function getCurrentLang() {
    return currentLang;
}

export function getAvailableLangs() {
    return ['uz', 'ru', 'en'];
}

export function getLangName(lang) {
    const names = { uz: "O'zbekcha", ru: "Русский", en: "English" };
    return names[lang] || lang;
}

/**
 * Sahifadagi barcha [data-i18n] elementlarini joriy tilda yangilaydi.
 * initI18n() - boshlang'ich yuklashda ham, til o'zgarganda ham chaqirilishi mumkin.
 */
export function initI18n() {
    const savedLang = localStorage.getItem('mrdev_lang');
    if (savedLang && translations[savedLang]) {
        currentLang = savedLang;
    }
    document.documentElement.lang = currentLang;
    applyTranslations();
}

/**
 * DOM'dagi barcha tarjima elementlarini yangilash.
 * Bu funksiya ichki - tashqaridan initI18n() orqali chaqiriladi.
 */
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (!key) return;
        if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
            el.placeholder = t(key);
        } else if (el.tagName === 'IMG') {
            el.alt = t(key);
        } else {
            el.textContent = t(key);
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key) el.placeholder = t(key);
    });
}

// Til o'zgarganda DOM'ni avtomatik yangilash
document.addEventListener('languageChanged', () => {
    applyTranslations();
});

// Global kirish (module bo'lmagan sahifalar uchun)
window.mrdevI18n = { t, setLanguage, getCurrentLang, initI18n };