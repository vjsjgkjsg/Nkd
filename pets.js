// ===== СИСТЕМА ПИТОМЦЕВ =====
class PetsManager {
    constructor() {
        this.activePets = [];
    }
    
    init() {
        this.loadPets();
        this.applyBonuses();
    }
    
    loadPets() {
        const data = JSON.parse(localStorage.getItem('neoklin_pets') || '{}');
        this.activePets = data.active || [];
    }
    
    savePets() {
        localStorage.setItem('neoklin_pets', JSON.stringify({
            active: this.activePets
        }));
    }
    
    buyPet(petId) {
        const pet = CONFIG.PETS[petId];
        if (!pet) return false;
        
        if (window.game.data.balance < pet.cost) {
            toast('❌ Недостаточно монет!', 'error');
            return false;
        }
        
        window.game.data.balance -= pet.cost;
        this.activePets.push({ id: petId, level: 1 });
        this.savePets();
        window.game.save();
        
        toast(`✅ Питомец ${pet.name} куплен!`, 'success');
        sound.success();
        this.render();
        return true;
    }
    
    upgradePet(petId) {
        const petData = this.activePets.find(p => p.id === petId);
        if (!petData) return false;
        
        const pet = CONFIG.PETS[petId];
        const cost = pet.cost * Math.pow(1.5, petData.level);
        
        if (petData.level >= pet.maxLevel) {
            toast('✅ Максимальный уровень!');
            return false;
        }
        
        if (window.game.data.balance < cost) {
            toast('❌ Недостаточно монет!', 'error');
            return false;
        }
        
        window.game.data.balance -= cost;
        petData.level++;
        this.savePets();
        window.game.save();
        
        toast(`✅ ${pet.name} → Ур. ${petData.level}!`, 'success');
        sound.buy();
        this.render();
        return true;
    }
    
    applyBonuses() {
        // Применяем бонусы от питомцев
        let totalBonus = 0;
        this.activePets.forEach(petData => {
            const pet = CONFIG.PETS[petData.id];
            if (pet) {
                totalBonus += pet.bonus * petData.level;
            }
        });
        return totalBonus;
    }
    
    render() {
        const container = document.getElementById('petsContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        Object.keys(CONFIG.PETS).forEach(key => {
            const pet = CONFIG.PETS[key];
            const owned = this.activePets.find(p => p.id === key);
            
            const div = document.createElement('div');
            div.className = `pet-card ${owned ? 'owned' : ''}`;
            div.innerHTML = `
                <div class="pet-icon">${pet.icon}</div>
                <div class="pet-info">
                    <div class="pet-name">${pet.name}</div>
                    <div class="pet-desc">${pet.description}</div>
                    <div class="pet-bonus">+${(pet.bonus * 100).toFixed(0)}% ${pet.type}</div>
                    ${owned ? `<div class="pet-level">Уровень: ${owned.level}/${pet.maxLevel}</div>` : ''}
                </div>
                <div class="pet-cost">${owned ? 'Прокачать' : fmt(pet.cost) + ' NK'}</div>
            `;
            
            div.onclick = () => {
                if (owned) {
                    this.upgradePet(key);
                } else {
                    this.buyPet(key);
                }
            };
            
            container.appendChild(div);
        });
    }
}

window.petsManager = new PetsManager();
console.log('✅ Pets manager loaded');
