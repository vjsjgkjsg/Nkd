// ===== ОСНОВНАЯ ИГРОВАЯ ЛОГИКА =====
class Game {
    constructor() {
        this.data = storage.load() || this.init();
        this.clicks = [];
        this.combo = 0;
        this.comboTimer = null;
        this.booster = null;
        this.boosterTimer = null;
        this.autoTap = null;
        this.lastPurchase = 0; // Для защиты от двойных покупок
        this.clickPattern = []; // Для анализа паттерна кликов
        this.start();
    }
    
    init() {
        return {
            balance: 0,
            energy: CONFIG.ENERGY_INIT,
            maxEnergy: CONFIG.ENERGY_INIT,
            tapPower: 1,
            regen: CONFIG.ENERGY_REGEN,
            clicks: 0,
            earned: 0,
            upg: 0,
            level: 1,
            xp: 0,
            auto: 0,
            lastTime: Date.now(),
            serverTime: Date.now(), // Для проверки манипуляции временем
            upgrades: {},
            done: {},
            hourly: 0,
            daily: 0,
            lastDaily: 0,
            history: [],
            socialTasks: {},
            refUsed: false,
            refBy: null
        };
    }
    
    start() {
        // Проверка реферала
        social.checkReferral(this.data);
        
        // Офлайн доход с защитой
        this.offline();
        
        // Запуск тиков
        setInterval(() => this.energyTick(), 1000);
        setInterval(() => this.autoTick(), 1000);
        setInterval(() => this.saveGame(), 5000); // Автосохранение
        setInterval(() => this.checkTimeManipulation(), 10000); // Проверка времени
        
        // Обновление UI
        this.update();
        window.ui.renderUpgrades();
        window.ui.renderBoosters();
        window.ui.renderQuests();
        this.hourlyTimer();
        this.dailyCheck();
        this.withdrawUpdate();
        
        // Обновление лидерборда
        leaderboard.update(this.data);
    }
    
    // Офлайн доход с жестким лимитом 3 часа
    offline() {
        const now = Date.now();
        const diff = now - this.data.lastTime;
        
        // ИСПРАВЛЕНИЕ: Строгое ограничение 3 часа
        const limitedDiff = Math.min(diff, CONFIG.OFFLINE_LIMIT);
        
        if (limitedDiff > 60000 && this.data.auto > 0) { // Мин 1 минута
            const hours = limitedDiff / 3600000;
            const earned = Math.floor(hours * this.data.auto);
            
            if (earned > 0) {
                this.data.balance += earned;
                this.data.earned += earned;
                toast(`⏰ Офлайн доход: +${fmt(earned)} NK (${Math.floor(hours * 60)} мин)`, 'success');
            }
        }
        
        this.data.lastTime = now;
        this.data.serverTime = now;
        this.save();
    }
    
    // Проверка манипуляции временем
    checkTimeManipulation() {
        const now = Date.now();
        const expected = this.data.serverTime + 10000; // +10 сек с последней проверки
        const diff = Math.abs(now - expected);
        
        // Если разница больше 1 минуты - подозрение на манипуляцию
        if (diff > 60000) {
            console.warn('Time manipulation detected');
            // Сбрасываем серверное время
            this.data.serverTime = now;
            this.data.lastTime = now;
        } else {
            this.data.serverTime = now;
        }
    }
    
    // Клик с улучшенной защитой
    click(e) {
        const now = Date.now();
        
        // Анализ паттерна кликов
        this.clickPattern.push(now);
        this.clickPattern = this.clickPattern.filter(t => now - t < 5000);
        
        // Проверка на бота (слишком регулярные интервалы)
        if (CONFIG.CLICK_PATTERN_CHECK && this.clickPattern.length > 10) {
            const intervals = [];
            for (let i = 1; i < this.clickPattern.length; i++) {
                intervals.push(this.clickPattern[i] - this.clickPattern[i-1]);
            }
            const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
            const variance = intervals.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / intervals.length;
            
            // Если variance слишком мала - клики слишком регулярные (бот)
            if (variance < 100 && avg < 100) {
                sound.error();
                toast('⚠️ Обнаружена подозрительная активность!', 'error');
                return;
            }
        }
        
        // Стандартная проверка частоты
        this.clicks.push(now);
        this.clicks = this.clicks.filter(t => now - t < 1000);
        
        if (this.clicks.length > CONFIG.MAX_CLICKS_SEC) {
            sound.error();
            toast('⚠️ Слишком быстро! Макс ' + CONFIG.MAX_CLICKS_SEC + '/сек', 'error');
            return;
        }
        
        // Проверка энергии
        if (this.data.energy <= 0) {
            sound.error();
            toast('⚡ Энергия закончилась!', 'error');
            return;
        }
        
        // Комбо система
        this.combo++;
        clearTimeout(this.comboTimer);
        this.comboTimer = setTimeout(() => { 
            this.combo = 0; 
            this.comboUpdate(); 
        }, CONFIG.COMBO_TIME);
        
        // Расчет силы клика
        let power = this.getTap();
        if (this.combo >= CONFIG.COMBO_THRESH) power *= CONFIG.COMBO_MULT;
        if (this.booster && this.booster.mult) power *= this.booster.mult;
        
        // Начисление
        this.data.balance += power;
        this.data.earned += power;
        this.data.clicks++;
        this.data.energy = Math.max(0, this.data.energy - 1);
        this.data.xp += power;
        
        // Проверки
        this.levelCheck();
        window.ui.floating(e.clientX, e.clientY, `+${fmt(power)}`);
        this.achievements();
        this.update();
        this.comboUpdate();
        window.ui.checkBuyable();
        
        // Звук и вибрация
        sound.tap();
        vibrate(5);
    }
    
    // Получение силы клика
    getTap() {
        let p = this.data.tapPower;
        Object.keys(CONFIG.upgrades).forEach(k => {
            const cfg = CONFIG.upgrades[k];
            if (cfg.type === 'tap') p += (this.data.upgrades[k] || 0) * cfg.bonus;
        });
        return p;
    }
    
    // Проверка повышения уровня
    levelCheck() {
        const need = this.needXP();
        if (this.data.xp >= need) {
            this.data.level++;
            this.data.xp -= need;
            const r = this.data.level * 1000;
            this.data.balance += r;
            this.data.earned += r;
            sound.level();
            modal('⭐', 'Новый уровень!', `Достигнут ${this.data.level} уровень!`, `+${fmt(r)} NK`);
            this.achievements();
            leaderboard.update(this.data);
        }
    }
    
    needXP() {
        return Math.floor(1000 * Math.pow(1.3, this.data.level - 1));
    }
    
    // Тик энергии
    energyTick() {
        const max = this.getMaxEnergy();
        if (this.data.energy < max) {
            this.data.energy = Math.min(max, this.data.energy + this.getRegen());
            this.update();
        }
    }
    
    // Тик авто-дохода
    autoTick() {
        if (this.data.auto > 0) {
            const ps = this.data.auto / 3600;
            this.data.balance += ps;
            this.data.earned += ps;
            this.update();
        }
    }
    
    getMaxEnergy() {
        let e = CONFIG.ENERGY_INIT;
        Object.keys(CONFIG.upgrades).forEach(k => {
            const cfg = CONFIG.upgrades[k];
            if (cfg.type === 'energy') e += (this.data.upgrades[k] || 0) * cfg.bonus;
        });
        return e;
    }
    
    getRegen() {
        let r = CONFIG.ENERGY_REGEN;
        Object.keys(CONFIG.upgrades).forEach(k => {
            const cfg = CONFIG.upgrades[k];
            if (cfg.type === 'regen') r += (this.data.upgrades[k] || 0) * cfg.bonus;
        });
        return r;
    }
    
    // ИСПРАВЛЕНИЕ: Покупка с защитой от двойных кликов
    buyUpgrade(key) {
        const now = Date.now();
        
        // Debounce: не позволять покупать чаще чем раз в 300мс
        if (now - this.lastPurchase < CONFIG.PURCHASE_COOLDOWN) {
            return;
        }
        this.lastPurchase = now;
        
        const cfg = CONFIG.upgrades[key];
        const lvl = this.data.upgrades[key] || 0;
        
        if (lvl >= cfg.max) {
            toast('✅ Максимальный уровень!');
            return;
        }
        
        const cost = this.getCost(cfg, lvl);
        
        if (this.data.balance < cost) {
            sound.error();
            toast('❌ Недостаточно монет!', 'error');
            return;
        }
        
        // Покупка
        this.data.balance -= cost;
        this.data.upgrades[key] = lvl + 1;
        this.data.upg++;
        
        if (cfg.type === 'auto') this.data.auto += cfg.bonus;
        
        sound.buy();
        toast(`✅ ${cfg.name} → Ур. ${lvl + 1}!`, 'success');
        this.achievements();
        this.update();
        window.ui.renderUpgrades();
        window.ui.checkBuyable();
        this.save();
        leaderboard.update(this.data);
    }
    
    getCost(cfg, lvl) {
        return Math.floor(cfg.cost * Math.pow(cfg.mult, lvl));
    }
    
    // Использование бустера
    useBooster(key) {
        if (this.booster) {
            toast('⚠️ Бустер уже активен!');
            return;
        }
        
        const b = CONFIG.boosters[key];
        if (this.data.balance < b.cost) {
            sound.error();
            toast('❌ Недостаточно монет!', 'error');
            return;
        }
        
        this.data.balance -= b.cost;
        
        if (b.effect === 'energy') {
            this.data.energy = this.getMaxEnergy();
            toast('🔋 Энергия восстановлена!', 'success');
            sound.success();
            this.update();
            window.ui.renderBoosters();
            this.save();
            return;
        }
        
        if (b.effect === 'auto') {
            this.startAutoTap(b.time);
            toast(`🤖 Авто-тап ${b.time}с!`, 'success');
            this.booster = { ...b, left: b.time, key };
        } else {
            this.booster = { ...b, left: b.time, key };
            toast(`🚀 ${b.name} активирован!`, 'success');
        }
        
        clearInterval(this.boosterTimer);
        this.boosterTimer = setInterval(() => {
            this.booster.left--;
            if (this.booster.left <= 0) {
                clearInterval(this.boosterTimer);
                if (this.autoTap) {
                    clearInterval(this.autoTap);
                    this.autoTap = null;
                }
                this.booster = null;
                toast('⏰ Бустер закончился!');
            }
            window.ui.renderBoosters();
        }, 1000);
        
        sound.success();
        window.ui.renderBoosters();
        this.save();
    }
    
    startAutoTap(time) {
        this.autoTap = setInterval(() => {
            if (this.data.energy > 0) {
                const p = this.getTap();
                this.data.balance += p;
                this.data.earned += p;
                this.data.clicks++;
                this.data.energy = Math.max(0, this.data.energy - 1);
                this.data.xp += p;
                this.levelCheck();
                this.update();
            }
        }, 100);
    }
    
    // Достижения
    achievements() {
        let n = 0;
        CONFIG.achievements.forEach(a => {
            if (!this.data.done[a.id] && a.check(this.data)) {
                this.data.done[a.id] = true;
                this.data.balance += a.reward;
                this.data.earned += a.reward;
                sound.achievement();
                modal(a.icon, a.name, a.desc, `+${fmt(a.reward)} NK`);
                n++;
                this.save();
            }
        });
        if (n > 0) {
            window.ui.renderQuests();
            leaderboard.update(this.data);
        }
    }
    
    // Таймер ежечасного бонуса
    hourlyTimer() {
        setInterval(() => {
            const now = Date.now();
            const diff = now - this.data.hourly;
            const left = Math.max(0, 3600000 - diff);
            const m = Math.floor(left / 60000);
            const s = Math.floor((left % 60000) / 1000);
            
            const btn = document.getElementById('hourlyBtn');
            const timer = document.getElementById('hourlyTimer');
            
            if (!btn || !timer) return;
            
            if (left === 0) {
                btn.disabled = false;
                timer.textContent = 'Готов!';
                timer.style.color = 'var(--success)';
            } else {
                btn.disabled = true;
                timer.textContent = `${m}:${s.toString().padStart(2, '0')}`;
                timer.style.color = 'var(--warning)';
            }
        }, 1000);
    }
    
    // Проверка ежедневной награды
    dailyCheck() {
        const now = Date.now();
        const last = this.data.lastDaily;
        const day = now - last > 86400000;
        const two = now - last > 172800000;
        
        if (two) this.data.daily = 0;
        
        const btn = document.getElementById('dailyBtn');
        const d = document.getElementById('dailyDay');
        const r = document.getElementById('dailyReward');
        
        if (!btn || !d || !r) return;
        
        const cur = Math.min(this.data.daily + 1, 7);
        d.textContent = cur;
        r.textContent = fmt(CONFIG.daily[cur - 1]);
        
        btn.disabled = !day;
    }
    
    // Обновление вывода
    withdrawUpdate() {
        const t = Math.floor(this.data.balance * CONFIG.NK_TO_TENGE);
        const el1 = document.getElementById('withdrawTenge');
        const el2 = document.getElementById('withdrawNK');
        const btn = document.getElementById('withdrawBtn');
        
        if (el1) el1.textContent = fmt(t) + ' ₸';
        if (el2) el2.textContent = fmt(Math.floor(this.data.balance));
        if (btn) btn.disabled = t < CONFIG.MIN_WITHDRAW;
        
        this.renderHistory();
    }
    
    renderHistory() {
        const c = document.getElementById('historyList');
        if (!c) return;
        
        if (this.data.history.length === 0) {
            c.innerHTML = '<div style="text-align:center;color:#94a3b8;padding:20px">История пуста</div>';
            return;
        }
        
        c.innerHTML = '';
        this.data.history.forEach(h => {
            const d = document.createElement('div');
            d.style.cssText = 'background:#334155;padding:16px;border-radius:12px;margin-bottom:12px;border:1px solid var(--border)';
            d.innerHTML = `
                <div style="display:flex;justify-content:space-between;margin-bottom:8px">
                    <div style="font-size:20px;font-weight:700;color:var(--warning)">${fmt(h.amount)} ₸</div>
                    <div style="padding:4px 12px;border-radius:12px;font-size:11px;font-weight:700;
                         background:rgba(${h.status === 'pending' ? '245,158,11' : '16,185,129'},0.2);
                         color:var(--${h.status === 'pending' ? 'warning' : 'success'})">${h.status === 'pending' ? 'В обработке' : 'Выплачено'}</div>
                </div>
                <div style="font-size:13px;color:#94a3b8">
                    ${h.method === 'kaspi' ? 'Kaspi' : 'Телефон'}: ${h.number}<br>Дата: ${h.date}
                </div>
            `;
            c.appendChild(d);
        });
    }
    
    // Обновление комбо
    comboUpdate() {
        const card = document.getElementById('comboCard');
        const mult = document.getElementById('comboMultiplier');
        if (!card || !mult) return;
        
        if (this.combo >= CONFIG.COMBO_THRESH) {
            card.classList.add('active');
            mult.textContent = CONFIG.COMBO_MULT;
        } else {
            card.classList.remove('active');
        }
    }
    
    // Обновление UI
    update() {
        // Обновление всех элементов интерфейса
        const elements = {
            'balance': fmt(Math.floor(this.data.balance)),
            'balanceTenge': fmt(Math.floor(this.data.balance * CONFIG.NK_TO_TENGE)),
            'userLevel': this.data.level,
            'currentLevel': this.data.level,
            'levelProgress': fmt(Math.floor(this.data.xp)),
            'levelTarget': fmt(this.needXP()),
            'energyText': `${Math.floor(this.data.energy)}/${this.getMaxEnergy()}`,
            'regenRate': this.getRegen(),
            'tapPower': this.getTap(),
            'totalClicks': fmt(this.data.clicks),
            'autoIncome': fmt(Math.floor(this.data.auto)),
            'totalEarned': fmt(Math.floor(this.data.earned)),
            'clicksPerSec': this.clicks.length
        };
        
        Object.keys(elements).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = elements[id];
        });
        
        // Прогресс-бары
        const lpb = document.getElementById('levelProgressBar');
        if (lpb) lpb.style.width = ((this.data.xp / this.needXP()) * 100) + '%';
        
        const eb = document.getElementById('energyBar');
        if (eb) eb.style.width = ((this.data.energy / this.getMaxEnergy()) * 100) + '%';
        
        this.withdrawUpdate();
    }
    
    // Сохранение с проверкой
    save() {
        this.data.lastTime = Date.now();
        storage.save(this.data);
    }
    
    saveGame() {
        this.save();
    }
}

// Глобальный экземпляр
window.game = null;
