// ===== СИСТЕМА УВЕДОМЛЕНИЙ =====
class NotificationSystem {
    constructor() {
        this.permission = 'default';
        this.enabled = false;
    }
    
    // Запрос разрешения
    async requestPermission() {
        if (!('Notification' in window)) {
            toast('❌ Уведомления не поддерживаются', 'error');
            return false;
        }
        
        try {
            const permission = await Notification.requestPermission();
            this.permission = permission;
            this.enabled = permission === 'granted';
            
            if (this.enabled) {
                localStorage.setItem('neoklin_notif', '1');
                toast('✅ Уведомления включены!', 'success');
                this.scheduleReminders();
            } else {
                toast('❌ Разрешение отклонено', 'error');
            }
            
            return this.enabled;
        } catch (e) {
            console.error('Notification error:', e);
            return false;
        }
    }
    
    // Показ уведомления
    show(title, body, icon = '💎') {
        if (!this.enabled) return;
        if (document.hasFocus()) return; // Не показывать если игра открыта
        
        try {
            new Notification(title, {
                body: body,
                icon: '/favicon.ico',
                badge: '/favicon.ico',
                tag: 'neoklin',
                requireInteraction: false
            });
        } catch (e) {
            console.error('Show notification error:', e);
        }
    }
    
    // Планирование напоминаний
    scheduleReminders() {
        // Напоминание о энергии каждый час
        setInterval(() => {
            if (window.game && window.game.data.energy < window.game.getMaxEnergy() * 0.5) {
                this.show('⚡ Энергия восстановилась!', 'Время кликать и зарабатывать!');
            }
        }, 3600000); // Каждый час
        
        // Напоминание о ежедневной награде
        setInterval(() => {
            if (window.game) {
                const now = Date.now();
                const lastDaily = window.game.data.lastDaily || 0;
                if (now - lastDaily > 86400000) {
                    this.show('📅 Ежедневная награда!', 'Заберите свою награду дня!');
                }
            }
        }, 43200000); // Каждые 12 часов
    }
    
    // Загрузка настроек
    loadSettings() {
        const saved = localStorage.getItem('neoklin_notif');
        if (saved === '1' && Notification.permission === 'granted') {
            this.enabled = true;
            this.permission = 'granted';
            this.scheduleReminders();
        }
    }
    
    // Переключение
    async toggle() {
        if (!this.enabled) {
            return await this.requestPermission();
        } else {
            this.enabled = false;
            localStorage.setItem('neoklin_notif', '0');
            toast('🔕 Уведомления выключены');
            return false;
        }
    }
}

const notifications = new NotificationSystem();
notifications.loadSettings();
