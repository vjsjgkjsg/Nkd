// ===== УПРАВЛЕНИЕ ИНТЕРФЕЙСОМ =====
class UI {
    constructor() {
        this.particlesCanvas = null;
        this.particlesCtx = null;
        this.particles = [];
        this.animFrame = null;
    }
    
    init() {
        this.initParticles();
        this.setupEventListeners();
    }
    
    // ИСПРАВЛЕНИЕ: Инициализация частиц без утечки памяти
    initParticles() {
        this.particlesCanvas = document.getElementById('particleCanvas');
        if (!this.particlesCanvas) return;
        
        this.particlesCtx = this.particlesCanvas.getContext('2d');
        this.resizeCanvas();
        
        // Создаем частицы
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.particlesCanvas.width,
                y: Math.random() * this.particlesCanvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1
            });
        }
        
        this.animateParticles();
        
        // ИСПРАВЛЕНИЕ: Удаляем старый слушатель перед добавлением нового
        window.removeEventListener('resize', this.resizeHandler);
        this.resizeHandler = () => this.resizeCanvas();
        window.addEventListener('resize', this.resizeHandler);
    }
    
    resizeCanvas() {
        if (!this.particlesCanvas) return;
        this.particlesCanvas.width = window.innerWidth;
        this.particlesCanvas.height = window.innerHeight;
    }
    
    animateParticles() {
        if (!this.particlesCtx || !this.particlesCanvas) return;
        
        const ctx = this.particlesCtx;
        const canvas = this.particlesCanvas;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#6366f1';
        
        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            
            ctx.globalAlpha = 0.6;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        
        this.animFrame = requestAnimationFrame(() => this.animateParticles());
    }
    
    setupEventListeners() {
        // Клик по монете
        const coinBtn = document.getElementById('coinBtn');
        if (coinBtn) {
            coinBtn.addEventListener('click', (e) => {
                if (!window.game) return;
                window.game.click(e);
                coinBtn.classList.add('clicked');
                setTimeout(() => coinBtn.classList.remove('clicked'), 300);
            });
        }
        
        // Навигация
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => switchScreen(btn.dataset.screen));
        });
        
        // Кнопки бонусов
        const hourlyBtn = document.getElementById('hourlyBtn');
        if (hourlyBtn) hourlyBtn.addEventListener('click', () => this.claimHourly());
        
        const dailyBtn = document.getElementById('dailyBtn');
        if (dailyBtn) dailyBtn.addEventListener('click', () => this.claimDaily());
        
        // Вывод
        const withdrawBtn = document.getElementById('withdrawBtn');
        if (withdrawBtn) withdrawBtn.addEventListener('click', () => this.submitWithdraw());
        
        // Модалка
        const modalBtn = document.getElementById('modalBtn');
        if (modalBtn) modalBtn.addEventListener('click', closeModal);
        
        // Реферальная ссылка
        const copyRefBtn = document.getElementById('copyRefBtn');
        if (copyRefBtn) copyRefBtn.addEventListener('click', () => social.copyRefLink());
        
        const shareRefBtn = document.getElementById('shareRefBtn');
        if (shareRefBtn) shareRefBtn.addEventListener('click', () => social.share());
        
        // Настройки звука
        const soundToggle = document.getElementById('soundToggle');
        if (soundToggle) {
            soundToggle.checked = sound.enabled;
            soundToggle.addEventListener('change', () => sound.toggle());
        }
        
        // Уведомления
        const notifToggle = document.getElementById('notifToggle');
        if (notifToggle) {
            notifToggle.checked = notifications.enabled;
            notifToggle.addEventListener('change', () => notifications.toggle());
        }
    }
    
    // Плавающие числа с улучшенной анимацией
    floating(x, y, txt) {
        const e = document.createElement('div');
        e.className = 'floating';
        e.textContent = txt;
        e.style.left = x + 'px';
        e.style.top = y + 'px';
        
        if (window.game && window.game.combo >= CONFIG.COMBO_THRESH) {
            e.style.color = '#ef4444';
            e.style.fontSize = '42px';
        } else if (window.game && window.game.booster && window.game.booster.mult) {
            e.style.color = '#6366f1';
            e.style.fontSize = '38px';
        } else {
            e.style.color = '#fbbf24';
        }
        
        document.body.appendChild(e);
        setTimeout(() => e.remove(), 1200);
    }
    
    // Рендер бустеров
    renderBoosters() {
        const c = document.getElementById('boostersGrid');
        if (!c || !window.game) return;
        
        c.innerHTML = '';
        Object.keys(CONFIG.boosters).forEach(k => {
            const b = CONFIG.boosters[k];
            const active = window.game.booster && window.game.booster.key === k;
            
            const d = document.createElement('div');
            d.className = `booster ${active ? 'active' : ''}`;
            d.innerHTML = `
                <div>${b.icon}</div>
                <div>${b.name}</div>
                <div>${active ? window.game.booster.left + 's' : fmt(b.cost) + ' NK'}</div>
            `;
            
            if (!active) {
                d.onclick = () => window.game.useBooster(k);
            }
            
            c.appendChild(d);
        });
    }
    
    // Рендер улучшений
    renderUpgrades() {
        const c = document.getElementById('upgradesContainer');
        if (!c || !window.game) return;
        
        c.innerHTML = '';
        Object.keys(CONFIG.upgrades).forEach(k => {
            const cfg = CONFIG.upgrades[k];
            const lvl = window.game.data.upgrades[k] || 0;
            const cost = window.game.getCost(cfg, lvl);
            const can = window.game.data.balance >= cost;
            const max = lvl >= cfg.max;
            
            const d = document.createElement('div');
            d.className = `upgrade ${!can && !max ? 'locked' : ''} ${max ? 'max' : ''}`;
            
            let profit = '';
            if (cfg.type === 'tap') profit = `+${cfg.bonus * lvl} к клику`;
            else if (cfg.type === 'energy') profit = `+${cfg.bonus * lvl} энергии`;
            else if (cfg.type === 'regen') profit = `+${cfg.bonus * lvl}/сек`;
            else if (cfg.type === 'auto') profit = `+${cfg.bonus * lvl}/час`;
            
            d.innerHTML = `
                <div class="upgrade-icon">${cfg.icon}</div>
                <div class="upgrade-info">
                    <div class="upgrade-header">
                        <div class="upgrade-name">${cfg.name}</div>
                        <div class="upgrade-badge ${max ? 'max' : ''}">${max ? 'MAX' : `${lvl}/${cfg.max}`}</div>
                    </div>
                    <div class="upgrade-desc">${cfg.desc}</div>
                    <div class="upgrade-stats">
                        <span class="upgrade-profit">${profit}</span>
                        <span class="upgrade-cost ${max ? 'max' : can ? 'ok' : ''}">${max ? '✅ МАКС' : fmt(cost) + ' NK'}</span>
                    </div>
                </div>
            `;
            
            if (can && !max) {
                d.onclick = () => window.game.buyUpgrade(k);
            }
            
            c.appendChild(d);
        });
    }
    
    // Рендер заданий
    renderQuests() {
        const c = document.getElementById('questsContainer');
        if (!c || !window.game) return;
        
        c.innerHTML = '';
        let avail = 0;
        
        CONFIG.achievements.forEach(a => {
            const done = window.game.data.done[a.id];
            if (!done) avail++;
            
            const d = document.createElement('div');
            d.className = `quest ${done ? 'done' : ''}`;
            d.innerHTML = `
                <div class="quest-icon">${a.icon}</div>
                <div class="quest-info">
                    <div class="quest-name">${a.name}</div>
                    <div class="quest-desc">${a.desc}</div>
                </div>
                <div class="quest-reward ${done ? 'done' : ''}">${done ? '✅' : '+' + fmt(a.reward)}</div>
            `;
            c.appendChild(d);
        });
        
        const badge = document.getElementById('questBadge');
        if (badge) {
            if (avail > 0) {
                badge.textContent = avail > 9 ? '9+' : avail;
                badge.classList.add('show');
            } else {
                badge.classList.remove('show');
            }
        }
    }
    
    // Проверка доступных покупок
    checkBuyable() {
        if (!window.game) return;
        
        let can = false;
        Object.keys(CONFIG.upgrades).forEach(k => {
            const cfg = CONFIG.upgrades[k];
            const lvl = window.game.data.upgrades[k] || 0;
            if (lvl < cfg.max) {
                const cost = window.game.getCost(cfg, lvl);
                if (window.game.data.balance >= cost) can = true;
            }
        });
        
        const badge = document.getElementById('shopBadge');
        if (badge) {
            if (can) {
                badge.textContent = '!';
                badge.classList.add('show');
            } else {
                badge.classList.remove('show');
            }
        }
    }
    
    // Ежечасный бонус
    claimHourly() {
        if (!window.game) return;
        
        const now = Date.now();
        const diff = now - window.game.data.hourly;
        
        if (diff < 3600000) {
            toast('⏰ Ещё рано!', 'error');
            return;
        }
        
        const b = 1000 + (window.game.data.level * 100);
        window.game.data.balance += b;
        window.game.data.earned += b;
        window.game.data.hourly = now;
        window.game.save();
        window.game.update();
        window.game.achievements();
        
        sound.achievement();
        modal('⏰', 'Ежечасный бонус!', 'Получен!', `+${fmt(b)} NK`);
    }
    
    // Ежедневная награда
    claimDaily() {
        if (!window.game) return;
        
        const now = Date.now();
        const day = now - window.game.data.lastDaily > 86400000;
        
        if (!day) {
            toast('⏰ Приходи завтра!', 'error');
            return;
        }
        
        const cur = Math.min(window.game.data.daily + 1, 7);
        const r = CONFIG.daily[cur - 1];
        
        window.game.data.balance += r;
        window.game.data.earned += r;
        window.game.data.daily = cur === 7 ? 0 : cur;
        window.game.data.lastDaily = now;
        window.game.save();
        window.game.update();
        window.game.dailyCheck();
        window.game.achievements();
        
        sound.achievement();
        modal('📅', `День ${cur}!`, 'Награда получена!', `+${fmt(r)} NK`);
    }
    
    // ИСПРАВЛЕНИЕ: Вывод с валидацией
    submitWithdraw() {
        if (!window.game) return;
        
        const method = document.getElementById('withdrawMethod').value;
        const number = document.getElementById('withdrawNumber').value.trim();
        const amount = parseInt(document.getElementById('withdrawAmount').value);
        
        // Валидация номера
        if (!number) {
            toast('❌ Укажите номер!', 'error');
            return;
        }
        
        if (!validatePhone(number)) {
            toast('❌ Неверный формат номера!', 'error');
            return;
        }
        
        // Валидация суммы
        if (!amount || amount < CONFIG.MIN_WITHDRAW || amount <= 0) {
            toast(`❌ Минимум ${CONFIG.MIN_WITHDRAW} ₸!`, 'error');
            return;
        }
        
        const t = Math.floor(window.game.data.balance * CONFIG.NK_TO_TENGE);
        
        if (amount > t) {
            toast('❌ Недостаточно средств!', 'error');
            return;
        }
        
        const nk = Math.floor(amount / CONFIG.NK_TO_TENGE);
        window.game.data.balance -= nk;
        
        const w = {
            amount,
            method,
            number,
            status: 'pending',
            date: new Date().toLocaleDateString('ru-RU')
        };
        
        window.game.data.history.unshift(w);
        window.game.save();
        window.game.update();
        
        document.getElementById('withdrawNumber').value = '';
        document.getElementById('withdrawAmount').value = '';
        
        sound.success();
        modal('✅', 'Заявка принята!', 'Заявка отправлена', `${fmt(amount)} ₸`);
    }
}

// Глобальный экземпляр
window.ui = new UI();

// === СИСТЕМА ВКЛАДОК МАГАЗИНА ===
function initShopTabs() {
    const tabs = document.querySelectorAll('.shop-tab');
    const contents = document.querySelectorAll('.shop-tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            
            // Убираем активность со всех
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            // Активируем выбранную
            tab.classList.add('active');
            document.getElementById(`tab-${tabName}`).classList.add('active');
            
            // Рендерим контент
            if (tabName === 'skins' && window.skinsManager) {
                window.skinsManager.render();
            } else if (tabName === 'pets' && window.petsManager) {
                window.petsManager.render();
            } else if (tabName === 'boosters') {
                renderBoostersShop();
            }
        });
    });
}

// Рендер бустеров в магазине
function renderBoostersShop() {
    const container = document.getElementById('boostersShopContainer');
    if (!container || !window.game) return;
    
    container.innerHTML = '';
    Object.keys(CONFIG.boosters).forEach(k => {
        const b = CONFIG.boosters[k];
        const active = window.game.booster && window.game.booster.key === k;
        
        const div = document.createElement('div');
        div.className = `booster-shop-card ${active ? 'active' : ''}`;
        div.innerHTML = `
            <div style="font-size:48px;margin-bottom:10px">${b.icon}</div>
            <div style="font-weight:700;margin-bottom:5px">${b.name}</div>
            <div style="font-size:12px;color:#94a3b8;margin-bottom:10px">${b.description || ''}</div>
            <div style="font-weight:800;color:var(--warning);font-size:16px">
                ${active ? window.game.booster.left + 's' : fmt(b.cost) + ' NK'}
            </div>
        `;
        
        if (!active) {
            div.onclick = () => {
                window.game.useBooster(k);
                renderBoostersShop();
            };
        }
        
        container.appendChild(div);
    });
}

// Инициализация при загрузке
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShopTabs);
} else {
    initShopTabs();
}

console.log('✅ Shop tabs system loaded');
