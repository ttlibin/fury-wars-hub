// Game data structured management
const gamesData = {
    "fury-wars": {
        id: "fury-wars",
        title: "Fury Wars",
        description: "Explosive third-person shooter game with unique weapons and humorous characters",
        category: "Shooting Games",
        tags: ["shooter", "multiplayer", "third-person", "explosive", "action", "online"],
        rating: 4.8,
        embedUrl: "https://maddox.page/basic-ruffle-player/html/fury_wars/index.html", // Updated to Ruffle player link
        directUrl: "https://www.miniplay.com/embed/fury-wars",
        thumbnail: "images/fury-wars-thumbnail.jpg",
        screenshots: [
            "images/fury-wars-1.jpg",
            "images/fury-wars-2.jpg",
            "images/fury-wars-3.jpg"
        ],
        features: [
            "Explosive third-person shooter action",
            "Unique weapon system and characters", 
            "Perfect iframe embedding support",
            "Multiplayer online battles",
            "Free to play browser game"
        ],
        controls: {
            "WASD": "Character movement",
            "Mouse": "View control and shooting",
            "Space": "Jump/Ultimate ability",
            "Shift": "Sprint run",
            "R": "Reload weapon"
        },
        tips: [
            "Master weapon switching for different combat ranges",
            "Use cover effectively to avoid enemy fire",
            "Team coordination is key in multiplayer modes",
            "Supports fullscreen mode for best gaming experience"
        ]
    }
};

// Game data management class
class GameDataManager {
    constructor() {
        this.games = gamesData;
    }

    // Get all games
    getAllGames() {
        return this.games;
    }

    // Get specific game
    getGameById(id) {
        return this.games.find(game => game.id === id);
    }

    // Get featured game
    getFeaturedGame() {
        return this.games.find(game => game.featured);
    }

    // Get recommended games (all games)
    getRecommendedGames() {
        return this.games; // Return all games, including featured games
    }

    // Add new game
    addGame(gameData) {
        const newId = Math.max(...this.games.map(g => g.id)) + 1;
        const newGame = {
            id: newId,
            ...gameData
        };
        this.games.push(newGame);
        return newGame;
    }

    // Update game information
    updateGame(id, updates) {
        const gameIndex = this.games.findIndex(game => game.id === id);
        if (gameIndex !== -1) {
            this.games[gameIndex] = { ...this.games[gameIndex], ...updates };
            return this.games[gameIndex];
        }
        return null;
    }

    // Delete game
    deleteGame(id) {
        const gameIndex = this.games.findIndex(game => game.id === id);
        if (gameIndex !== -1) {
            const deletedGame = this.games.splice(gameIndex, 1)[0];
            return deletedGame;
        }
        return null;
    }

    // Generate game thumbnail HTML
    generateThumbnailHTML(game) {
        return `
            <a href="${game.link}" class="game-thumbnail" data-game-id="${game.id}">
                <div class="game-thumb-bg">
                    <div class="game-thumb-overlay">
                        <h4>${game.name}</h4>
                        <span class="game-genre">${game.genre}</span>
                    </div>
                </div>
            </a>
        `;
    }

    // Generate recommended games list HTML
    generateRecommendedGamesHTML() {
        const recommendedGames = this.getRecommendedGames();
        return recommendedGames.map(game => this.generateThumbnailHTML(game)).join('');
    }

    // Generate CSS background image style
    generateBackgroundCSS() {
        const recommendedGames = this.getRecommendedGames();
        return recommendedGames.map((game, index) => {
            const childIndex = index + 1;
            const imageUrl = game.image ? `url('../images/${game.image}'), ` : '';
            const gradient = `linear-gradient(135deg, ${game.gradientColors[0]}, ${game.gradientColors[1]})`;
            
            return `.game-thumbnail:nth-child(${childIndex}) .game-thumb-bg {
    background-image: ${imageUrl}${gradient};
}`;
        }).join('\n\n');
    }
}

// Create global game data manager instance
const gameManager = new GameDataManager();

// Export for other files to use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { gamesData, GameDataManager, gameManager };
} 