// ===== ЕЖЕДНЕВНЫЕ ЗАДАНИЯ =====
class DailyTasksManager {
    constructor() {
        this.tasks = [];
        this.lastReset = 0;
    }
    
    init() {
        this.load();
        this.checkReset();
        this.generateTasks();
    }
    
    load() {
        const data = JSON.parse(localStorage.getItem('neoklin_daily') || '{}');
        this.tasks = data.tasks || [];
        this.lastReset = data.lastReset || 0;
    }
    
    save() {
        localStorage.setItem('neoklin_daily', JSON.stringify({
            tasks: this.tasks,
            lastReset: this.lastReset
        }));
    }
    
    checkReset() {
        const now = Date.now();
        const dayPassed = now - this.lastReset > 86400000; // 24 часа
        
        if (dayPassed) {
            this.tasks = [];
            this.lastReset = now;
            this.save();
        }
    }
    
    generateTasks() {
        if (this.tasks.length > 0) return;
        
        const pool = CONFIG.dailyTasksPool;
        const selected = shuffle(pool).slice(0, 3); // 3 задания в день
        
        this.tasks = selected.map(task => ({
            ...task,
            target: randomInt(task.min, task.max),
            progress: 0,
            completed: false
        }));
        
        this.save();
    }
    
    updateProgress(type, amount) {
        this.tasks.forEach(task => {
            if (task.type === type && !task.completed) {
                task.progress += amount;
                if (task.progress >= task.target) {
                    task.completed = true;
                    this.claimReward(task);
                }
            }
        });
        this.save();
        this.render();
    }
    
    claimReward(task) {
        window.game.data.balance += task.reward;
        window.game.save();
        
        modal('✅', 'Задание выполнено!', task.name, `+${fmt(task.reward)} NK`);
        sound.achievement();
        celebrateAchievement();
    }
    
    render() {
        const container = document.getElementById('dailyTasksContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.tasks.forEach(task => {
            const progress = Math.min((task.progress / task.target) * 100, 100);
            
            const div = document.createElement('div');
            div.className = `daily-task ${task.completed ? 'completed' : ''}`;
            div.innerHTML = `
                <div class="task-icon">${task.icon}</div>
                <div class="task-info">
                    <div class="task-name">${task.name.replace('{X}', task.target)}</div>
                    <div class="task-progress-bar">
                        <div class="task-progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="task-progress-text">${task.progress} / ${task.target}</div>
                </div>
                <div class="task-reward ${task.completed ? 'completed' : ''}">
                    ${task.completed ? '✅' : '+' + fmt(task.reward)}
                </div>
            `;
            
            container.appendChild(div);
        });
    }
}

window.dailyTasksManager = new DailyTasksManager();
console.log('✅ Daily tasks manager loaded');
