// Fury Wars Main JavaScript File

class FuryWarsWebsite {
    constructor() {
        this.gameURL = 'https://maddox.page/basic-ruffle-player/html/fury_wars/index.html'; // Updated to Ruffle player link
        this.audioEnabled = false;
        this.backgroundMusic = null;
        this.explosionSound = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAudio();
        this.initializeAnimations();
        this.initializeGame(); // Initialize game, load directly
    }

    setupEventListeners() {
        // Game control buttons
        const startGameBtn = document.getElementById('start-game');
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        // const audioToggle = document.getElementById('audio-toggle'); // Audio button removed

        if (startGameBtn) {
            startGameBtn.addEventListener('click', () => this.startGame());
        }

        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }

        // Audio button removed, comment out related code
        // if (audioToggle) {
        //     audioToggle.addEventListener('click', () => this.toggleAudio());
        // }

        // Navigation smooth scrolling
        // Smooth scrolling functionality - navigation menu removed, comment out related functionality
        /*
        this.setupSmoothScrolling();
        */

        // Weapon carousel
        this.setupWeaponCarousel();

        // Click explosion effects
        this.setupClickExplosions();

        // Scroll animations
        this.setupScrollAnimations();
    }

    initializeAudio() {
        this.backgroundMusic = document.getElementById('bg-music');
        this.explosionSound = document.getElementById('explosion-sound');

        // Set default audio volume
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = 0.3;
        }
        if (this.explosionSound) {
            this.explosionSound.volume = 0.5;
        }
    }

    initializeAnimations() {
        // Add page loading animations
        const elements = document.querySelectorAll('.game-section, .features-section, .weapons-section');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.8s ease-out';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    initializeGame() {
        const iframe = document.getElementById('game-iframe');
        const gameLoading = document.getElementById('game-loading');
        
        if (iframe && gameLoading) {
            // Add connection diagnostics functionality
            this.setupGameDiagnostics(iframe, gameLoading);
            
            // Add iframe error detection
            this.setupIframeErrorDetection(iframe);
            
            // Check if iframe is already loaded
            if (iframe.contentDocument || iframe.contentWindow) {
                try {
                    // If iframe is already loaded, immediately hide loading animation
                    setTimeout(() => {
                        gameLoading.style.display = 'none';
                    }, 3000); // Give game 3 seconds to load
                } catch (e) {
                    // Cross-domain case where iframe content cannot be accessed, use timer
                    setTimeout(() => {
                        gameLoading.style.display = 'none';
                    }, 5000); // Hide loading animation after 5 seconds
                }
            }
            
            // Listen for iframe load complete event
            iframe.onload = () => {
                setTimeout(() => {
                    gameLoading.style.display = 'none';
                }, 2000); // Hide loading animation after 2 seconds
            };
            
            // If loading fails, show error message
            iframe.onerror = () => {
                this.showGameError(gameLoading, iframe.src);
            };
        }
    }

    // New: Game diagnostics functionality
    setupGameDiagnostics(iframe, gameLoading) {
        // Set timeout detection
        setTimeout(() => {
            if (gameLoading.style.display !== 'none') {
                this.showGameError(gameLoading, iframe.src);
            }
        }, 15000); // 15 second timeout

        // Check network connectivity
        this.checkGameConnectivity(iframe.src).then(isAccessible => {
            if (!isAccessible) {
                this.showGameError(gameLoading, iframe.src, 'connection');
            }
        });

        // New: iframe error detection
        this.setupIframeErrorDetection(iframe);
    }

    // New: Check game connectivity
    async checkGameConnectivity(gameUrl) {
        try {
            const domain = new URL(gameUrl).hostname;
            const testUrl = `https://${domain}`;
            
            // Try fetch request to test connection
            const response = await fetch(testUrl, { 
                method: 'HEAD', 
                mode: 'no-cors',
                cache: 'no-cache'
            });
            return true;
        } catch (error) {
            console.warn('Game connectivity check failed:', error);
            return false;
        }
    }

    // New: Show game error message
    showGameError(gameLoading, gameUrl, errorType = 'general') {
        const domain = new URL(gameUrl).hostname;
        let errorMessage = '';
        let suggestions = '';

        switch (errorType) {
            case 'connection':
                errorMessage = `Cannot connect to ${domain}`;
                suggestions = `
                    <p>Possible solutions:</p>
                    <ul>
                        <li>Check your internet connection</li>
                        <li>Try refreshing the page</li>
                        <li>Check firewall settings</li>
                        <li>Try using a VPN</li>
                    </ul>
                `;
                break;
            case 'iframe-blocked':
                errorMessage = `Game platform refuses iframe embedding`;
                suggestions = `
                    <p>This is due to security policies set by the game platform to prevent embedding on other sites:</p>
                    <ul>
                        <li><strong>X-Frame-Options</strong> or <strong>CSP</strong> security policy</li>
                        <li>Game can only be accessed directly on the original website</li>
                        <li>This is a normal security measure</li>
                    </ul>
                    <p><strong>Solutions:</strong></p>
                    <ul>
                        <li>Access the game directly on the original website</li>
                        <li>Find other game sources that support embedding</li>
                        <li>Contact the game platform for embedding permission</li>
                    </ul>
                `;
                break;
            default:
                errorMessage = `Game loading failed`;
                suggestions = `
                    <p>Possible solutions:</p>
                    <ul>
                        <li>Refresh the page and try again</li>
                        <li>Check internet connection</li>
                        <li>Clear browser cache</li>
                        <li>Try a different browser</li>
                    </ul>
                `;
        }

        // Add domain redirect detection
        this.detectDomainRedirect(gameUrl).then(redirectInfo => {
            if (redirectInfo.isRedirected) {
                errorMessage = `Game redirected to ${redirectInfo.finalDomain}`;
                suggestions = `
                    <p><strong>Domain redirect detected:</strong></p>
                    <ul>
                        <li>Original URL: ${domain}</li>
                        <li>Redirected to: ${redirectInfo.finalDomain}</li>
                        <li>Redirected domain may not support iframe embedding</li>
                    </ul>
                    <p><strong>Solutions:</strong></p>
                    <ul>
                        <li>Use the redirected URL directly</li>
                        <li>Find alternative game sources that support embedding</li>
                        <li>Contact the game platform about embedding policy</li>
                    </ul>
                `;
            }
            
            gameLoading.innerHTML = `
                <div class="loading-error">
                    <h3>⚠️ ${errorMessage}</h3>
                    <p>Game source: ${domain}</p>
                    ${redirectInfo.isRedirected ? `<p style="color: #ffd700;">🔄 Redirected to: ${redirectInfo.finalDomain}</p>` : ''}
                    ${suggestions}
                    <div class="error-actions">
                        <button class="btn btn-primary" onclick="location.reload()">🔄 Refresh Page</button>
                        <button class="btn btn-secondary" onclick="this.parentElement.parentElement.style.display='none'">❌ Close</button>
                        ${redirectInfo.isRedirected ? `<button class="btn btn-secondary" onclick="window.open('${redirectInfo.finalUrl}', '_blank')">🌐 Visit Original Site</button>` : ''}
                    </div>
                </div>
            `;
        });
    }

    // New: Detect domain redirect
    async detectDomainRedirect(gameUrl) {
        try {
            const originalDomain = new URL(gameUrl).hostname;
            
            // Try to get final redirected URL
            const response = await fetch(gameUrl, { 
                method: 'HEAD',
                mode: 'no-cors',
                redirect: 'follow'
            });
            
            // Due to CORS restrictions, we cannot get response.url
            // But we can detect through other means
            
            // Check if it's a known domain that redirects to playhop.com
            const knownRedirects = {
                'miniplay.com': ['playhop.com'],
                'gameflare.com': ['playhop.com', 'poki.com'],
                'crazygames.com': ['playhop.com'],
                'friv.com': ['playhop.com'],
                'zahraj.sk': ['playhop.com'] // New: zahraj.sk also redirects to playhop.com
            };
            
            if (knownRedirects[originalDomain]) {
                return {
                    isRedirected: true,
                    originalDomain: originalDomain,
                    finalDomain: 'playhop.com (likely)',
                    finalUrl: gameUrl,
                    reason: 'iframe embedding rejected'
                };
            }
            
            return {
                isRedirected: false,
                originalDomain: originalDomain,
                finalDomain: originalDomain,
                finalUrl: gameUrl
            };
        } catch (error) {
            console.warn('Domain redirect detection failed:', error);
            return {
                isRedirected: false,
                originalDomain: new URL(gameUrl).hostname,
                finalDomain: new URL(gameUrl).hostname,
                finalUrl: gameUrl
            };
        }
    }

    // New: iframe error detection
    setupIframeErrorDetection(iframe) {
        // Listen for iframe security policy errors
        iframe.addEventListener('error', (e) => {
            console.error('Iframe error:', e);
            this.showGameError(this.gameLoading || document.getElementById('game-loading'), iframe.src, 'iframe-blocked');
        });

        // Listen for CSP violations
        document.addEventListener('securitypolicyviolation', (e) => {
            if (e.violatedDirective === 'frame-src' || e.violatedDirective === 'frame-ancestors') {
                console.error('CSP violation:', e);
                this.showGameError(this.gameLoading || document.getElementById('game-loading'), iframe.src, 'iframe-blocked');
            }
        });

        // Check if iframe is blocked
        setTimeout(() => {
            try {
                // Try to access iframe content
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (!iframeDoc) {
                    throw new Error('Cannot access iframe content');
                }
            } catch (error) {
                if (error.name === 'SecurityError' || error.message.includes('cross-origin')) {
                    console.warn('Iframe blocked by security policy:', error);
                    this.showGameError(this.gameLoading || document.getElementById('game-loading'), iframe.src, 'iframe-blocked');
                }
            }
        }, 3000);
    }

    startGame() {
        const iframe = document.getElementById('game-iframe');
        const overlay = document.querySelector('.game-overlay');
        
        // Play explosion sound
        this.playExplosionSound();

        // Show loading animation
        overlay.innerHTML = '<div class="loading-spinner"></div>';

        // Load game
        iframe.src = this.gameURL;
        iframe.style.display = 'block';

        // Listen for iframe load completion
        iframe.onload = () => {
            overlay.style.display = 'none';
        };

        // If loading fails, show error message
        iframe.onerror = () => {
            overlay.innerHTML = `
                <div class="game-preview">
                    <h3>Game Loading Failed</h3>
                    <p>Please check your internet connection or try again later</p>
                    <button class="btn btn-primary" onclick="location.reload()">Reload Game</button>
                </div>
            `;
        };
    }

    toggleFullscreen() {
        const gameWrapper = document.querySelector('.game-iframe-wrapper');
        
        if (!document.fullscreenElement) {
            gameWrapper.requestFullscreen().catch(err => {
                console.log('Unable to enter fullscreen mode:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }

    // Open original Fury Wars in popup window
    openFuryWarsPopup() {
        const popup = window.open(
            'https://www.miniplay.com/embed/fury-wars',
            'FuryWarsGame',
            'width=1000,height=700,scrollbars=yes,resizable=yes,toolbar=yes,location=yes'
        );
        
        if (popup) {
            popup.focus();
            console.log('🚀 Original Fury Wars opened in new window');
        } else {
            alert('Popup blocked by browser, please allow popups and try again, or use the direct link button');
        }
    }

    // Direct redirect to original Fury Wars
    goToFuryWars() {
        // SEO optimization: open in internal iframe rather than redirecting to external site
        const gameContainer = document.querySelector('.game-iframe-wrapper');
        const currentIframe = document.getElementById('game-iframe');
        
        if (gameContainer && currentIframe) {
            const userConfirm = confirm('Switch to original Fury Wars? (Will open in current page)');
            if (userConfirm) {
                // Show loading animation
                const loadingDiv = document.getElementById('game-loading');
                if (loadingDiv) {
                    loadingDiv.style.display = 'flex';
                    loadingDiv.querySelector('.loading-text').textContent = '🎮 Loading original Fury Wars...';
                }
                
                // Try to load original game in iframe (although it may be blocked)
                currentIframe.src = 'https://www.miniplay.com/embed/fury-wars';
                
                // If still loading after 3 seconds, it's blocked, provide alternatives
                setTimeout(() => {
                    if (loadingDiv && loadingDiv.style.display !== 'none') {
                        loadingDiv.innerHTML = `
                            <div style="text-align: center; padding: 20px;">
                                <h3>⚠️ Unable to load original game in iframe</h3>
                                <p>Due to security policy restrictions, original Fury Wars cannot be embedded.</p>
                                <p>Please choose one of the following options:</p>
                                <button class="btn btn-primary" onclick="openFuryWarsPopup()" style="margin: 5px;">
                                    🚀 Open in New Window
                                </button>
                                <button class="btn btn-secondary" onclick="location.reload()" style="margin: 5px;">
                                    🔄 Return to Alternative Game
                                </button>
                            </div>
                        `;
                    }
                }, 3000);
                
                console.log('🔗 Trying to load original Fury Wars within website');
            }
        } else {
            // If no iframe container, use popup method
            this.openFuryWarsPopup();
        }
    }

    toggleAudio() {
        // const audioBtn = document.getElementById('audio-toggle'); // Audio button removed
        
        this.audioEnabled = !this.audioEnabled;
        
        if (this.audioEnabled) {
            // audioBtn.textContent = '🔊';
            // audioBtn.classList.add('playing');
            this.playBackgroundMusic();
        } else {
            // audioBtn.textContent = '🔇';
            // audioBtn.classList.remove('playing');
            this.stopBackgroundMusic();
        }
    }

    playBackgroundMusic() {
        if (this.backgroundMusic && this.audioEnabled) {
            this.backgroundMusic.play().catch(e => {
                console.log('Unable to play background music:', e);
            });
        }
    }

    stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
    }

    playExplosionSound() {
        if (this.explosionSound && this.audioEnabled) {
            this.explosionSound.currentTime = 0;
            this.explosionSound.play().catch(e => {
                console.log('Unable to play explosion sound:', e);
            });
        }
    }

    // Smooth scrolling functionality - navigation menu removed, comment out related functionality
    /*
    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update navigation active state
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });
    }
    */

    setupWeaponCarousel() {
        const weaponItems = document.querySelectorAll('.weapon-item');
        let currentIndex = 0;

        setInterval(() => {
            weaponItems.forEach(item => item.classList.remove('active'));
            weaponItems[currentIndex].classList.add('active');
            currentIndex = (currentIndex + 1) % weaponItems.length;
        }, 3000);

        // Click weapon items
        weaponItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                weaponItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                currentIndex = index;
                this.playExplosionSound();
            });
        });
    }

    setupClickExplosions() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createExplosionEffect(e.target, e.clientX, e.clientY);
                this.playExplosionSound();
            });
        });
    }

    createExplosionEffect(element, x, y) {
        const explosion = document.createElement('div');
        explosion.className = 'explosion-effect';
        
        // Set explosion position
        explosion.style.left = (x - 50) + 'px';
        explosion.style.top = (y - 50) + 'px';
        explosion.style.position = 'fixed';
        explosion.style.zIndex = '9999';
        
        document.body.appendChild(explosion);
        
        // Create sparkle effects
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                this.createSparkle(x, y);
            }, i * 100);
        }
        
        // Remove explosion effect
        setTimeout(() => {
            if (explosion.parentNode) {
                explosion.parentNode.removeChild(explosion);
            }
        }, 800);
    }

    createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        
        // Random position
        const offsetX = (Math.random() - 0.5) * 100;
        const offsetY = (Math.random() - 0.5) * 100;
        
        sparkle.style.left = (x + offsetX) + 'px';
        sparkle.style.top = (y + offsetY) + 'px';
        sparkle.style.position = 'fixed';
        sparkle.style.zIndex = '9999';
        
        document.body.appendChild(sparkle);
        
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, 1000);
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        // Observe elements that need animation
        const animatedElements = document.querySelectorAll('.feature-card, .weapon-item, .screenshot-item');
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Method to set game URL
    setGameURL(url) {
        this.gameURL = url;
    }

    // Method to update game preview image
    updatePreviewImage(imageUrl) {
        const previewImage = document.querySelector('.preview-image');
        if (previewImage) {
            previewImage.src = imageUrl;
        }
    }

    // 新增：使用CORS代理直接加载游戏内容
    async loadGameDirectly() {
        const gameContainer = document.getElementById('game-iframe').parentElement;
        const gameLoading = document.getElementById('game-loading');
        
        try {
            // 显示加载动画
            gameLoading.style.display = 'flex';
            gameLoading.querySelector('.loading-text').textContent = '🎮 Loading game content via proxy...';
            
            // 使用CORS代理服务
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
            const gameUrl = 'https://www.miniplay.com/embed/fury-wars';
            
            const response = await fetch(proxyUrl + gameUrl, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            if (response.ok) {
                const gameContent = await response.text();
                
                // 创建新的游戏容器
                const gameFrame = document.createElement('div');
                gameFrame.id = 'game-direct-content';
                gameFrame.style.cssText = `
                    width: 100%;
                    height: 600px;
                    border: none;
                    background: #000;
                    overflow: hidden;
                    position: relative;
                `;
                
                // 处理HTML内容，修复相对路径
                const processedContent = this.processGameContent(gameContent, 'https://www.miniplay.com');
                gameFrame.innerHTML = processedContent;
                
                // 替换iframe
                const iframe = document.getElementById('game-iframe');
                iframe.style.display = 'none';
                gameContainer.appendChild(gameFrame);
                
                // 隐藏加载动画
                gameLoading.style.display = 'none';
                
                showNotification('✅ Game content loaded directly!', 'success');
                
            } else {
                throw new Error('Proxy server response error');
            }
            
        } catch (error) {
            console.error('Direct game loading failed:', error);
            this.showDirectLoadError(gameLoading, error);
        }
    }

    // 处理游戏内容，修复相对路径和资源链接
    processGameContent(htmlContent, baseUrl) {
        // 修复相对路径
        let processedContent = htmlContent
            .replace(/src="([^"]*?)"/g, (match, src) => {
                if (src.startsWith('http') || src.startsWith('//')) {
                    return match;
                }
                return `src="${baseUrl}${src.startsWith('/') ? '' : '/'}${src}"`;
            })
            .replace(/href="([^"]*?)"/g, (match, href) => {
                if (href.startsWith('http') || href.startsWith('//') || href.startsWith('#')) {
                    return match;
                }
                return `href="${baseUrl}${href.startsWith('/') ? '' : '/'}${href}"`;
            });
        
        // 添加基础URL标签
        processedContent = processedContent.replace(
            '<head>',
            `<head><base href="${baseUrl}/">`
        );
        
        return processedContent;
    }

    // 显示直接加载错误
    showDirectLoadError(gameLoading, error) {
        gameLoading.innerHTML = `
            <div class="loading-error">
                <h3>⚠️ Direct loading failed</h3>
                <p>Error message: ${error.message}</p>
                <p>🔧 Possible solutions:</p>
                <ul>
                    <li>CORS proxy service may be temporarily unavailable</li>
                    <li>Target website may have blocked proxy access</li>
                    <li>Network connection issues</li>
                </ul>
                <div class="error-actions">
                    <button class="btn btn-primary" onclick="furyWarsWebsite.loadGameDirectly()">🔄 Retry Direct Loading</button>
                    <button class="btn btn-secondary" onclick="furyWarsWebsite.fallbackToIframe()">📱 Fallback to Iframe Mode</button>
                    <button class="btn btn-secondary" onclick="openFuryWarsPopup()">🚀 Open in New Window</button>
                </div>
            </div>
        `;
    }

    // 回退到iframe模式
    fallbackToIframe() {
        const gameContainer = document.getElementById('game-iframe').parentElement;
        const directContent = document.getElementById('game-direct-content');
        const iframe = document.getElementById('game-iframe');
        const gameLoading = document.getElementById('game-loading');
        
        if (directContent) {
            directContent.remove();
        }
        
        iframe.style.display = 'block';
        iframe.src = this.gameURL;
        gameLoading.style.display = 'none';
        
        showNotification('🔄 Fallback to iframe mode', 'info');
    }
}

// Create global website instance
const furyWarsWebsite = new FuryWarsWebsite();

// Global functions for HTML calls - SEO optimized version
window.openFuryWarsPopup = function() {
    // SEO-friendly new window opening method
    const popup = window.open(
        'https://www.miniplay.com/embed/fury-wars',
        'FuryWarsGame',
        'width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=yes,location=yes,menubar=yes'
    );
    
    if (popup) {
        popup.focus();
        console.log('🚀 Fury Wars opened in new window');
        
        // Add user experience notification
        showNotification('✅ Fury Wars opened in new window! Enjoy the classic game experience.', 'success');
        
        // Track user behavior (for SEO analysis)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'external_game_open', {
                'game_name': 'Fury Wars',
                'open_method': 'popup_window'
            });
        }
    } else {
        showNotification('❌ Popup blocked by browser, please allow popups and try again.', 'error');
        // Provide alternative
        setTimeout(() => {
            if (confirm('Popup blocked. Would you like to open the game in a new tab?')) {
                window.open('https://www.miniplay.com/embed/fury-wars', '_blank');
            }
        }, 1000);
    }
};

window.goToFuryWars = function() {
    // Removed direct redirect, changed to new window opening to maintain SEO effect
    openFuryWarsPopup();
};

// Show Fury Wars detailed information
window.showFuryWarsInfo = function() {
    const infoModal = document.createElement('div');
    infoModal.className = 'info-modal';
    infoModal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>💥 Fury Wars Online - Official Game Information</h3>
                <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="modal-body">
                <div class="game-info-detail">
                    <h4>🎮 Game Details</h4>
                    <ul>
                        <li><strong>Game Name:</strong> Fury Wars Online - Shooter</li>
                        <li><strong>Developer:</strong> APPWILL COMPANY LTD</li>
                        <li><strong>Game Type:</strong> Arcade Online Shooter</li>
                        <li><strong>Release Date:</strong> April 5, 2020</li>
                        <li><strong>Latest Update:</strong> April 1, 2025</li>
                        <li><strong>Size:</strong> 317MB</li>
                        <li><strong>Platform:</strong> iOS, Android, Web Browser</li>
                        <li><strong>Rating:</strong> 4.2/5 (Based on 161+ reviews)</li>
                    </ul>
                    
                    <h4>⭐ Unique Game Features</h4>
                    <ul>
                        <li>⚡ Electric Trident - Devastating electrical weapons with chain lightning</li>
                        <li>🦄 Dead Unicorn - Absurd magical creatures embodying black humor</li>
                        <li>🎯 Arcade Combat - Fast-paced shooting with combo multipliers</li>
                        <li>🚛 Escort Mode - Team-based payload protection missions</li>
                        <li>💰 Golden Rush - Competitive resource collection battles</li>
                        <li>💀 Deathmatch - Classic elimination-based combat</li>
                        <li>🎭 Black Humor - Unique absurd and unconventional gameplay elements</li>
                    </ul>
                    
                    <h4>🚀 Access Original Game</h4>
                    <p>Experience the full authentic Fury Wars Online with all its absurd combat mechanics and unique heroes:</p>
                    <button class="btn btn-primary" onclick="openFuryWarsPopup()">🎮 Play Original Game</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(infoModal);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .info-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }
        .info-modal .modal-content {
            background: #1a1a1a;
            border-radius: 15px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(255,69,0,0.3);
        }
        .info-modal .modal-header {
            background: linear-gradient(135deg, #ff4500, #ff6b35);
            padding: 20px;
            border-radius: 15px 15px 0 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .info-modal .modal-header h3 {
            margin: 0;
            color: white;
        }
        .info-modal .close-btn {
            background: none;
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            padding: 5px 10px;
            border-radius: 5px;
        }
        .info-modal .close-btn:hover {
            background: rgba(255,255,255,0.2);
        }
        .info-modal .modal-body {
            padding: 20px;
            color: #ddd;
        }
        .info-modal .game-info-detail h4 {
            color: #ff6b35;
            margin-top: 20px;
            margin-bottom: 10px;
        }
        .info-modal .game-info-detail ul {
            margin-bottom: 15px;
        }
        .info-modal .game-info-detail li {
            margin-bottom: 8px;
            line-height: 1.5;
        }
        .info-modal .btn {
            background: linear-gradient(135deg, #ff4500, #ff6b35);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            margin-top: 15px;
        }
        .info-modal .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255,69,0,0.4);
        }
    `;
    document.head.appendChild(style);
};

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    const style = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        max-width: 350px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.style.cssText = style;
    
    // Set color based on type
    switch(type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #f44336, #da190b)';
            break;
        case 'warning':
            notification.style.background = 'linear-gradient(135deg, #ff9800, #f57c00)';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #2196F3, #0b7dda)';
    }
    
    document.body.appendChild(notification);
    
    // Auto remove
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Add animation styles
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(animationStyle);

// Prevent right-click menu (optional)
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IFRAME') {
        e.preventDefault();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press F for fullscreen
    if (e.key === 'f' || e.key === 'F') {
        furyWarsWebsite.toggleFullscreen();
    }
    
    // Press M to toggle audio
    if (e.key === 'm' || e.key === 'M') {
        furyWarsWebsite.toggleAudio();
    }
    
    // Press Space to start game
    if (e.key === ' ') {
        e.preventDefault();
        furyWarsWebsite.startGame();
    }
});

// Add game card hover effects
document.addEventListener('DOMContentLoaded', function() {
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add stagger animation to game cards
    gameCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in-up');
    });
});

// Add CSS animation class
const style = document.createElement('style');
style.textContent = `
    .fade-in-up {
        animation: fadeInUp 0.6s ease forwards;
        opacity: 0;
        transform: translateY(30px);
    }
    
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Video-related functionality
function copyVideoLink(url) {
    if (navigator.clipboard && window.isSecureContext) {
        // Use modern clipboard API
        navigator.clipboard.writeText(url).then(() => {
            showNotification('✅ Video link copied to clipboard!', 'success');
        }).catch(err => {
            console.error('Failed to copy link:', err);
            fallbackCopyTextToClipboard(url);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyTextToClipboard(url);
    }
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification('✅ Video link copied to clipboard!', 'success');
        } else {
            showNotification('❌ Failed to copy link. Please copy manually.', 'error');
        }
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        showNotification('❌ Failed to copy link. Please copy manually.', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Initialize video animations when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Add video card hover effects
    const videoCards = document.querySelectorAll('.video-card');
    
    videoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            const playButton = this.querySelector('.play-button');
            if (playButton) {
                playButton.style.transform = 'scale(1.2)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            const playButton = this.querySelector('.play-button');
            if (playButton) {
                playButton.style.transform = 'scale(1)';
            }
        });
    });
    
    // Add stagger animation to video cards
    videoCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('fade-in-up');
    });

    // Initialize screenshot functionality
    initializeScreenshots();
});

// Screenshot functionality
function initializeScreenshots() {
    const screenshotItems = document.querySelectorAll('.screenshot-item');
    
    // Add click event to each screenshot item
    screenshotItems.forEach(item => {
        item.addEventListener('click', function() {
            const screenshotData = this.getAttribute('data-screenshot');
            const img = this.querySelector('img');
            const info = this.querySelector('.screenshot-info');
            
            if (img && info) {
                openScreenshotModal(img.src, img.alt, info.querySelector('h4').textContent, info.querySelector('p').textContent);
            }
        });
        
        // Add hover animation effects
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add stagger animation to screenshot items
    screenshotItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('fade-in-up');
    });
}

// Open screenshot modal
function openScreenshotModal(imageSrc, imageAlt, title, description) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('screenshot-modal');
    if (!modal) {
        modal = createScreenshotModal();
    }
    
    // Update modal content
    const modalImg = modal.querySelector('.screenshot-modal img');
    const modalTitle = modal.querySelector('.screenshot-modal-info h4');
    const modalDesc = modal.querySelector('.screenshot-modal-info p');
    
    if (modalImg) modalImg.src = imageSrc;
    if (modalImg) modalImg.alt = imageAlt;
    if (modalTitle) modalTitle.textContent = title;
    if (modalDesc) modalDesc.textContent = description;
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add success notification
    showNotification('🖼️ Screenshot enlarged! Press ESC to close.', 'success');
}

// Create screenshot modal
function createScreenshotModal() {
    const modal = document.createElement('div');
    modal.id = 'screenshot-modal';
    modal.className = 'screenshot-modal';
    
    modal.innerHTML = `
        <div class="screenshot-modal-content">
            <button class="screenshot-modal-close">&times;</button>
            <img src="" alt="">
            <div class="screenshot-modal-info">
                <h4></h4>
                <p></p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add close event listeners
    const closeBtn = modal.querySelector('.screenshot-modal-close');
    closeBtn.addEventListener('click', closeScreenshotModal);
    
    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeScreenshotModal();
        }
    });
    
    return modal;
}

// Close screenshot modal
function closeScreenshotModal() {
    const modal = document.getElementById('screenshot-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press F for fullscreen
    if (e.key === 'f' || e.key === 'F') {
        furyWarsWebsite.toggleFullscreen();
    }
    
    // Press M to toggle audio
    if (e.key === 'm' || e.key === 'M') {
        furyWarsWebsite.toggleAudio();
    }
    
    // Press Space to start game
    if (e.key === ' ') {
        e.preventDefault();
        furyWarsWebsite.startGame();
    }
    
    // Press ESC to close screenshot modal
    if (e.key === 'Escape') {
        closeScreenshotModal();
    }
    
    // Press Enter to open first screenshot (for accessibility)
    if (e.key === 'Enter' && e.ctrlKey) {
        const firstScreenshot = document.querySelector('.screenshot-item');
        if (firstScreenshot) {
            firstScreenshot.click();
        }
    }
});

console.log('🔥 Fury Wars website loaded successfully!');
console.log('💡 Keyboard shortcuts:');
console.log('   F - Toggle fullscreen');
console.log('   M - Toggle audio');
console.log('   Space - Start game');

// ===== Video Player Functions =====

// Video data with embedded URLs
const videoData = {
    video1: {
        title: '🔥 Fury Wars - Online Shooter Game',
        embedUrl: 'https://www.youtube.com/embed/dgscLqBVPZ8',
        description: 'Complete gameplay demonstration showcasing explosive third-person shooting mechanics'
    },
    video2: {
        title: '🚀 Fury Wars Gameplay Tactics',
        embedUrl: 'https://www.youtube.com/embed/n75lkOQFNSk',
        description: 'Essential Fury Wars gameplay featuring advanced tactics and character abilities'
    },
    video3: {
        title: '🏆 Fury Wars Master Class',
        embedUrl: 'https://www.youtube.com/embed/dgscLqBVPZ8',
        description: 'Advanced Fury Wars gameplay showcase with expert-level strategies and weapon mastery'
    }
};

// Play video function
function playVideo(videoId) {
    const videoInfo = videoData[videoId];
    if (!videoInfo) {
        console.error('Video not found:', videoId);
        return;
    }
    
    let modal = document.getElementById('video-modal');
    if (!modal) {
        modal = createVideoModal();
    }
    
    // Update modal content
    const modalTitle = modal.querySelector('#video-modal-title');
    const playerContainer = modal.querySelector('#video-player-container');
    
    modalTitle.textContent = videoInfo.title;
    
    // Show loading
    playerContainer.innerHTML = '<div class="video-loading">Loading video...</div>';
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Load video after a short delay for better UX
    setTimeout(() => {
        playerContainer.innerHTML = `
            <iframe src="${videoInfo.embedUrl}?autoplay=1&rel=0" 
                    frameborder="0" 
                    allowfullscreen 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
            </iframe>
        `;
    }, 500);
    
    // Analytics or tracking (optional)
    console.log(`🎬 Playing video: ${videoInfo.title}`);
}

// Create video modal
function createVideoModal() {
    const modal = document.createElement('div');
    modal.id = 'video-modal';
    modal.className = 'video-modal';
    
    modal.innerHTML = `
        <div class="video-modal-content">
            <div class="video-modal-header">
                <h3 id="video-modal-title">Fury Wars Gameplay Video</h3>
                <button class="video-modal-close" onclick="closeVideoModal()">✕</button>
            </div>
            <div class="video-modal-body">
                <div id="video-player-container" class="video-player-container">
                    <!-- Video will be loaded here -->
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add close event listeners
    const closeBtn = modal.querySelector('.video-modal-close');
    closeBtn.addEventListener('click', closeVideoModal);
    
    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeVideoModal();
        }
    });
    
    return modal;
}

// Close video modal
function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Stop video by clearing the container
        const playerContainer = modal.querySelector('#video-player-container');
        if (playerContainer) {
            playerContainer.innerHTML = '';
        }
    }
}

// Enhanced keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press ESC to close modals
    if (e.key === 'Escape') {
        closeVideoModal();
        closeScreenshotModal();
    }
    
    // Press V to open first video
    if (e.key === 'v' || e.key === 'V') {
        if (e.ctrlKey) {
            playVideo('video1');
        }
    }
});

// Video card hover enhancements
document.addEventListener('DOMContentLoaded', function() {
    const videoCards = document.querySelectorAll('.video-card');
    
    videoCards.forEach((card, index) => {
        // Add staggered animation
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('fade-in-up');
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            const thumbnail = this.querySelector('.video-thumbnail');
            const playOverlay = this.querySelector('.play-overlay');
            
            if (thumbnail) {
                thumbnail.style.transform = 'scale(1.05)';
            }
            if (playOverlay) {
                playOverlay.style.opacity = '1';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const thumbnail = this.querySelector('.video-thumbnail');
            const playOverlay = this.querySelector('.play-overlay');
            
            if (thumbnail) {
                thumbnail.style.transform = 'scale(1)';
            }
            if (playOverlay) {
                playOverlay.style.opacity = '0';
            }
        });
    });
});

// Initialize video functionality
function initializeVideoPlayer() {
    console.log('🎬 Video player initialized');
    console.log('💡 Additional shortcuts:');
    console.log('   ESC - Close video/screenshot modal');
    console.log('   Ctrl+V - Play first video');
}

// Call initialization
document.addEventListener('DOMContentLoaded', initializeVideoPlayer);

// ===== Video Player Functions (End) ===== 