// ===== РАСШИРЕННАЯ СТАТИСТИКА =====
class StatisticsManager {
    constructor() {
        this.stats = this.load();
    }
    
    load() {
        const saved = localStorage.getItem('neoklin_stats');
        return saved ? JSON.parse(saved) : {
            totalClicks: 0,
            totalEarned: 0,
            totalSpent: 0,
            sessionsCount: 0,
            totalPlayTime: 0,
            maxCombo: 0,
            upgradesBought: 0,
            boostersUsed: 0,
            achievementsUnlocked: 0,
            referralsMade: 0,
            withdrawalsMade: 0,
            totalWithdrawn: 0
        };
    }
    
    save() {
        localStorage.setItem('neoklin_stats', JSON.stringify(this.stats));
    }
    
    increment(key, value = 1) {
        if (this.stats.hasOwnProperty(key)) {
            this.stats[key] += value;
            this.save();
        }
    }
    
    set(key, value) {
        if (this.stats.hasOwnProperty(key)) {
            this.stats[key] = value;
            this.save();
        }
    }
    
    render() {
        const container = document.getElementById('statsContainer');
        if (!container) return;
        
        const statsHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">${fmt(this.stats.totalClicks)}</div>
                    <div class="stat-label">Всего кликов</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${fmt(this.stats.totalEarned)}</div>
                    <div class="stat-label">Заработано NK</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${fmt(this.stats.totalSpent)}</div>
                    <div class="stat-label">Потрачено NK</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${this.stats.sessionsCount}</div>
                    <div class="stat-label">Сессий</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${formatTime(this.stats.totalPlayTime)}</div>
                    <div class="stat-label">Время игры</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${this.stats.maxCombo}</div>
                    <div class="stat-label">Макс комбо</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${this.stats.upgradesBought}</div>
                    <div class="stat-label">Улучшений куплено</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${this.stats.boostersUsed}</div>
                    <div class="stat-label">Бустеров использовано</div>
                </div>
            </div>
        `;
        
        container.innerHTML = statsHTML;
    }
}

window.statisticsManager = new StatisticsManager();
console.log('✅ Statistics manager loaded');
