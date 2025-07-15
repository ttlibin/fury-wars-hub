// 游戏渲染器 - 动态生成HTML和CSS
class GameRenderer {
    constructor(gameManager) {
        this.gameManager = gameManager;
    }

    // 渲染推荐游戏侧边栏
    renderRecommendedGames() {
        const container = document.querySelector('.game-thumbnails');
        if (!container) return;

        const recommendedGames = this.gameManager.getRecommendedGames();
        container.innerHTML = recommendedGames.map(game => 
            this.gameManager.generateThumbnailHTML(game)
        ).join('');
    }

    // 渲染主游戏区域
    renderMainGame() {
        const featuredGame = this.gameManager.getFeaturedGame();
        if (!featuredGame) return;

        // 更新游戏iframe
        const gameIframe = document.querySelector('.game-iframe-wrapper iframe');
        if (gameIframe && featuredGame.embedUrl) {
            gameIframe.src = featuredGame.embedUrl;
        }

        // 保留原有的详细游戏描述，不自动覆盖
        // const gameDescription = document.querySelector('.game-description p');
        // if (gameDescription) {
        //     gameDescription.textContent = featuredGame.description;
        // }
    }

    // 动态生成CSS样式
    generateDynamicCSS() {
        const styleId = 'dynamic-game-styles';
        let styleElement = document.getElementById(styleId);
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = styleId;
            document.head.appendChild(styleElement);
        }

        const css = this.gameManager.generateBackgroundCSS();
        styleElement.textContent = css;
    }

    // 初始化渲染
    init() {
        this.renderMainGame();
        this.renderRecommendedGames();
        this.generateDynamicCSS();
        this.bindEvents();
    }

    // 绑定事件
    bindEvents() {
        // 游戏缩略图点击事件
        document.addEventListener('click', (e) => {
            const thumbnail = e.target.closest('.game-thumbnail');
            if (thumbnail) {
                const gameId = parseInt(thumbnail.dataset.gameId);
                const game = this.gameManager.getGameById(gameId);
                
                if (game && game.embedUrl) {
                    this.switchMainGame(game);
                }
            }
        });
    }

    // 切换主游戏
    switchMainGame(game) {
        const gameIframe = document.querySelector('.game-iframe-wrapper iframe');
        if (gameIframe) {
            gameIframe.src = game.embedUrl;
        }

        // 保留原有的详细游戏描述，不自动覆盖
        // const gameDescription = document.querySelector('.game-description p');
        // if (gameDescription) {
        //     gameDescription.textContent = game.description;
        // }

        // 更新页面标题
        document.title = `${game.displayName} - Explosive Gaming Experience`;
    }
}

// 游戏管理工具函数
const GameUtils = {
    // 添加新游戏的便捷方法
    addNewGame: function(gameData) {
        const newGame = gameManager.addGame(gameData);
        gameRenderer.init(); // 重新渲染
        return newGame;
    },

    // 更新游戏信息的便捷方法
    updateGameInfo: function(gameId, updates) {
        const updatedGame = gameManager.updateGame(gameId, updates);
        if (updatedGame) {
            gameRenderer.init(); // 重新渲染
        }
        return updatedGame;
    },

    // 批量更新游戏链接
    updateGameLinks: function(linkUpdates) {
        linkUpdates.forEach(update => {
            gameManager.updateGame(update.id, { 
                link: update.link, 
                embedUrl: update.embedUrl 
            });
        });
        gameRenderer.init(); // 重新渲染
    },

    // 批量更新游戏图片
    updateGameImages: function(imageUpdates) {
        imageUpdates.forEach(update => {
            gameManager.updateGame(update.id, { 
                image: update.image 
            });
        });
        gameRenderer.init(); // 重新渲染
    },

    // 导出游戏数据为JSON
    exportGamesData: function() {
        const data = {
            games: gameManager.getAllGames(),
            exportDate: new Date().toISOString()
        };
        return JSON.stringify(data, null, 2);
    },

    // 从JSON导入游戏数据
    importGamesData: function(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (data.games && Array.isArray(data.games)) {
                gameManager.games = data.games;
                gameRenderer.init(); // 重新渲染
                return true;
            }
        } catch (error) {
            console.error('Import failed:', error);
        }
        return false;
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 创建游戏渲染器实例
    window.gameRenderer = new GameRenderer(gameManager);
    
    // 初始化渲染
    gameRenderer.init();
    
    // 将工具函数添加到全局作用域，方便调试和管理
    window.GameUtils = GameUtils;
    window.gameManager = gameManager;
    
    console.log('🎮 Game Data Manager initialized!');
    console.log('📊 Available games:', gameManager.getAllGames().length);
    console.log('🛠️ Use GameUtils for game management');
}); 