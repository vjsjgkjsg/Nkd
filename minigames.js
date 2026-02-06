// ===== МИНИ-ИГРЫ =====
class MinigamesManager {
    constructor() {
        this.spinning = false;
    }
    
    spinWheel() {
        if (this.spinning) return;
        
        const cost = CONFIG.MINIGAMES.wheel.cost;
        if (window.game.data.balance < cost) {
            toast('❌ Недостаточно монет!', 'error');
            return;
        }
        
        window.game.data.balance -= cost;
        window.game.save();
        
        this.spinning = true;
        
        // Анимация вращения
        const prizes = CONFIG.MINIGAMES.wheel.prizes;
        const prize = prizes[Math.floor(Math.random() * prizes.length)];
        
        setTimeout(() => {
            this.spinning = false;
            window.game.data.balance += prize;
            window.game.save();
            window.game.update();
            
            modal('🎰', 'Колесо фортуны!', 'Выигрыш:', `+${fmt(prize)} NK`);
            sound.achievement();
        }, 2000);
    }
    
    playSlots() {
        const cost = CONFIG.MINIGAMES.slots.cost;
        if (window.game.data.balance < cost) {
            toast('❌ Недостаточно монет!', 'error');
            return;
        }
        
        window.game.data.balance -= cost;
        
        const multipliers = CONFIG.MINIGAMES.slots.multipliers;
        const mult = multipliers[Math.floor(Math.random() * multipliers.length)];
        const win = cost * mult;
        
        window.game.data.balance += win;
        window.game.save();
        window.game.update();
        
        if (win > cost) {
            modal('🎰', 'Слоты!', `Множитель x${mult}`, `+${fmt(win - cost)} NK`);
            sound.success();
        } else {
            toast('💔 Не повезло...', 'error');
        }
    }
    
    rollDice() {
        const cost = CONFIG.MINIGAMES.dice.cost;
        if (window.game.data.balance < cost) {
            toast('❌ Недостаточно монет!', 'error');
            return;
        }
        
        window.game.data.balance -= cost;
        
        const roll = Math.floor(Math.random() * 6) + 1;
        const win = cost * roll;
        
        window.game.data.balance += win;
        window.game.save();
        window.game.update();
        
        modal('🎲', 'Кости!', `Выпало: ${roll}`, `+${fmt(win)} NK`);
        sound.success();
    }
    
    flipCoin() {
        const cost = CONFIG.MINIGAMES.coinflip.cost;
        if (window.game.data.balance < cost) {
            toast('❌ Недостаточно монет!', 'error');
            return;
        }
        
        window.game.data.balance -= cost;
        
        const win = Math.random() < 0.5;
        
        if (win) {
            const prize = cost * CONFIG.MINIGAMES.coinflip.multiplier;
            window.game.data.balance += prize;
            modal('🪙', 'Монетка!', 'ВЫИГРЫШ!', `+${fmt(prize)} NK`);
            sound.achievement();
        } else {
            toast('💔 Проигрыш...', 'error');
        }
        
        window.game.save();
        window.game.update();
    }
}

window.minigamesManager = new MinigamesManager();
console.log('✅ Minigames manager loaded');
