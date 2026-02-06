// ===== СИСТЕМА СКИНОВ =====
class SkinsManager {
    constructor() {
        this.currentSkin = 'default';
    }
    
    init() {
        this.loadSkin();
        this.applySkin();
    }
    
    loadSkin() {
        this.currentSkin = localStorage.getItem('neoklin_skin') || 'default';
    }
    
    saveSkin() {
        localStorage.setItem('neoklin_skin', this.currentSkin);
    }
    
    buySkin(skinId) {
        const skin = CONFIG.COIN_SKINS[skinId];
        if (!skin) return false;
        
        if (skin.unlocked) {
            toast('✅ Скин уже куплен!');
            return false;
        }
        
        if (window.game.data.balance < skin.cost) {
            toast('❌ Недостаточно монет!', 'error');
            return false;
        }
        
        window.game.data.balance -= skin.cost;
        skin.unlocked = true;
        window.game.save();
        
        toast(`✅ Скин "${skin.name}" куплен!`, 'success');
        sound.buy();
        celebrateAchievement();
        this.render();
        return true;
    }
    
    selectSkin(skinId) {
        const skin = CONFIG.COIN_SKINS[skinId];
        if (!skin || !skin.unlocked) {
            toast('❌ Скин не куплен!', 'error');
            return false;
        }
        
        this.currentSkin = skinId;
        this.saveSkin();
        this.applySkin();
        
        toast(`✅ Скин "${skin.name}" активирован!`, 'success');
        sound.success();
        return true;
    }
    
    applySkin() {
        const skin = CONFIG.COIN_SKINS[this.currentSkin];
        if (!skin) return;
        
        // Применяем градиент к монете
        const coinBtn = document.querySelector('.coin-btn circle');
        if (coinBtn && skin.gradient) {
            // Обновляем SVG градиент
            const grad = document.querySelector('#cg');
            if (grad) {
                grad.innerHTML = '';
                skin.gradient.forEach((color, i) => {
                    const stop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
                    stop.setAttribute('offset', `${(i / (skin.gradient.length - 1)) * 100}%`);
                    stop.setAttribute('stop-color', color);
                    grad.appendChild(stop);
                });
            }
        }
    }
    
    render() {
        const container = document.getElementById('skinsContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        Object.keys(CONFIG.COIN_SKINS).forEach(key => {
            const skin = CONFIG.COIN_SKINS[key];
            const isActive = this.currentSkin === key;
            
            const div = document.createElement('div');
            div.className = `skin-card ${skin.unlocked ? 'unlocked' : 'locked'} ${isActive ? 'active' : ''} rarity-${skin.rarity || 'common'}`;
            div.innerHTML = `
                <div class="skin-icon">${skin.icon}</div>
                <div class="skin-name">${skin.name}</div>
                ${skin.rarity ? `<div class="skin-rarity">${skin.rarity.toUpperCase()}</div>` : ''}
                <div class="skin-cost">
                    ${skin.unlocked ? (isActive ? 'АКТИВЕН' : 'Выбрать') : fmt(skin.cost) + ' NK'}
                </div>
            `;
            
            div.onclick = () => {
                if (skin.unlocked) {
                    this.selectSkin(key);
                } else {
                    this.buySkin(key);
                }
            };
            
            container.appendChild(div);
        });
    }
}

window.skinsManager = new SkinsManager();
console.log('✅ Skins manager loaded');
