// Authentication System
class AuthSystem {
    constructor() {
        this.users = {
            // Demo accounts
            'admin': {
                password: 'admin123',
                role: 'admin',
                name: 'Admin',
                email: 'admin@muxeditor.com'
            },
            'user': {
                password: 'user123',
                role: 'user',
                name: 'Test User',
                email: 'user@muxeditor.com'
            }
        };
        
        this.discordConfig = {
            clientId: '1423310486581018764',
            redirectUri: window.location.origin + '/website/auth/login.html',
            scope: 'identify email'
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.checkDiscordCallback();
        this.checkExistingSession();
    }
    
    setupEventListeners() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
    }
    
    handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            this.showMessage('Lütfen tüm alanları doldurun!', 'error');
            return;
        }
        
        this.authenticate(username, password);
    }
    
    authenticate(username, password) {
        const user = this.users[username.toLowerCase()];
        
        if (user && user.password === password) {
            this.loginSuccess(user, username);
        } else {
            this.showMessage('Kullanıcı adı veya şifre hatalı!', 'error');
        }
    }
    
    loginSuccess(user, username) {
        // Store session
        const sessionData = {
            username: username,
            role: user.role,
            name: user.name,
            email: user.email,
            loginTime: new Date().toISOString(),
            loginMethod: 'password'
        };
        
        localStorage.setItem('muxAuth', JSON.stringify(sessionData));
        
        this.showMessage(`Hoş geldin ${user.name}! Yönlendiriliyorsun...`, 'success');
        
        setTimeout(() => {
            if (user.role === 'admin') {
                window.location.href = '/admin';
            } else {
                window.location.href = '/mainmenu';
            }
        }, 1500);
    }
    
    loginWithDiscord() {
        const authUrl = `https://discord.com/api/oauth2/authorize?client_id=${this.discordConfig.clientId}&redirect_uri=${encodeURIComponent(this.discordConfig.redirectUri)}&response_type=code&scope=${this.discordConfig.scope}`;
        window.location.href = authUrl;
    }
    
    async checkDiscordCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (code) {
            try {
                this.showMessage('Discord ile giriş yapılıyor...', 'info');
                
                // Simulate Discord authentication (in real app, you'd make actual Discord API calls)
                setTimeout(() => {
                    const discordUser = {
                        username: 'discord_user',
                        role: 'user',
                        name: 'Discord User',
                        email: 'discord@user.com'
                    };
                    
                    const sessionData = {
                        username: discordUser.username,
                        role: discordUser.role,
                        name: discordUser.name,
                        email: discordUser.email,
                        loginTime: new Date().toISOString(),
                        loginMethod: 'discord'
                    };
                    
                    localStorage.setItem('muxAuth', JSON.stringify(sessionData));
                    
                    // Clean URL
                    window.history.replaceState({}, document.title, window.location.pathname);
                    
                    this.loginSuccess(discordUser, discordUser.username);
                }, 2000);
                
            } catch (error) {
                console.error('Discord login error:', error);
                this.showMessage('Discord girişinde hata oluştu!', 'error');
            }
        }
    }
    
    checkExistingSession() {
        const existingAuth = localStorage.getItem('muxAuth');
        if (existingAuth) {
            try {
                const sessionData = JSON.parse(existingAuth);
                const loginTime = new Date(sessionData.loginTime);
                const now = new Date();
                const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
                
                // Session expires after 24 hours
                if (hoursDiff < 24) {
                    this.showMessage('Zaten giriş yapmışsınız. Yönlendiriliyorsunuz...', 'info');
                    setTimeout(() => {
                        if (sessionData.role === 'admin') {
                            window.location.href = '/admin';
                        } else {
                            window.location.href = '/mainmenu';
                        }
                    }, 1500);
                    return;
                } else {
                    // Session expired
                    localStorage.removeItem('muxAuth');
                }
            } catch (error) {
                localStorage.removeItem('muxAuth');
            }
        }
    }
    
    fillAdminDemo() {
        document.getElementById('username').value = 'admin';
        document.getElementById('password').value = 'admin123';
        this.showMessage('Admin demo hesabı bilgileri dolduruldu', 'info');
    }
    
    fillUserDemo() {
        document.getElementById('username').value = 'user';
        document.getElementById('password').value = 'user123';
        this.showMessage('Kullanıcı demo hesabı bilgileri dolduruldu', 'info');
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
    
    static checkAuth() {
        const authData = localStorage.getItem('muxAuth');
        if (!authData) return null;
        
        try {
            const sessionData = JSON.parse(authData);
            const loginTime = new Date(sessionData.loginTime);
            const now = new Date();
            const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
            
            // Check if session is still valid (24 hours)
            if (hoursDiff < 24) {
                return sessionData;
            } else {
                localStorage.removeItem('muxAuth');
                return null;
            }
        } catch (error) {
            localStorage.removeItem('muxAuth');
            return null;
        }
    }
    
    static logout() {
        localStorage.removeItem('muxAuth');
        window.location.href = '/website/auth/login.html';
    }
}

// Initialize auth system when page loads
let authSystem;

window.addEventListener('DOMContentLoaded', function() {
    authSystem = new AuthSystem();
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
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
});

// Global functions for HTML onclick events
function loginWithDiscord() {
    authSystem.loginWithDiscord();
}

function fillAdminDemo() {
    authSystem.fillAdminDemo();
}

function fillUserDemo() {
    authSystem.fillUserDemo();
}

// Export for use in other files
window.AuthSystem = AuthSystem;
