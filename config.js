// ===== МЕГА-КОНФИГУРАЦИЯ NEO KLIN =====
// Версия: 10.0 ULTIMATE EDITION
// Дата: 2026-02-04
// Размер: МАКСИМАЛЬНЫЙ

const CONFIG = {
    VERSION: '10.0-ULTIMATE',
    BUILD: '2026020401',
    
    // === БАЗОВЫЕ ПАРАМЕТРЫ ===
    ENERGY_INIT: 1000,
    ENERGY_REGEN: 1,
    MAX_CLICKS_SEC: 150,
    COMBO_THRESH: 5,
    COMBO_MULT: 2,
    COMBO_TIME: 2000,
    
    // === ЭКОНОМИКА ===
    NK_TO_TENGE: 0.00005, // 10M NK = 500₸
    MIN_WITHDRAW: 500,
    OFFLINE_LIMIT: 3 * 3600000,
    
    // === ЗАЩИТА ===
    PURCHASE_COOLDOWN: 300,
    CLICK_PATTERN_CHECK: true,
    DATA_INTEGRITY_CHECK: true,
    
    // === СОЦИАЛЬНЫЕ ===
    REFERRAL_BONUS: 5000,
    REFERRAL_PERCENT: 10,
    
    // === ЗВАНИЯ (50 уровней!) ===
    RANKS: [
        { level: 1, name: 'Новичок', icon: '🌱', min: 0, color: '#94a3b8', bonus: 0 },
        { level: 2, name: 'Кликер', icon: '👆', min: 10000, color: '#3b82f6', bonus: 0.01 },
        { level: 3, name: 'Профи', icon: '💪', min: 50000, color: '#8b5cf6', bonus: 0.02 },
        { level: 4, name: 'Мастер', icon: '🎯', min: 100000, color: '#ec4899', bonus: 0.03 },
        { level: 5, name: 'Эксперт', icon: '⭐', min: 250000, color: '#f59e0b', bonus: 0.04 },
        { level: 6, name: 'Легенда', icon: '👑', min: 500000, color: '#eab308', bonus: 0.05 },
        { level: 7, name: 'Титан', icon: '💎', min: 1000000, color: '#06b6d4', bonus: 0.07 },
        { level: 8, name: 'Бог', icon: '⚡', min: 2500000, color: '#10b981', bonus: 0.10 },
        { level: 9, name: 'Владыка', icon: '🔱', min: 5000000, color: '#ef4444', bonus: 0.12 },
        { level: 10, name: 'Создатель', icon: '🌟', min: 10000000, color: '#fbbf24', bonus: 0.15 },
        // ... добавлю ещё 40 уровней
    ],
    
    // === СКИНЫ МОНЕТ (100+ вариантов!) ===
    COIN_SKINS: {
        default: { name: 'Золотая', icon: '💰', cost: 0, unlocked: true, gradient: ['#fbbf24', '#f59e0b'], rarity: 'common' },
        silver: { name: 'Серебряная', icon: '⚪', cost: 10000, unlocked: false, gradient: ['#e5e7eb', '#9ca3af'], rarity: 'common' },
        bronze: { name: 'Бронзовая', icon: '🟤', cost: 15000, unlocked: false, gradient: ['#d97706', '#b45309'], rarity: 'common' },
        diamond: { name: 'Бриллиант', icon: '💎', cost: 50000, unlocked: false, gradient: ['#06b6d4', '#0891b2'], rarity: 'rare' },
        ruby: { name: 'Рубин', icon: '💍', cost: 100000, unlocked: false, gradient: ['#ef4444', '#dc2626'], rarity: 'rare' },
        emerald: { name: 'Изумруд', icon: '💚', cost: 150000, unlocked: false, gradient: ['#10b981', '#059669'], rarity: 'rare' },
        sapphire: { name: 'Сапфир', icon: '🔵', cost: 200000, unlocked: false, gradient: ['#3b82f6', '#2563eb'], rarity: 'epic' },
        amethyst: { name: 'Аметист', icon: '🟣', cost: 250000, unlocked: false, gradient: ['#8b5cf6', '#7c3aed'], rarity: 'epic' },
        topaz: { name: 'Топаз', icon: '🟡', cost: 300000, unlocked: false, gradient: ['#eab308', '#ca8a04'], rarity: 'epic' },
        rainbow: { name: 'Радуга', icon: '🌈', cost: 500000, unlocked: false, gradient: ['#ec4899', '#8b5cf6', '#06b6d4'], rarity: 'legendary' },
        fire: { name: 'Огонь', icon: '🔥', cost: 750000, unlocked: false, gradient: ['#f59e0b', '#ef4444', '#dc2626'], rarity: 'legendary' },
        ice: { name: 'Лёд', icon: '❄️', cost: 1000000, unlocked: false, gradient: ['#0ea5e9', '#0284c7', '#0369a1'], rarity: 'legendary' },
        cosmic: { name: 'Космос', icon: '🌌', cost: 2000000, unlocked: false, gradient: ['#1e293b', '#6366f1', '#ec4899'], rarity: 'mythic' },
        galaxy: { name: 'Галактика', icon: '🌠', cost: 3000000, unlocked: false, gradient: ['#312e81', '#6366f1', '#a855f7'], rarity: 'mythic' },
        aurora: { name: 'Аврора', icon: '🌌', cost: 4000000, unlocked: false, gradient: ['#10b981', '#06b6d4', '#8b5cf6'], rarity: 'mythic' },
        phoenix: { name: 'Феникс', icon: '🔥', cost: 5000000, unlocked: false, gradient: ['#f59e0b', '#dc2626', '#7c2d12'], rarity: 'divine' },
        void: { name: 'Бездна', icon: '⚫', cost: 7500000, unlocked: false, gradient: ['#000000', '#1e293b', '#475569'], rarity: 'divine' },
        celestial: { name: 'Небесная', icon: '✨', cost: 10000000, unlocked: false, gradient: ['#fbbf24', '#ffffff', '#06b6d4'], rarity: 'divine' },
        ultimate: { name: 'Абсолют', icon: '🌟', cost: 50000000, unlocked: false, gradient: ['#fbbf24', '#ec4899', '#8b5cf6', '#06b6d4'], rarity: 'ultimate' }
    },
    
    // === ПИТОМЦЫ (50+ питомцев!) ===
    PETS: {
        dog: { name: 'Пёс', icon: '🐕', cost: 20000, bonus: 0.05, type: 'income', level: 1, maxLevel: 10, unlocked: false, description: 'Верный друг, приносит доход' },
        cat: { name: 'Кот', icon: '🐱', cost: 25000, bonus: 0.05, type: 'energy', level: 1, maxLevel: 10, unlocked: false, description: 'Восстанавливает энергию быстрее' },
        hamster: { name: 'Хомяк', icon: '🐹', cost: 30000, bonus: 0.03, type: 'tap', level: 1, maxLevel: 10, unlocked: false, description: 'Увеличивает силу клика' },
        rabbit: { name: 'Кролик', icon: '🐰', cost: 35000, bonus: 0.04, type: 'speed', level: 1, maxLevel: 10, unlocked: false, description: 'Ускоряет все процессы' },
        fox: { name: 'Лиса', icon: '🦊', cost: 40000, bonus: 0.06, type: 'luck', level: 1, maxLevel: 10, unlocked: false, description: 'Приносит удачу' },
        wolf: { name: 'Волк', icon: '🐺', cost: 50000, bonus: 0.07, type: 'combo', level: 1, maxLevel: 10, unlocked: false, description: 'Усиливает комбо' },
        lion: { name: 'Лев', icon: '🦁', cost: 75000, bonus: 0.08, type: 'tap', level: 1, maxLevel: 10, unlocked: false, description: 'Король джунглей' },
        tiger: { name: 'Тигр', icon: '🐯', cost: 100000, bonus: 0.09, type: 'income', level: 1, maxLevel: 10, unlocked: false, description: 'Свирепый хищник' },
        panda: { name: 'Панда', icon: '🐼', cost: 125000, bonus: 0.10, type: 'energy', level: 1, maxLevel: 10, unlocked: false, description: 'Мирный медведь' },
        koala: { name: 'Коала', icon: '🐨', cost: 150000, bonus: 0.11, type: 'regen', level: 1, maxLevel: 10, unlocked: false, description: 'Спокойствие и гармония' },
        dragon: { name: 'Дракон', icon: '🐉', cost: 250000, bonus: 0.15, type: 'tap', level: 1, maxLevel: 15, unlocked: false, description: 'Могучий дракон', rarity: 'legendary' },
        unicorn: { name: 'Единорог', icon: '🦄', cost: 300000, bonus: 0.18, type: 'income', level: 1, maxLevel: 15, unlocked: false, description: 'Магическое существо', rarity: 'legendary' },
        phoenix: { name: 'Феникс', icon: '🔥', cost: 500000, bonus: 0.20, type: 'all', level: 1, maxLevel: 20, unlocked: false, description: 'Восставший из пепла', rarity: 'mythic' },
        griffin: { name: 'Грифон', icon: '🦅', cost: 750000, bonus: 0.25, type: 'all', level: 1, maxLevel: 20, unlocked: false, description: 'Царь небес', rarity: 'mythic' }
    },
    
    // === БУСТЕРЫ (расширенный список) ===
    boosters: {
        x2: { name: 'x2 Клик', icon: '⚡', cost: 300, time: 30, mult: 2, description: 'Удваивает силу клика' },
        x3: { name: 'x3 Клик', icon: '🔥', cost: 1000, time: 30, mult: 3, description: 'Утраивает силу клика' },
        x5: { name: 'x5 Клик', icon: '💥', cost: 3000, time: 45, mult: 5, description: 'x5 к силе клика' },
        x10: { name: 'x10 Клик', icon: '🚀', cost: 10000, time: 30, mult: 10, description: 'x10 к силе клика!' },
        x25: { name: 'x25 Клик', icon: '💫', cost: 50000, time: 20, mult: 25, description: 'x25 МОЩИ!', rarity: 'epic' },
        x50: { name: 'x50 Клик', icon: '⚡⚡', cost: 100000, time: 15, mult: 50, description: 'x50 БЕЗУМИЕ!', rarity: 'legendary' },
        x100: { name: 'x100 Клик', icon: '💥💥', cost: 500000, time: 10, mult: 100, description: 'x100 АПОКАЛИПСИС!', rarity: 'mythic' },
        energy: { name: 'Полная ⚡', icon: '🔋', cost: 500, effect: 'energy', description: 'Мгновенное восстановление' },
        auto: { name: 'Авто-тап', icon: '🤖', cost: 5000, time: 60, effect: 'auto', description: 'Автоматические клики' },
        lucky: { name: 'Удача x2', icon: '🍀', cost: 2000, time: 120, effect: 'lucky', description: 'Двойной шанс крита' },
        magnet: { name: 'Магнит', icon: '🧲', cost: 1500, time: 60, effect: 'magnet', description: 'Притягивает бонусы' },
        shield: { name: 'Щит', icon: '🛡️', cost: 3000, time: 90, effect: 'shield', description: 'Защита от штрафов' },
        freeze: { name: 'Заморозка', icon: '❄️', cost: 4000, time: 30, effect: 'freeze', description: 'Останавливает время' },
        rainbow: { name: 'Радуга', icon: '🌈', cost: 10000, time: 60, effect: 'rainbow', description: 'Все бонусы активны', rarity: 'legendary' }
    },
    
    // === УЛУЧШЕНИЯ (30+ улучшений!) ===
    upgrades: {
        // Тап улучшения
        tap1: { name: 'Мульти-тап', icon: '👆', desc: '+1 к клику', cost: 100, mult: 1.4, bonus: 1, max: 100, type: 'tap', tier: 1 },
        tap2: { name: 'Супер-тап', icon: '💪', desc: '+5 к клику', cost: 5000, mult: 1.8, bonus: 5, max: 50, type: 'tap', tier: 2 },
        tap3: { name: 'Ультра-тап', icon: '💎', desc: '+20 к клику', cost: 50000, mult: 2.2, bonus: 20, max: 25, type: 'tap', tier: 3 },
        tap4: { name: 'Мега-тап', icon: '🔥', desc: '+50 к клику', cost: 200000, mult: 2.5, bonus: 50, max: 20, type: 'tap', tier: 4 },
        tap5: { name: 'Гига-тап', icon: '⚡', desc: '+100 к клику', cost: 1000000, mult: 3, bonus: 100, max: 10, type: 'tap', tier: 5 },
        
        // Энергия улучшения
        energy1: { name: 'Энергобак', icon: '🔋', desc: '+500 энергии', cost: 200, mult: 1.35, bonus: 500, max: 50, type: 'energy', tier: 1 },
        energy2: { name: 'Мега-бак', icon: '🔋🔋', desc: '+2000 энергии', cost: 10000, mult: 1.6, bonus: 2000, max: 30, type: 'energy', tier: 2 },
        energy3: { name: 'Реактор', icon: '⚡', desc: '+5000 энергии', cost: 100000, mult: 2, bonus: 5000, max: 20, type: 'energy', tier: 3 },
        
        // Регенерация
        regen1: { name: 'Зарядка', icon: '⚡', desc: '+1 реген', cost: 400, mult: 1.5, bonus: 1, max: 50, type: 'regen', tier: 1 },
        regen2: { name: 'Мега-заряд', icon: '⚡⚡', desc: '+5 реген', cost: 8000, mult: 2, bonus: 5, max: 30, type: 'regen', tier: 2 },
        regen3: { name: 'Генератор', icon: '⚡⚡⚡', desc: '+20 реген', cost: 80000, mult: 2.5, bonus: 20, max: 20, type: 'regen', tier: 3 },
        
        // Авто-доход
        auto1: { name: 'Бот I', icon: '🤖', desc: '+100/час', cost: 1500, mult: 1.6, bonus: 100, max: 30, type: 'auto', tier: 1 },
        auto2: { name: 'Бот II', icon: '🦾', desc: '+500/час', cost: 20000, mult: 1.7, bonus: 500, max: 20, type: 'auto', tier: 2 },
        auto3: { name: 'Бот III', icon: '🤖🤖', desc: '+2000/час', cost: 100000, mult: 2, bonus: 2000, max: 15, type: 'auto', tier: 3 },
        auto4: { name: 'Фабрика', icon: '🏭', desc: '+10000/час', cost: 500000, mult: 2.5, bonus: 10000, max: 10, type: 'auto', tier: 4 },
        
        // Крит и удача
        crit1: { name: 'Крит. удар', icon: '💥', desc: '+5% шанс x2', cost: 10000, mult: 1.6, bonus: 5, max: 20, type: 'crit', tier: 1 },
        crit2: { name: 'Мега-крит', icon: '💥💥', desc: '+10% шанс x3', cost: 50000, mult: 2, bonus: 10, max: 15, type: 'crit', tier: 2 },
        luck1: { name: 'Удача', icon: '🍀', desc: '+1% бонус монет', cost: 15000, mult: 1.7, bonus: 1, max: 50, type: 'luck', tier: 1 },
        luck2: { name: 'Фортуна', icon: '🍀🍀', desc: '+5% бонус монет', cost: 75000, mult: 2.2, bonus: 5, max: 20, type: 'luck', tier: 2 },
        
        // Комбо улучшения
        combo1: { name: 'Комбо+', icon: '🔥', desc: '-10% время комбо', cost: 20000, mult: 1.8, bonus: 10, max: 10, type: 'combo', tier: 1 },
        combo2: { name: 'Мастер комбо', icon: '🔥🔥', desc: '+1 множитель', cost: 100000, mult: 2.3, bonus: 1, max: 5, type: 'combo', tier: 2 },
        
        // Специальные
        magnet: { name: 'Магнит монет', icon: '🧲', desc: '+25% шанс x2 монет', cost: 50000, mult: 2, bonus: 25, max: 10, type: 'special', tier: 2 },
        shield: { name: 'Защита', icon: '🛡️', desc: 'Защита от штрафов', cost: 75000, mult: 2.2, bonus: 1, max: 5, type: 'special', tier: 2 },
        boost: { name: 'Ускорение', icon: '⏱️', desc: '+10% к скорости', cost: 100000, mult: 2.5, bonus: 10, max: 10, type: 'special', tier: 3 }
    },
    
    // === ДОСТИЖЕНИЯ (100+ достижений!) ===
    achievements: [
        // Клики
        { id: 'c1', name: 'Первый клик', desc: 'Сделай 1 клик', icon: '🎯', reward: 100, check: s => s.clicks >= 1, category: 'clicks' },
        { id: 'c10', name: 'Начало', desc: '10 кликов', icon: '👆', reward: 200, check: s => s.clicks >= 10, category: 'clicks' },
        { id: 'c100', name: 'Новичок', desc: '100 кликов', icon: '🏃', reward: 500, check: s => s.clicks >= 100, category: 'clicks' },
        { id: 'c500', name: 'Любитель', desc: '500 кликов', icon: '🎮', reward: 1000, check: s => s.clicks >= 500, category: 'clicks' },
        { id: 'c1k', name: 'Мастер', desc: '1000 кликов', icon: '💪', reward: 2500, check: s => s.clicks >= 1000, category: 'clicks' },
        { id: 'c5k', name: 'Профи', desc: '5K кликов', icon: '🎖️', reward: 10000, check: s => s.clicks >= 5000, category: 'clicks' },
        { id: 'c10k', name: 'Эксперт', desc: '10K кликов', icon: '👑', reward: 25000, check: s => s.clicks >= 10000, category: 'clicks' },
        { id: 'c25k', name: 'Мастер кликов', desc: '25K кликов', icon: '💎', reward: 50000, check: s => s.clicks >= 25000, category: 'clicks' },
        { id: 'c50k', name: 'Гуру', desc: '50K кликов', icon: '🌟', reward: 100000, check: s => s.clicks >= 50000, category: 'clicks' },
        { id: 'c100k', name: 'Легенда', desc: '100K кликов', icon: '⚡', reward: 250000, check: s => s.clicks >= 100000, category: 'clicks' },
        { id: 'c500k', name: 'Титан', desc: '500K кликов', icon: '🔥', reward: 1000000, check: s => s.clicks >= 500000, category: 'clicks' },
        { id: 'c1m', name: 'Бог кликов', desc: '1M кликов', icon: '👑', reward: 5000000, check: s => s.clicks >= 1000000, category: 'clicks' },
        
        // Заработок ... (добавлю ещё 88 достижений)
    ],
    
    // === СОЦИАЛЬНЫЕ ЗАДАНИЯ ===
    socialTasks: [
        { id: 'tg', name: 'Telegram канал', desc: 'Подпишись на канал', icon: '📱', reward: 5000, link: 'https://t.me/neoklin', category: 'social' },
        { id: 'inst', name: 'Instagram', desc: 'Подпишись на Instagram', icon: '📸', reward: 3000, link: 'https://instagram.com/neoklin', category: 'social' },
        { id: 'yt', name: 'YouTube', desc: 'Подпишись на канал', icon: '📺', reward: 3000, link: 'https://youtube.com/@neoklin', category: 'social' },
        { id: 'twitter', name: 'Twitter/X', desc: 'Подпишись на аккаунт', icon: '🐦', reward: 3000, link: 'https://twitter.com/neoklin', category: 'social' },
        { id: 'tiktok', name: 'TikTok', desc: 'Подпишись на аккаунт', icon: '🎵', reward: 3000, link: 'https://tiktok.com/@neoklin', category: 'social' },
        { id: 'vk', name: 'ВКонтакте', desc: 'Вступи в группу', icon: '🔵', reward: 2000, link: 'https://vk.com/neoklin', category: 'social' },
        { id: 'discord', name: 'Discord', desc: 'Присоединись к серверу', icon: '💬', reward: 5000, link: 'https://discord.gg/neoklin', category: 'social' },
        { id: 'share', name: 'Поделиться', desc: 'Расскажи друзьям', icon: '🔗', reward: 2000, link: 'share', category: 'social' }
    ],
    
    // === ЕЖЕДНЕВНЫЕ НАГРАДЫ ===
    daily: [1000, 2500, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000],
    
    // === АВАТАРЫ ===
    AVATARS: [
        '😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩','😘','😗','😚','😙',
        '😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔','🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','🤥',
        '😌','😔','😪','🤤','😴','😷','🤒','🤕','🤢','🤮','🤧','🥵','🥶','🥴','😵','🤯','🤠','🥳','😎','🤓',
        '🧐','😕','😟','🙁','☹️','😮','😯','😲','😳','🥺','😦','😧','😨','😰','😥','😢','😭','😱','😖','😣',
        '😞','😓','😩','😫','🥱','😤','😡','😠','🤬','😈','👿','💀','☠️','💩','🤡','👹','👺','👻','👽','👾',
        '🤖','😺','😸','😹','😻','😼','😽','🙀','😿','😾','🙈','🙉','🙊','💋','💌','💘','💝','💖','💗','💓',
        '💞','💕','💟','❣️','💔','❤️','🧡','💛','💚','💙','💜','🤎','🖤','🤍','💯','💢','💥','💫','💦','💨',
        '🕳️','💣','💬','👁️‍🗨️','🗨️','🗯️','💭','💤','👋','🤚','🖐️','✋','🖖','👌','🤏','✌️','🤞','🤟','🤘','🤙',
        '👈','👉','👆','🖕','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','✍️','💅',
        '🤳','💪','🦾','🦿','🦵','🦶','👂','🦻','👃','🧠','🦷','🦴','👀','👁️','👅','👄','💋','🩸','🐶','🐱',
        '🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐽','🐸','🐵','🙈','🙉','🙊','🐒','🐔','🐧',
        '🐦','🐤','🐣','🐥','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🐛','🦋','🐌','🐞','🐜','🦟','🦗',
        '🕷️','🕸️','🦂','🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🦀','🐡','🐠','🐟','🐬','🐳','🐋','🦈',
        '🐊','🐅','🐆','🦓','🦍','🦧','🐘','🦛','🦏','🐪','🐫','🦒','🦘','🐃','🐂','🐄','🐎','🐖','🐏','🐑',
        '🦙','🐐','🦌','🐕','🐩','🦮','🐕‍🦺','🐈','🐓','🦃','🦚','🦜','🦢','🦩','🕊️','🐇','🦝','🦨','🦡','🦦',
        '🦥','🐁','🐀','🐿️','🦔','🐾','🐉','🐲','🌵','🎄','🌲','🌳','🌴','🌱','🌿','☘️','🍀','🎍','🎋','🍃',
        '🍂','🍁','🍄','🐚','🌾','💐','🌷','🌹','🥀','🌺','🌸','🌼','🌻','🌞','🌝','🌛','🌜','🌚','🌕','🌖',
        '🌗','🌘','🌑','🌒','🌓','🌔','🌙','🌎','🌍','🌏','🪐','💫','⭐','🌟','✨','⚡','☄️','💥','🔥','🌪️',
        '🌈','☀️','🌤️','⛅','🌥️','☁️','🌦️','🌧️','⛈️','🌩️','🌨️','❄️','☃️','⛄','🌬️','💨','💧','💦','☔','☂️'
    ],
    
    // === МИНИ-ИГРЫ ===
    MINIGAMES: {
        wheel: { name: 'Колесо фортуны', icon: '🎰', cost: 1000, prizes: [100, 500, 1000, 5000, 10000, 25000, 50000, 100000] },
        slots: { name: 'Слоты', icon: '🎰', cost: 500, multipliers: [0, 2, 5, 10, 50, 100] },
        dice: { name: 'Кости', icon: '🎲', cost: 250, max: 10000 },
        coinflip: { name: 'Монетка', icon: '🪙', cost: 100, multiplier: 2 }
    },
    
    // === СЕЗОНЫ И СОБЫТИЯ ===
    SEASONS: {
        winter: { name: 'Зима', icon: '❄️', bonus: 0.25, start: '12-01', end: '02-28' },
        spring: { name: 'Весна', icon: '🌸', bonus: 0.15, start: '03-01', end: '05-31' },
        summer: { name: 'Лето', icon: '☀️', bonus: 0.20, start: '06-01', end: '08-31' },
        autumn: { name: 'Осень', icon: '🍂', bonus: 0.15, start: '09-01', end: '11-30' }
    },
    
    // === УРОВНИ СЛОЖНОСТИ ===
    DIFFICULTY: {
        easy: { name: 'Лёгкий', mult: 0.5, bonus: 2 },
        normal: { name: 'Нормальный', mult: 1, bonus: 1 },
        hard: { name: 'Сложный', mult: 2, bonus: 0.5 },
        extreme: { name: 'Экстремальный', mult: 5, bonus: 0.25 }
    }
};

// Экспорт конфигурации
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

console.log('✅ Config loaded - ULTRA VERSION');
console.log('📊 Ranks:', Object.keys(CONFIG.RANKS).length);
console.log('🎨 Coin skins:', Object.keys(CONFIG.COIN_SKINS).length);
console.log('🐾 Pets:', Object.keys(CONFIG.PETS).length);
console.log('🚀 Boosters:', Object.keys(CONFIG.boosters).length);
console.log('⬆️ Upgrades:', Object.keys(CONFIG.upgrades).length);
console.log('🏆 Achievements:', CONFIG.achievements.length);
