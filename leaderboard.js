// ===== ЛИДЕРБОРД (ЛОКАЛЬНЫЙ) =====
class Leaderboard {
    constructor() {
        this.key = 'neoklin_leaderboard';
    }
    
    // Добавление/обновление игрока
    update(userData) {
        let board = this.load();
        
        const entry = {
            id: social.userId,
            name: this.getPlayerName(),
            balance: Math.floor(userData.balance),
            level: userData.level,
            earned: Math.floor(userData.earned),
            clicks: userData.clicks,
            rank: this.getRank(userData.earned),
            lastUpdate: Date.now()
        };
        
        // Удаляем старую запись если есть
        board = board.filter(p => p.id !== entry.id);
        
        // Добавляем новую
        board.push(entry);
        
        // Сортируем по заработку
        board.sort((a, b) => b.earned - a.earned);
        
        // Ограничиваем топ-100
        board = board.slice(0, 100);
        
        this.save(board);
        return board;
    }
    
    // Получение имени игрока
    getPlayerName() {
        let name = localStorage.getItem('neoklin_name');
        if (!name) {
            name = 'Игрок ' + social.userId.substr(-4);
        }
        return name;
    }
    
    // Установка имени
    setName(name) {
        name = name.trim().substr(0, 20);
        if (!name) return false;
        localStorage.setItem('neoklin_name', name);
        if (window.game) {
            this.update(window.game.data);
            this.render();
        }
        toast('✅ Имя изменено!', 'success');
        return true;
    }
    
    // Получение звания
    getRank(earned) {
        const ranks = CONFIG.RANKS;
        for (let i = ranks.length - 1; i >= 0; i--) {
            if (earned >= ranks[i].min) {
                return ranks[i];
            }
        }
        return ranks[0];
    }
    
    // Загрузка
    load() {
        try {
            const data = localStorage.getItem(this.key);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    }
    
    // Сохранение
    save(board) {
        localStorage.setItem(this.key, JSON.stringify(board));
    }
    
    // Получение позиции игрока
    getMyPosition() {
        if (!window.game) return null;
        const board = this.load();
        const myId = social.userId;
        const pos = board.findIndex(p => p.id === myId);
        return pos >= 0 ? pos + 1 : null;
    }
    
    // Рендер лидерборда
    render() {
        if (!window.game) return;
        
        // Обновляем данные текущего игрока
        const board = this.update(window.game.data);
        
        const container = document.getElementById('leaderboardContainer');
        if (!container) return;
        
        // Моя позиция
        const myPos = this.getMyPosition();
        const myPosEl = document.getElementById('myPosition');
        if (myPosEl) {
            if (myPos) {
                myPosEl.innerHTML = `Ваша позиция: <span style="color:var(--primary);font-weight:700">#${myPos}</span>`;
            } else {
                myPosEl.innerHTML = 'Начните играть чтобы попасть в рейтинг!';
            }
        }
        
        // Список
        container.innerHTML = '';
        board.forEach((player, index) => {
            const isMe = player.id === social.userId;
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
            
            const div = document.createElement('div');
            div.className = `leaderboard-item ${isMe ? 'me' : ''}`;
            div.innerHTML = `
                <div class="lb-position">${medal}</div>
                <div class="lb-rank">${player.rank.icon}</div>
                <div class="lb-info">
                    <div class="lb-name">${player.name}${isMe ? ' (Вы)' : ''}</div>
                    <div class="lb-stats">
                        <span>Ур. ${player.level}</span>
                        <span>•</span>
                        <span>${fmt(player.clicks)} кликов</span>
                    </div>
                </div>
                <div class="lb-earned">
                    <div>${fmt(player.earned)}</div>
                    <div style="font-size:11px;color:#94a3b8">заработано</div>
                </div>
            `;
            container.appendChild(div);
        });
        
        // Если пусто
        if (board.length === 0) {
            container.innerHTML = '<div style="text-align:center;color:#94a3b8;padding:40px">Лидерборд пуст</div>';
        }
    }
}

const leaderboard = new Leaderboard();
