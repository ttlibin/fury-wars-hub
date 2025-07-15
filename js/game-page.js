// Game Page JavaScript

class GamePageController {
    constructor() {
        this.audioEnabled = false;
        this.backgroundMusic = null;
        this.explosionSound = null;
        this.gameIframe = null;
        this.gameLoading = null;
        
        this.init();
    }

    init() {
        // Wait for DOM to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupElements();
                this.setupEventListeners();
                this.initializeAudio();
                this.startGameLoad();
            });
        } else {
            this.setupElements();
            this.setupEventListeners();
            this.initializeAudio();
            this.startGameLoad();
        }
    }

    setupElements() {
        this.gameIframe = document.getElementById('game-iframe');
        this.gameLoading = document.getElementById('game-loading');
        this.backgroundMusic = document.getElementById('bg-music');
        this.explosionSound = document.getElementById('explosion-sound');
    }

    setupEventListeners() {
        // Audio toggle
        const audioToggle = document.getElementById('audio-toggle');
        if (audioToggle) {
            audioToggle.addEventListener('click', () => this.toggleAudio());
        }

        // Fullscreen toggle
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }

        // Help modal
        const helpBtn = document.getElementById('help-btn');
        const helpModal = document.getElementById('help-modal');
        const closeBtn = document.querySelector('.close');

        if (helpBtn && helpModal) {
            helpBtn.addEventListener('click', () => {
                helpModal.style.display = 'block';
                this.playExplosionSound();
            });
        }

        if (closeBtn && helpModal) {
            closeBtn.addEventListener('click', () => {
                helpModal.style.display = 'none';
            });
        }

        // Close modal when clicking outside
        if (helpModal) {
            window.addEventListener('click', (event) => {
                if (event.target === helpModal) {
                    helpModal.style.display = 'none';
                }
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Game iframe load events
        if (this.gameIframe) {
            this.gameIframe.addEventListener('load', () => this.onGameLoad());
            this.gameIframe.addEventListener('error', () => this.onGameError());
        }

        // Fullscreen change events
        document.addEventListener('fullscreenchange', () => this.onFullscreenChange());
        document.addEventListener('webkitfullscreenchange', () => this.onFullscreenChange());
        document.addEventListener('mozfullscreenchange', () => this.onFullscreenChange());
        document.addEventListener('MSFullscreenChange', () => this.onFullscreenChange());
    }

    initializeAudio() {
        // Set default audio volume
        if (this.backgroundMusic) {
            this.backgroundMusic.volume = 0.3;
        }
        if (this.explosionSound) {
            this.explosionSound.volume = 0.5;
        }
    }

    startGameLoad() {
        // Game should start loading automatically since src is set in HTML
        console.log('🎮 Game loading started...');
        
        // Set a timeout to hide loading if iframe doesn't trigger load event
        setTimeout(() => {
            if (this.gameLoading && this.gameLoading.style.display !== 'none') {
                this.hideLoading();
            }
        }, 10000); // 10 seconds timeout
    }

    onGameLoad() {
        console.log('🎮 Game loaded successfully!');
        this.hideLoading();
        this.playExplosionSound();
    }

    onGameError() {
        console.log('❌ Game loading failed!');
        this.showError();
    }

    hideLoading() {
        if (this.gameLoading) {
            this.gameLoading.style.display = 'none';
        }
    }

    showError() {
        if (this.gameLoading) {
            this.gameLoading.innerHTML = `
                <div style="text-align: center; color: #FF4500;">
                    <h3>⚠️ Game Loading Failed</h3>
                    <p>Please check your internet connection</p>
                    <button onclick="location.reload()" style="
                        background: #FF4500; 
                        color: white; 
                        border: none; 
                        padding: 10px 20px; 
                        border-radius: 5px; 
                        cursor: pointer;
                        margin-top: 10px;
                    ">🔄 Reload Game</button>
                </div>
            `;
        }
    }

    toggleAudio() {
        const audioBtn = document.getElementById('audio-toggle');
        
        this.audioEnabled = !this.audioEnabled;
        
        if (this.audioEnabled) {
            audioBtn.textContent = '🔊';
            audioBtn.classList.add('playing');
            this.playBackgroundMusic();
        } else {
            audioBtn.textContent = '🔇';
            audioBtn.classList.remove('playing');
            this.stopBackgroundMusic();
        }
        
        console.log(`🎵 Audio ${this.audioEnabled ? 'enabled' : 'disabled'}`);
    }

    toggleFullscreen() {
        const gameFrame = document.querySelector('.game-frame');
        
        if (!document.fullscreenElement) {
            // Enter fullscreen
            if (gameFrame.requestFullscreen) {
                gameFrame.requestFullscreen();
            } else if (gameFrame.webkitRequestFullscreen) {
                gameFrame.webkitRequestFullscreen();
            } else if (gameFrame.mozRequestFullScreen) {
                gameFrame.mozRequestFullScreen();
            } else if (gameFrame.msRequestFullscreen) {
                gameFrame.msRequestFullscreen();
            }
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
        
        this.playExplosionSound();
    }

    onFullscreenChange() {
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        
        if (document.fullscreenElement) {
            fullscreenBtn.textContent = '🔲';
            fullscreenBtn.title = 'Exit Fullscreen (F)';
        } else {
            fullscreenBtn.textContent = '🔳';
            fullscreenBtn.title = 'Enter Fullscreen (F)';
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

    handleKeyboard(e) {
        // Prevent default for our shortcuts
        switch(e.key.toLowerCase()) {
            case 'f':
                e.preventDefault();
                this.toggleFullscreen();
                break;
            case 'm':
                e.preventDefault();
                this.toggleAudio();
                break;
            case 'h':
                e.preventDefault();
                const helpModal = document.getElementById('help-modal');
                if (helpModal) {
                    helpModal.style.display = 'block';
                    this.playExplosionSound();
                }
                break;
            case 'escape':
                const helpModal2 = document.getElementById('help-modal');
                if (helpModal2 && helpModal2.style.display === 'block') {
                    helpModal2.style.display = 'none';
                }
                break;
        }
    }

    // Method to restart game
    restartGame() {
        if (this.gameIframe) {
            this.gameLoading.style.display = 'flex';
            this.gameIframe.src = this.gameIframe.src;
            this.playExplosionSound();
        }
    }

    // Method to focus on game
    focusGame() {
        if (this.gameIframe) {
            this.gameIframe.focus();
        }
    }
}

// Initialize game page controller
const gamePageController = new GamePageController();

// Expose global methods
window.GamePage = {
    restartGame: () => gamePageController.restartGame(),
    focusGame: () => gamePageController.focusGame(),
    toggleAudio: () => gamePageController.toggleAudio(),
    toggleFullscreen: () => gamePageController.toggleFullscreen()
};

// Page Visibility API - pause music when page is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        gamePageController.stopBackgroundMusic();
    } else if (gamePageController.audioEnabled) {
        gamePageController.playBackgroundMusic();
    }
});

// Global functions for game page
window.openOriginalFuryWars = function() {
    const popup = window.open(
        'https://www.miniplay.com/embed/fury-wars',
        'FuryWarsGame',
        'width=1200,height=800,scrollbars=yes,resizable=yes,toolbar=yes,location=yes,menubar=yes'
    );
    
    if (popup) {
        popup.focus();
        console.log('🚀 Fury Wars opened in new window');
        showNotification('✅ Fury Wars opened in new window!', 'success');
    } else {
        showNotification('❌ Popup blocked by browser, please allow popups and try again.', 'error');
        setTimeout(() => {
            if (confirm('Popup blocked. Would you like to open the game in a new tab?')) {
                window.open('https://www.miniplay.com/embed/fury-wars', '_blank');
            }
        }, 1000);
    }
};

window.goToOriginalFuryWars = function() {
    // SEO optimization: open in internal iframe rather than redirecting to external site
    const gameContainer = document.querySelector('.game-iframe-wrapper');
    const currentIframe = document.getElementById('game-iframe');
    
    if (gameContainer && currentIframe) {
        const userConfirm = confirm('Switch to Miniplay version of Fury Wars? (Will open in current page)');
        if (userConfirm) {
            // Show loading animation
            const loadingDiv = document.getElementById('game-loading');
            if (loadingDiv) {
                loadingDiv.style.display = 'flex';
                loadingDiv.querySelector('.loading-text').textContent = '🎮 Loading Miniplay Fury Wars...';
            }
            
            // Load Miniplay version in iframe
            currentIframe.src = 'https://www.miniplay.com/embed/fury-wars';
            
            console.log('🔗 Loading Miniplay Fury Wars within website');
        }
    } else {
        // If no iframe container, use popup method
        openOriginalFuryWars();
    }
};

// Prevent context menu on iframe
document.addEventListener('contextmenu', (e) => {
    if (e.target.tagName === 'IFRAME') {
        e.preventDefault();
    }
});

// Analytics and tracking (placeholder)
function trackGameStart() {
    console.log('📊 Game started - tracking event');
    // Add your analytics code here
}

function trackGameError() {
    console.log('📊 Game error - tracking event');
    // Add your analytics code here
}

// Initialize particle system if available
if (typeof ParticleSystem !== 'undefined') {
    const particleSystem = new ParticleSystem('particles-canvas');
    particleSystem.start();
}

console.log('🔥 Game page loaded successfully!');
console.log('💡 Keyboard shortcuts:');
console.log('   F - Toggle fullscreen');
console.log('   M - Toggle audio');
console.log('   H - Show help');
console.log('   ESC - Close help modal'); 

// 游戏页面初始化函数
function initializeGamePage(gameTitle, gameUrl) {
    console.log(`Initializing ${gameTitle}...`);
    
    // 初始化粒子系统
    if (window.initParticles) {
        window.initParticles();
    }
    
    // 设置游戏iframe
    setupGameIframe(gameUrl);
    
    // 设置控制按钮
    setupControlButtons();
    
    // 设置帮助模态框
    setupHelpModal();
    
    // 设置键盘快捷键
    setupKeyboardShortcuts();
}

// 设置游戏iframe
function setupGameIframe(gameUrl) {
    const iframe = document.getElementById('game-iframe');
    const gameLoading = document.getElementById('game-loading');
    
    if (iframe && gameLoading) {
        // 添加连接诊断
        setupGameDiagnostics(iframe, gameLoading, gameUrl);
        
        // 监听iframe加载完成
        iframe.onload = function() {
            setTimeout(() => {
                if (gameLoading) {
                    gameLoading.style.display = 'none';
                }
            }, 2000);
        };
        
        // 监听加载错误
        iframe.onerror = function() {
            showGameError(gameLoading, gameUrl);
        };
        
        // 设置超时检测
        setTimeout(() => {
            if (gameLoading && gameLoading.style.display !== 'none') {
                showGameError(gameLoading, gameUrl, 'timeout');
            }
        }, 15000);
    }
}

// 游戏诊断功能
function setupGameDiagnostics(iframe, gameLoading, gameUrl) {
    // 检测网络连接
    checkGameConnectivity(gameUrl).then(isAccessible => {
        if (!isAccessible) {
            showGameError(gameLoading, gameUrl, 'connection');
        }
    });
}

// 检查游戏连接性
async function checkGameConnectivity(gameUrl) {
    try {
        const domain = new URL(gameUrl).hostname;
        const testUrl = `https://${domain}`;
        
        // 尝试fetch请求测试连接
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

// Show game error information
function showGameError(gameLoading, gameUrl, errorType = 'general') {
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
                    <li>Check firewall or ad blocker settings</li>
                    <li>Try using a VPN</li>
                    <li>The game platform may not be available in your region</li>
                </ul>
            `;
            break;
        case 'timeout':
            errorMessage = `Game loading timeout`;
            suggestions = `
                <p>Possible solutions:</p>
                <ul>
                    <li>Network connection is slow, please be patient</li>
                    <li>Refresh the page and try again</li>
                    <li>Check network connection stability</li>
                    <li>Try accessing when network is better</li>
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
                    <li>Disable ad blockers</li>
                </ul>
            `;
    }

    gameLoading.innerHTML = `
        <div class="loading-error" style="text-align: center; padding: 20px; color: #ff6b35;">
            <h3>⚠️ ${errorMessage}</h3>
            <p style="color: #ccc; margin: 10px 0;">Game source: ${domain}</p>
            <div style="text-align: left; max-width: 300px; margin: 0 auto;">
                ${suggestions}
            </div>
            <div class="error-actions" style="margin-top: 20px;">
                <button class="control-btn" onclick="location.reload()" style="margin: 5px;">🔄 Refresh Page</button>
                <button class="control-btn" onclick="window.history.back()" style="margin: 5px;">← Go Back</button>
            </div>
        </div>
    `;
} 