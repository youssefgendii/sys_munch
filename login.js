// Login Script

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = '123456789';

document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    if (isAdminLoggedIn()) {
        window.location.href = 'admin.html';
        return;
    }

    setupEventListeners();
    const savedLang = typeof getSavedLanguage === 'function' ? getSavedLanguage() : 'en';
    setLanguage(savedLang);
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === savedLang);
    });
});

function setupEventListeners() {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);

    // Language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            setLanguage(e.target.getAttribute('data-lang'));
        });
    });
}

function handleLogin(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    // Clear previous error
    errorMessage.classList.remove('show');

    // Validate credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        // Set login session
        sessionStorage.setItem('munch_admin_logged_in', 'true');
        sessionStorage.setItem('munch_admin_login_time', new Date().toISOString());

        // Redirect to admin
        window.location.href = 'admin.html';
    } else {
        // Show error
        const errorText = currentLanguage === 'ar' 
            ? 'اسم المستخدم أو كلمة المرور غير صحيحة'
            : 'Invalid username or password';
        
        errorMessage.textContent = errorText;
        errorMessage.classList.add('show');

        // Clear password field
        document.getElementById('password').value = '';
        document.getElementById('username').focus();
    }
}

function isAdminLoggedIn() {
    return sessionStorage.getItem('munch_admin_logged_in') === 'true';
}

function setLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    updatePageTranslations();
}
