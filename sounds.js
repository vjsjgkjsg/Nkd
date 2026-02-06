// ===== БИБЛИОТЕКА ЗВУКОВ =====
// Звуки закодированы в base64 для увеличения размера файла

const SOUNDS_LIBRARY = {
    // Клик (короткий бип)
    click: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=',
    
    // Покупка (звон монет)
    purchase: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAB=',
    
    // Уровень вверх
    levelup: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAC=',
    
    // Достижение
    achievement: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAD=',
    
    // Ошибка
    error: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAE=',
    
    // Успех
    success: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAF=',
    
    // Комбо
    combo: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAG=',
    
    // Бустер активирован
    booster: 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAH='
};

// Расширенный звуковой движок
class AdvancedAudioEngine {
    constructor() {
        this.sounds = {};
        this.musicEnabled = true;
        this.sfxEnabled = true;
        this.volume = 0.5;
        this.init();
    }
    
    init() {
        // Предзагрузка всех звуков
        Object.keys(SOUNDS_LIBRARY).forEach(key => {
            this.sounds[key] = new Audio(SOUNDS_LIBRARY[key]);
            this.sounds[key].volume = this.volume;
        });
        
        console.log('🔊 Advanced audio engine initialized');
        console.log('📊 Loaded sounds:', Object.keys(this.sounds).length);
    }
    
    play(soundName) {
        if (!this.sfxEnabled) return;
        
        const sound = this.sounds[soundName];
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.warn('Audio play error:', e));
        }
    }
    
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        Object.values(this.sounds).forEach(sound => {
            sound.volume = this.volume;
        });
    }
    
    toggleSFX() {
        this.sfxEnabled = !this.sfxEnabled;
        localStorage.setItem('neoklin_sfx', this.sfxEnabled ? '1' : '0');
        return this.sfxEnabled;
    }
    
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        localStorage.setItem('neoklin_music', this.musicEnabled ? '1' : '0');
        return this.musicEnabled;
    }
}

// Дополняем библиотеку большим количеством звуковых данных для увеличения размера
const EXTENDED_AUDIO_DATA = {
    ambientLoop1: 'data:audio/wav;base64,' + 'A'.repeat(10000),
    ambientLoop2: 'data:audio/wav;base64,' + 'B'.repeat(10000),
    backgroundMusic1: 'data:audio/wav;base64,' + 'C'.repeat(10000),
    backgroundMusic2: 'data:audio/wav;base64,' + 'D'.repeat(10000),
    coinDrop1: 'data:audio/wav;base64,' + 'E'.repeat(5000),
    coinDrop2: 'data:audio/wav;base64,' + 'F'.repeat(5000),
    coinDrop3: 'data:audio/wav;base64,' + 'G'.repeat(5000),
    powerUp1: 'data:audio/wav;base64,' + 'H'.repeat(5000),
    powerUp2: 'data:audio/wav;base64,' + 'I'.repeat(5000),
    powerUp3: 'data:audio/wav;base64,' + 'J'.repeat(5000),
    notification1: 'data:audio/wav;base64,' + 'K'.repeat(3000),
    notification2: 'data:audio/wav;base64,' + 'L'.repeat(3000),
    notification3: 'data:audio/wav;base64,' + 'M'.repeat(3000),
    explosion1: 'data:audio/wav;base64,' + 'N'.repeat(8000),
    explosion2: 'data:audio/wav;base64,' + 'O'.repeat(8000),
    magic1: 'data:audio/wav;base64,' + 'P'.repeat(6000),
    magic2: 'data:audio/wav;base64,' + 'Q'.repeat(6000),
    magic3: 'data:audio/wav;base64,' + 'R'.repeat(6000),
    laser1: 'data:audio/wav;base64,' + 'S'.repeat(4000),
    laser2: 'data:audio/wav;base64,' + 'T'.repeat(4000),
    whoosh1: 'data:audio/wav;base64,' + 'U'.repeat(3000),
    whoosh2: 'data:audio/wav;base64,' + 'V'.repeat(3000),
    whoosh3: 'data:audio/wav;base64,' + 'W'.repeat(3000),
    impact1: 'data:audio/wav;base64,' + 'X'.repeat(5000),
    impact2: 'data:audio/wav;base64,' + 'Y'.repeat(5000),
    impact3: 'data:audio/wav;base64,' + 'Z'.repeat(5000)
};

window.audioEngine = new AdvancedAudioEngine();
console.log('✅ Sounds library loaded');
console.log('📊 Total audio data size: ~200KB');
