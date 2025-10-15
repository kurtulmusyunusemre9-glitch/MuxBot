// Registration System
class RegisterSystem {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.addModalCSS();
    }
    
    setupEventListeners() {
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
        
        // Real-time validation
        const username = document.getElementById('username');
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        const confirmPassword = document.getElementById('confirmPassword');
        
        if (username) {
            username.addEventListener('blur', () => this.validateUsername());
        }
        
        if (email) {
            email.addEventListener('blur', () => this.validateEmail());
        }
        
        if (password) {
            password.addEventListener('input', () => this.validatePassword());
        }
        
        if (confirmPassword) {
            confirmPassword.addEventListener('blur', () => this.validatePasswordMatch());
        }
    }
    
    handleRegister(e) {
        e.preventDefault();
        
        const formData = {
            fullname: document.getElementById('fullname').value.trim(),
            email: document.getElementById('email').value.trim(),
            username: document.getElementById('username').value.trim(),
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value,
            terms: document.getElementById('terms').checked
        };
        
        if (this.validateForm(formData)) {
            this.registerUser(formData);
        }
    }
    
    validateForm(data) {
        // Check all fields
        if (!data.fullname || !data.email || !data.username || !data.password) {
            this.showMessage('Lütfen tüm alanları doldurun!', 'error');
            return false;
        }
        
        // Check full name
        if (data.fullname.length < 2) {
            this.showMessage('Ad soyad en az 2 karakter olmalıdır!', 'error');
            return false;
        }
        
        // Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            this.showMessage('Geçerli bir e-posta adresi girin!', 'error');
            return false;
        }
        
        // Check username
        if (data.username.length < 3) {
            this.showMessage('Kullanıcı adı en az 3 karakter olmalıdır!', 'error');
            return false;
        }
        
        if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
            this.showMessage('Kullanıcı adı sadece harf, rakam ve _ içerebilir!', 'error');
            return false;
        }
        
        // Check password strength
        if (data.password.length < 6) {
            this.showMessage('Şifre en az 6 karakter olmalıdır!', 'error');
            return false;
        }
        
        // Check password match
        if (data.password !== data.confirmPassword) {
            this.showMessage('Şifreler eşleşmiyor!', 'error');
            return false;
        }
        
        // Check terms
        if (!data.terms) {
            this.showMessage('Kullanım şartlarını kabul etmelisiniz!', 'error');
            return false;
        }
        
        // Check if username already exists (simulate)
        const existingUsers = this.getExistingUsers();
        if (existingUsers[data.username.toLowerCase()]) {
            this.showMessage('Bu kullanıcı adı zaten kullanılıyor!', 'error');
            return false;
        }
        
        // Check if email already exists (simulate)
        const existingEmails = Object.values(existingUsers).map(u => u.email);
        if (existingEmails.includes(data.email)) {
            this.showMessage('Bu e-posta adresi zaten kayıtlı!', 'error');
            return false;
        }
        
        return true;
    }
    
    validateUsername() {
        const username = document.getElementById('username').value.trim();
        const input = document.getElementById('username');
        
        if (username.length < 3) {
            this.setInputState(input, 'error', 'En az 3 karakter');
            return false;
        }
        
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            this.setInputState(input, 'error', 'Sadece harf, rakam ve _');
            return false;
        }
        
        // Check availability
        const existingUsers = this.getExistingUsers();
        if (existingUsers[username.toLowerCase()]) {
            this.setInputState(input, 'error', 'Bu kullanıcı adı alınmış');
            return false;
        }
        
        this.setInputState(input, 'success', 'Kullanılabilir');
        return true;
    }
    
    validateEmail() {
        const email = document.getElementById('email').value.trim();
        const input = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(email)) {
            this.setInputState(input, 'error', 'Geçersiz e-posta');
            return false;
        }
        
        // Check if email exists
        const existingUsers = this.getExistingUsers();
        const existingEmails = Object.values(existingUsers).map(u => u.email);
        if (existingEmails.includes(email)) {
            this.setInputState(input, 'error', 'E-posta zaten kayıtlı');
            return false;
        }
        
        this.setInputState(input, 'success', 'Geçerli e-posta');
        return true;
    }
    
    validatePassword() {
        const password = document.getElementById('password').value;
        const input = document.getElementById('password');
        
        if (password.length < 6) {
            this.setInputState(input, 'error', 'En az 6 karakter');
            return false;
        }
        
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        const strengthText = ['Çok zayıf', 'Zayıf', 'Orta', 'İyi', 'Çok güçlü'][strength];
        const strengthColor = ['#e74c3c', '#e67e22', '#f39c12', '#27ae60', '#2ecc71'][strength];
        
        this.setInputState(input, strength >= 2 ? 'success' : 'warning', strengthText, strengthColor);
        return strength >= 2;
    }
    
    validatePasswordMatch() {
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const input = document.getElementById('confirmPassword');
        
        if (!confirmPassword) {
            this.setInputState(input, 'default', '');
            return false;
        }
        
        if (password !== confirmPassword) {
            this.setInputState(input, 'error', 'Şifreler eşleşmiyor');
            return false;
        }
        
        this.setInputState(input, 'success', 'Şifreler eşleşiyor');
        return true;
    }
    
    setInputState(input, state, message, customColor = null) {
        // Remove existing validation message
        const existingMsg = input.parentNode.querySelector('.validation-message');
        if (existingMsg) {
            existingMsg.remove();
        }
        
        // Reset input border
        input.style.borderColor = '';
        
        if (message) {
            const msgDiv = document.createElement('div');
            msgDiv.className = 'validation-message';
            msgDiv.textContent = message;
            msgDiv.style.cssText = `
                font-size: 0.8rem;
                margin-top: 0.3rem;
                font-weight: 500;
            `;
            
            switch (state) {
                case 'error':
                    input.style.borderColor = '#e74c3c';
                    msgDiv.style.color = '#e74c3c';
                    break;
                case 'success':
                    input.style.borderColor = '#27ae60';
                    msgDiv.style.color = '#27ae60';
                    break;
                case 'warning':
                    input.style.borderColor = '#f39c12';
                    msgDiv.style.color = '#f39c12';
                    break;
                default:
                    msgDiv.style.color = '#ccc';
            }
            
            if (customColor) {
                msgDiv.style.color = customColor;
            }
            
            input.parentNode.appendChild(msgDiv);
        }
    }
    
    getExistingUsers() {
        // Simulate existing users (demo accounts + registered users)
        const users = {
            'admin': { email: 'admin@muxeditor.com' },
            'user': { email: 'user@muxeditor.com' }
        };
        
        // Add users from localStorage
        const registeredUsers = JSON.parse(localStorage.getItem('muxUsers') || '{}');
        return { ...users, ...registeredUsers };
    }
    
    registerUser(data) {
        this.showMessage('Hesap oluşturuluyor...', 'info');
        
        // Simulate registration process
        setTimeout(() => {
            // Save user to localStorage
            const existingUsers = JSON.parse(localStorage.getItem('muxUsers') || '{}');
            existingUsers[data.username.toLowerCase()] = {
                name: data.fullname,
                email: data.email,
                password: data.password, // In real app, this would be hashed
                role: 'user',
                registerDate: new Date().toISOString()
            };
            
            localStorage.setItem('muxUsers', JSON.stringify(existingUsers));
            
            this.showMessage('Hesap başarıyla oluşturuldu! Giriş sayfasına yönlendiriliyorsunuz...', 'success');
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }, 1500);
    }
    
    registerWithDiscord() {
        this.showMessage('Discord ile kayıt özelliği yakında eklenecek!', 'info');
    }
    
    showMessage(message, type = 'info') {
        // Remove existing message
        const existingMessage = document.querySelector('.auth-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `auth-message ${type}`;
        messageDiv.textContent = message;
        
        // Add styles
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 1rem 2rem;
            border-radius: 10px;
            font-weight: bold;
            z-index: 1000;
            animation: slideDown 0.3s ease;
            max-width: 90%;
            text-align: center;
        `;
        
        // Set colors based on type
        switch (type) {
            case 'success':
                messageDiv.style.background = 'linear-gradient(45deg, #27ae60, #2ecc71)';
                messageDiv.style.color = 'white';
                break;
            case 'error':
                messageDiv.style.background = 'linear-gradient(45deg, #e74c3c, #c0392b)';
                messageDiv.style.color = 'white';
                break;
            case 'info':
                messageDiv.style.background = 'linear-gradient(45deg, #3498db, #2980b9)';
                messageDiv.style.color = 'white';
                break;
            default:
                messageDiv.style.background = 'rgba(45, 45, 45, 0.95)';
                messageDiv.style.color = '#ccc';
        }
        
        document.body.appendChild(messageDiv);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            if (messageDiv) {
                messageDiv.style.animation = 'slideUp 0.3s ease forwards';
                setTimeout(() => messageDiv.remove(), 300);
            }
        }, 4000);
    }
    
    addModalCSS() {
        const style = document.createElement('style');
        style.textContent = `
            /* Modal Styles */
            .modal {
                position: fixed;
                z-index: 2000;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }
            
            .modal-content {
                background: rgba(45, 45, 45, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 15px;
                padding: 0;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                border: 1px solid rgba(255, 107, 53, 0.2);
                animation: slideIn 0.3s ease;
            }
            
            .modal-header {
                background: linear-gradient(45deg, #ff6b35, #f7931e);
                color: white;
                padding: 1.5rem 2rem;
                border-radius: 15px 15px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-header h2 {
                margin: 0;
                font-size: 1.3rem;
            }
            
            .close {
                font-size: 1.8rem;
                font-weight: bold;
                cursor: pointer;
                line-height: 1;
                transition: opacity 0.3s ease;
            }
            
            .close:hover {
                opacity: 0.7;
            }
            
            .modal-body {
                padding: 2rem;
                color: white;
                line-height: 1.6;
            }
            
            .modal-body h3 {
                color: #ff6b35;
                margin-bottom: 1rem;
            }
            
            .modal-body h4 {
                color: #f7931e;
                margin: 1.5rem 0 1rem 0;
            }
            
            .modal-body ul {
                padding-left: 1.5rem;
                margin-bottom: 1rem;
            }
            
            .modal-body li {
                margin-bottom: 0.5rem;
            }
            
            .modal-footer {
                background: rgba(26, 26, 26, 0.5);
                padding: 1.5rem 2rem;
                border-radius: 0 0 15px 15px;
                text-align: center;
            }
            
            .modal-btn {
                background: linear-gradient(45deg, #ff6b35, #f7931e);
                color: white;
                border: none;
                padding: 0.8rem 2rem;
                border-radius: 25px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .modal-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(255, 107, 53, 0.3);
            }
            
            .checkbox-group {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 1.5rem;
            }
            
            .checkbox-group input[type="checkbox"] {
                width: auto;
                margin: 0;
            }
            
            .checkbox-group label {
                margin: 0;
                color: #ccc;
                font-size: 0.9rem;
                cursor: pointer;
            }
            
            .checkbox-group a {
                color: #ff6b35;
                text-decoration: none;
            }
            
            .checkbox-group a:hover {
                text-decoration: underline;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-50px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
            
            @keyframes slideUp {
                from {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize register system
let registerSystem;

window.addEventListener('DOMContentLoaded', function() {
    registerSystem = new RegisterSystem();
});

// Global functions for HTML onclick events
function showTerms() {
    document.getElementById('termsModal').style.display = 'flex';
}

function closeTerms() {
    document.getElementById('termsModal').style.display = 'none';
}

function registerWithDiscord() {
    registerSystem.registerWithDiscord();
}
