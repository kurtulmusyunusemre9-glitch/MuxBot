// Modern JavaScript with ES6+ features
class MuxWebsite {
    constructor() {
        this.init();
    }

    init() {
        // DOM yüklendikten sonra başlat
        document.addEventListener('DOMContentLoaded', () => {
            this.initLoader();
            this.initNavigation();
            this.initScrollEffects();
            this.initFormHandling();
            this.initAnimations();
            this.initDiscordBot();
        });
    }

    // Loading Screen
    initLoader() {
        const loadingScreen = document.getElementById('loadingScreen');
        
        // 2 saniye sonra loading'i kaldır
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            // 500ms sonra tamamen kaldır
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 2000);
    }

    // Navigation
    initNavigation() {
        const navbar = document.getElementById('navbar');
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Scroll effect
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // Mobile menu toggle
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Navigation handling - sayfalar arası geçiş
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Eğer hash link ise (# ile başlıyorsa), smooth scroll yap
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetSection = document.getElementById(targetId);
                    
                    if (targetSection) {
                        // Aktif linki güncelle
                        navLinks.forEach(l => l.classList.remove('active'));
                        link.classList.add('active');
                        
                        // Smooth scroll
                        targetSection.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                } else {
                    // Sayfa geçişi için preventDefault yapma, normal link davranışı
                    // Mobile menüyü kapat
                    if (navMenu.classList.contains('active')) {
                        navToggle.classList.remove('active');
                        navMenu.classList.remove('active');
                        document.body.classList.remove('menu-open');
                    }
                }
            });
        });

        // Intersection Observer for active nav links
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -80% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        // Observe all sections
        document.querySelectorAll('section[id]').forEach(section => {
            observer.observe(section);
        });
    }

    // Scroll Effects
    initScrollEffects() {
        // Parallax effect for hero background
        const heroBg = document.querySelector('.hero-bg');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = scrolled * 0.5;
            
            if (heroBg) {
                heroBg.style.transform = `translateY(${parallaxSpeed}px)`;
            }
        });

        // Reveal animations on scroll
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -100px 0px',
            threshold: 0.1
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for reveal animation
        const revealElements = document.querySelectorAll('.service-card, .package-card, .contact-item');
        revealElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            revealObserver.observe(el);
        });
    }

    // Form Handling
    initFormHandling() {
        const contactForm = document.getElementById('contactForm');
        
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = new FormData(contactForm);
                const data = Object.fromEntries(formData.entries());
                
                // Form verilerini konsola yazdır (gerçek uygulamada server'a gönderilir)
                console.log('Form verileri:', data);
                
                // Success message
                this.showNotification('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.', 'success');
                
                // Form'u temizle
                contactForm.reset();
            });
        }
    }

    // Animations
    initAnimations() {
        // Counter animation for stats
        const statsNumbers = document.querySelectorAll('.stat-number');
        
        const animateCounter = (element) => {
            const target = parseInt(element.textContent.replace(/\D/g, ''));
            const duration = 2000;
            const start = 0;
            const increment = target / (duration / 16);
            let current = start;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
            }, 16);
        };

        // Observe stats section
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    statsNumbers.forEach(stat => animateCounter(stat));
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.querySelector('.stats');
        if (statsSection) {
            statsObserver.observe(statsSection);
        }
    }

    // Discord Bot Integration
    initDiscordBot() {
        const discordBtn = document.getElementById('discordBtn');
        
        if (discordBtn) {
            discordBtn.addEventListener('click', () => {
                // Discord bot invite link (gerçek bir bot URL'si ile değiştirilmeli)
                const botInviteUrl = 'https://discord.com/oauth2/authorize?client_id=YOUR_BOT_CLIENT_ID&permissions=8&scope=bot%20applications.commands';
                
                // Yeni sekmede aç
                window.open(botInviteUrl, '_blank');
                
                this.showNotification('Discord bot davet linki yeni sekmede açılıyor!', 'info');
            });
        }
    }

    // Utility Functions
    showNotification(message, type = 'info') {
        // Notification element oluştur
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Style ekle
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 400px;
            padding: 1rem;
            background: ${type === 'success' ? 'rgba(34, 197, 94, 0.9)' : type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(59, 130, 246, 0.9)'};
            color: white;
            border-radius: 12px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
        `;

        // DOM'a ekle
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.hideNotification(notification);
        });

        // Auto hide after 5 seconds
        setTimeout(() => {
            this.hideNotification(notification);
        }, 5000);
    }

    hideNotification(notification) {
        if (notification && notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }

    // Smooth scroll to section
    scrollToSection(sectionId) {
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// Global function for button onclick
function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Initialize website
const muxWebsite = new MuxWebsite();

// Authentication functions
function checkAuthentication() {
    const authData = localStorage.getItem('muxAuth');
    const userInfo = document.getElementById('userInfo');
    const loginSection = document.getElementById('loginSection');
    const userName = document.getElementById('userName');
    
    if (authData) {
        try {
            const sessionData = JSON.parse(authData);
            const loginTime = new Date(sessionData.loginTime);
            const now = new Date();
            const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
            
            // Check if session is still valid (24 hours)
            if (hoursDiff < 24) {
                // User is logged in
                if (userInfo && loginSection && userName) {
                    userInfo.style.display = 'block';
                    loginSection.style.display = 'none';
                    userName.textContent = sessionData.name || sessionData.username;
                }
                return sessionData;
            } else {
                // Session expired
                localStorage.removeItem('muxAuth');
            }
        } catch (error) {
            localStorage.removeItem('muxAuth');
        }
    }
    
    // User is not logged in
    if (userInfo && loginSection) {
        userInfo.style.display = 'none';
        loginSection.style.display = 'block';
    }
    
    return null;
}

function logout() {
    localStorage.removeItem('muxAuth');
    
    // Show notification
    if (typeof muxWebsite !== 'undefined' && muxWebsite.showNotification) {
        muxWebsite.showNotification('Başarıyla çıkış yapıldı!', 'success');
    }
    
    // Redirect to login page after a delay
    setTimeout(() => {
        window.location.href = 'http://localhost:3000/auth/login';
    }, 1500);
}

// Check authentication when page loads
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
});

// Additional features
document.addEventListener('DOMContentLoaded', () => {
    // Add some extra interactive features
    
    // Package cards hover effect
    const packageCards = document.querySelectorAll('.package-card');
    packageCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = card.classList.contains('featured') 
                ? 'scale(1.05) translateY(-10px)' 
                : 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = card.classList.contains('featured') 
                ? 'scale(1.05)' 
                : 'translateY(0)';
        });
    });

    // Service cards interactive effect
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            // Add pulse effect
            card.style.animation = 'pulse 0.6s ease-in-out';
            setTimeout(() => {
                card.style.animation = '';
            }, 600);
        });
    });

    // Normal mouse cursor - custom cursor kaldırıldı
});
