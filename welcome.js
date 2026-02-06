// ===== СИСТЕМА РЕГИСТРАЦИИ/ОНБОРДИНГА =====
(function() {
    'use strict';
    
    const AVATARS = ['😀','😎','🤑','🥳','🤠','👑','💎','🔥','⚡','🌟','🐶','🐱','🦄','🐉','🦅','🦁','🐯','🐼','🐨','🦊'];
    
    class WelcomeSystem {
        constructor() {
            this.selectedAvatar = null;
            this.checkAndInit();
        }
        
        checkAndInit() {
            const registered = localStorage.getItem('neoklin_registered');
            
            if (!registered) {
                // Первый запуск - показываем регистрацию
                this.showWelcome();
            } else {
                // Уже зарегистрирован - сразу запускаем игру
                this.initGame();
            }
        }
        
        showWelcome() {
            console.log('🎮 Показываю экран регистрации...');
            
            const screen = document.getElementById('welcomeScreen');
            if (!screen) {
                console.error('Welcome screen not found!');
                this.initGame(); // Запускаем игру без регистрации
                return;
            }
            
            screen.style.display = 'flex';
            
            // Рендерим аватары
            this.renderAvatars();
            
            // Навешиваем обработчик на кнопку старта
            const btn = document.getElementById('startGameBtn');
            if (btn) {
                btn.onclick = () => this.completeRegistration();
            }
            
            // Enter в поле имени
            const nameInput = document.getElementById('nameInput');
            if (nameInput) {
                nameInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.completeRegistration();
                    }
                });
            }
        }
        
        renderAvatars() {
            const grid = document.getElementById('avatarGrid');
            if (!grid) return;
            
            grid.innerHTML = '';
            AVATARS.forEach(emoji => {
                const div = document.createElement('div');
                div.className = 'avatar-option';
                div.textContent = emoji;
                div.onclick = () => this.selectAvatar(emoji, div);
                grid.appendChild(div);
            });
        }
        
        selectAvatar(emoji, element) {
            // Убираем выделение со всех
            document.querySelectorAll('.avatar-option').forEach(el => {
                el.classList.remove('selected');
            });
            
            // Выделяем выбранный
            element.classList.add('selected');
            this.selectedAvatar = emoji;
        }
        
        completeRegistration() {
            const nameInput = document.getElementById('nameInput');
            const name = nameInput ? nameInput.value.trim() : '';
            
            // Валидация
            if (!this.selectedAvatar) {
                toast('❌ Выбери аватар!', 'error');
                return;
            }
            
            if (!name || name.length < 2) {
                toast('❌ Введи имя (минимум 2 символа)!', 'error');
                return;
            }
            
            // Сохраняем данные
            localStorage.setItem('neoklin_name', name);
            localStorage.setItem('neoklin_avatar', this.selectedAvatar);
            localStorage.setItem('neoklin_registered', '1');
            
            // Скрываем экран регистрации
            const screen = document.getElementById('welcomeScreen');
            if (screen) {
                screen.style.display = 'none';
            }
            
            toast(`✅ Добро пожаловать, ${name}!`, 'success');
            sound.success();
            
            // Запускаем игру
            this.initGame();
        }
        
        initGame() {
            console.log('🎮 Инициализация игры...');
            
            // Инициализируем UI
            if (window.ui) {
                window.ui.init();
            }
            
            // Создаем экземпляр игры
            window.game = new Game();
            
            console.log('✅ Игра запущена!');
        }
    }
    
    // Запускаем при загрузке DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new WelcomeSystem();
        });
    } else {
        new WelcomeSystem();
    }
    
})();

console.log('✅ Welcome system loaded');
