// ===== УТИЛИТЫ =====

// Форматирование чисел
function fmt(n) {
    if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K';
    return Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Toast уведомления
function toast(msg, type = 'info') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast show ' + type;
    setTimeout(() => t.classList.remove('show'), 3000);
}

// Модальное окно
function modal(icon, title, desc, reward) {
    document.getElementById('modalIcon').textContent = icon;
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalDesc').textContent = desc;
    document.getElementById('modalReward').textContent = reward;
    document.getElementById('modal').classList.add('show');
}

function closeModal() {
    document.getElementById('modal').classList.remove('show');
}

// Валидация телефона (Казахстан)
function validatePhone(phone) {
    // +7XXXXXXXXXX или 8XXXXXXXXXX
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 11) return false;
    if (!cleaned.startsWith('7') && !cleaned.startsWith('8')) return false;
    return true;
}

// Debounce для защиты от двойных кликов
function debounce(func, wait) {
    let timeout;
    let lastCall = 0;
    return function executedFunction(...args) {
        const now = Date.now();
        if (now - lastCall < wait) {
            return;
        }
        lastCall = now;
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Генерация ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Переключение экранов
function switchScreen(s) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(`${s}-screen`).classList.add('active');
    document.querySelector(`[data-screen="${s}"]`).classList.add('active');
    
    // Обновление данных при переходе
    if (s === 'wallet' && window.game) window.game.withdrawUpdate();
    if (s === 'leaderboard' && window.leaderboard) window.leaderboard.render();
    if (s === 'social' && window.social) window.social.render();
}

// Копирование в буфер
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        toast('✅ Скопировано!', 'success');
        return true;
    } catch (err) {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        toast('✅ Скопировано!', 'success');
        return true;
    }
}

// Вибрация (если поддерживается)
function vibrate(duration = 10) {
    if (navigator.vibrate) {
        navigator.vibrate(duration);
    }
}

// Получение реферального кода из URL
function getRefCodeFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('ref');
}

// Проверка мобильного устройства
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
