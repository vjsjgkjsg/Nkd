// ===== ХРАНИЛИЩЕ С ЗАЩИТОЙ =====
class Storage {
    constructor() {
        this.key = 'neoklin_v5';
        this.checksumKey = 'neoklin_check';
    }
    
    // Простая контрольная сумма для проверки целостности
    checksum(data) {
        const str = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString(36);
    }
    
    // Сохранение с контрольной суммой
    save(data) {
        try {
            const check = this.checksum(data);
            localStorage.setItem(this.key, JSON.stringify(data));
            localStorage.setItem(this.checksumKey, check);
            return true;
        } catch (e) {
            console.error('Save error:', e);
            return false;
        }
    }
    
    // Загрузка с проверкой целостности
    load() {
        try {
            const str = localStorage.getItem(this.key);
            if (!str) return null;
            
            const data = JSON.parse(str);
            
            // Проверка контрольной суммы
            if (CONFIG.DATA_INTEGRITY_CHECK) {
                const saved = localStorage.getItem(this.checksumKey);
                const current = this.checksum(data);
                
                if (saved !== current) {
                    console.warn('Data integrity check failed');
                    // Можно вернуть null или показать предупреждение
                    // Для демо-версии просто логируем
                }
            }
            
            return data;
        } catch (e) {
            console.error('Load error:', e);
            return null;
        }
    }
    
    // Очистка
    clear() {
        localStorage.removeItem(this.key);
        localStorage.removeItem(this.checksumKey);
    }
    
    // Экспорт данных
    export() {
        const data = this.load();
        if (!data) return null;
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'neoklin-save.json';
        a.click();
        URL.revokeObjectURL(url);
        toast('✅ Данные экспортированы!', 'success');
    }
    
    // Импорт данных
    import(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                this.save(data);
                toast('✅ Данные импортированы! Перезагрузите страницу.', 'success');
            } catch (err) {
                toast('❌ Ошибка импорта!', 'error');
            }
        };
        reader.readAsText(file);
    }
}

const storage = new Storage();
