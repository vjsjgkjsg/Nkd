// ===== АУДИО СИСТЕМА С ИСПРАВЛЕНИЕМ =====
class AudioSystem {
    constructor() {
        this.ctx = null;
        this.enabled = true;
        this.initialized = false;
    }
    
    // Инициализация контекста при первом взаимодействии
    init() {
        if (this.initialized) return;
        
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            
            // Возобновление контекста если suspended
            if (this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            
            this.initialized = true;
        } catch (e) {
            console.warn('AudioContext not supported:', e);
            this.enabled = false;
        }
    }
    
    // Проверка и возобновление контекста
    resume() {
        if (!this.ctx) return;
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }
    
    // Воспроизведение звука
    play(freq, dur = 0.1, type = 'sine', volume = 0.1) {
        if (!this.enabled) return;
        if (!this.initialized) this.init();
        if (!this.ctx) return;
        
        try {
            this.resume();
            
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.frequency.value = freq;
            osc.type = type;
            
            gain.gain.setValueAtTime(volume, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + dur);
            
            osc.start();
            osc.stop(this.ctx.currentTime + dur);
        } catch (e) {
            console.warn('Audio play error:', e);
        }
    }
    
    // Предустановленные звуки
    tap() { 
        this.play(800, 0.05, 'sine', 0.08); 
    }
    
    buy() { 
        this.play(1200, 0.1, 'square', 0.1);
        setTimeout(() => this.play(1400, 0.15, 'square', 0.1), 100);
    }
    
    level() { 
        this.play(600, 0.1, 'sine', 0.12);
        setTimeout(() => this.play(800, 0.15, 'sine', 0.12), 100);
        setTimeout(() => this.play(1000, 0.2, 'sine', 0.12), 200);
    }
    
    achievement() { 
        this.play(800, 0.15, 'triangle', 0.12);
        setTimeout(() => this.play(1000, 0.2, 'triangle', 0.12), 100);
        setTimeout(() => this.play(1200, 0.25, 'triangle', 0.12), 200);
    }
    
    error() { 
        this.play(200, 0.2, 'sawtooth', 0.08); 
    }
    
    success() {
        this.play(600, 0.15, 'sine', 0.1);
        setTimeout(() => this.play(800, 0.2, 'sine', 0.1), 100);
    }
    
    // Включение/выключение звука
    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('neoklin_sound', this.enabled ? '1' : '0');
        toast(this.enabled ? '🔊 Звук включен' : '🔇 Звук выключен');
        return this.enabled;
    }
    
    // Загрузка настройки звука
    loadSettings() {
        const saved = localStorage.getItem('neoklin_sound');
        if (saved !== null) {
            this.enabled = saved === '1';
        }
    }
}

const sound = new AudioSystem();

// Инициализация при первом клике
document.addEventListener('click', () => {
    sound.init();
}, { once: true });

// Загрузка настроек
sound.loadSettings();
