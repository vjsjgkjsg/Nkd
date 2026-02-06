// ===== СОЦИАЛЬНАЯ СИСТЕМА =====
class SocialSystem {
    constructor() {
        this.userId = this.getOrCreateUserId();
        this.refCode = this.generateRefCode();
    }
    
    getOrCreateUserId() {
        let id = localStorage.getItem('neoklin_uid');
        if (!id) {
            id = 'NK' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('neoklin_uid', id);
        }
        return id;
    }
    
    generateRefCode() {
        return this.userId.substr(-8).toUpperCase();
    }
    
    getRefLink() {
        const base = window.location.origin + window.location.pathname;
        return `${base}?ref=${this.refCode}`;
    }
    
    // Проверка реферала при загрузке
    checkReferral(gameData) {
        const refCode = getRefCodeFromUrl();
        if (!refCode) return false;
        if (refCode === this.refCode) return false; // Свой код
        if (gameData.refUsed) return false; // Уже использовал
        
        // Сохраняем реферера
        gameData.refBy = refCode;
        gameData.refUsed = true;
        
        // Бонус за регистрацию по реферальной ссылке
        gameData.balance += CONFIG.REFERRAL_BONUS;
        gameData.earned += CONFIG.REFERRAL_BONUS;
        
        toast(`🎁 Бонус за приглашение: +${fmt(CONFIG.REFERRAL_BONUS)} NK!`, 'success');
        sound.achievement();
        
        // Сохраняем в список рефералов (для будущего backend)
        this.saveReferral(refCode);
        
        return true;
    }
    
    saveReferral(refCode) {
        let refs = JSON.parse(localStorage.getItem('neoklin_refs') || '[]');
        if (!refs.includes(refCode)) {
            refs.push({
                code: refCode,
                date: new Date().toISOString(),
                userId: this.userId
            });
            localStorage.setItem('neoklin_refs', JSON.stringify(refs));
        }
    }
    
    // Получение статистики рефералов
    getRefStats() {
        const refs = JSON.parse(localStorage.getItem('neoklin_refs') || '[]');
        return {
            count: refs.length,
            earned: refs.length * CONFIG.REFERRAL_BONUS,
            refs: refs
        };
    }
    
    // Копирование реферальной ссылки
    copyRefLink() {
        copyToClipboard(this.getRefLink());
        sound.success();
    }
    
    // Поделиться
    async share() {
        const text = `🎮 Присоединяйся к Neo Klin! Зарабатывай реальные деньги!\n\n${this.getRefLink()}`;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Neo Klin',
                    text: text
                });
                sound.success();
            } catch (err) {
                if (err.name !== 'AbortError') {
                    this.copyRefLink();
                }
            }
        } else {
            this.copyRefLink();
        }
    }
    
    // Выполнение социального задания
    completeTask(taskId, gameData) {
        if (!gameData.socialTasks) gameData.socialTasks = {};
        if (gameData.socialTasks[taskId]) {
            toast('✅ Задание уже выполнено!');
            return false;
        }
        
        const task = CONFIG.socialTasks.find(t => t.id === taskId);
        if (!task) return false;
        
        // Открываем ссылку
        if (task.link !== 'share') {
            window.open(task.link, '_blank');
        }
        
        // Даем небольшую задержку перед подтверждением
        setTimeout(() => {
            if (confirm(`Вы выполнили задание "${task.name}"? Получите ${fmt(task.reward)} NK!`)) {
                gameData.socialTasks[taskId] = true;
                gameData.balance += task.reward;
                gameData.earned += task.reward;
                toast(`✅ +${fmt(task.reward)} NK за задание!`, 'success');
                sound.achievement();
                this.render();
                if (window.game) window.game.save();
            }
        }, task.link === 'share' ? 0 : 2000);
        
        return true;
    }
    
    // Рендер социального экрана
    render() {
        if (!window.game) return;
        const data = window.game.data;
        
        // Реферальная ссылка
        const refLinkInput = document.getElementById('refLink');
        if (refLinkInput) {
            refLinkInput.value = this.getRefLink();
        }
        
        // Статистика
        const stats = this.getRefStats();
        const refCount = document.getElementById('refCount');
        const refEarned = document.getElementById('refEarned');
        if (refCount) refCount.textContent = stats.count;
        if (refEarned) refEarned.textContent = fmt(stats.earned);
        
        // Социальные задания
        const container = document.getElementById('socialTasksContainer');
        if (!container) return;
        
        container.innerHTML = '';
        CONFIG.socialTasks.forEach(task => {
            const done = data.socialTasks && data.socialTasks[task.id];
            const div = document.createElement('div');
            div.className = `task-card ${done ? 'done' : ''}`;
            div.innerHTML = `
                <div class="task-icon">${task.icon}</div>
                <div class="task-info">
                    <div class="task-name">${task.name}</div>
                    <div class="task-desc">${task.desc}</div>
                </div>
                <div class="task-reward ${done ? 'done' : ''}">
                    ${done ? '✅' : '+' + fmt(task.reward)}
                </div>
            `;
            if (!done) {
                div.style.cursor = 'pointer';
                div.onclick = () => this.completeTask(task.id, data);
            }
            container.appendChild(div);
        });
    }
}

const social = new SocialSystem();
