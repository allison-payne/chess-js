// Game Storage Manager
// Handles saving and loading chess games to/from localStorage

export interface SavedGame {
  id: string;
  name: string;
  fen: string; // Current board position
  pgn: string; // Move history in PGN format
  gameMode: "pvp" | "ai";
  currentTurn: "w" | "b";
  gameStatus: "playing" | "checkmate" | "stalemate" | "draw";
  lastMove: { from: string; to: string } | null;
  createdAt: string; // ISO date string
  lastModified: string; // ISO date string
  moveCount: number;
  timeSpent?: number; // Optional: total time spent on game in seconds
}

export interface GameStorageSettings {
  autoSave: boolean;
  maxSavedGames: number;
}

class GameStorage {
  private readonly STORAGE_KEY = "chess-game-saves";
  private readonly SETTINGS_KEY = "chess-game-storage-settings";
  private readonly AUTO_SAVE_KEY = "chess-game-autosave";

  private settings: GameStorageSettings = {
    autoSave: true,
    maxSavedGames: 10,
  };

  constructor() {
    this.loadSettings();
  }

  // Settings Management
  private loadSettings(): void {
    try {
      const stored = localStorage.getItem(this.SETTINGS_KEY);
      if (stored) {
        this.settings = { ...this.settings, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn("Failed to load storage settings:", error);
    }
  }

  saveSettings(settings: Partial<GameStorageSettings>): void {
    this.settings = { ...this.settings, ...settings };
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(this.settings));
    } catch (error) {
      console.error("Failed to save storage settings:", error);
    }
  }

  getSettings(): GameStorageSettings {
    return { ...this.settings };
  }

  // Game Saving
  saveGame(
    gameData: Omit<SavedGame, "id" | "createdAt" | "lastModified">
  ): SavedGame {
    const now = new Date().toISOString();
    const game: SavedGame = {
      ...gameData,
      id: this.generateGameId(),
      createdAt: now,
      lastModified: now,
    };

    try {
      const savedGames = this.getAllSavedGames();

      // Check if we need to remove old saves to stay within limit
      if (savedGames.length >= this.settings.maxSavedGames) {
        // Remove oldest games (keep maxSavedGames - 1 to make room for new one)
        const sortedGames = savedGames.sort(
          (a, b) =>
            new Date(a.lastModified).getTime() -
            new Date(b.lastModified).getTime()
        );
        const gamesToKeep = sortedGames.slice(
          -(this.settings.maxSavedGames - 1)
        );
        this.saveAllGames(gamesToKeep);
      }

      // Add new game
      const updatedGames = [...this.getAllSavedGames(), game];
      this.saveAllGames(updatedGames);

      return game;
    } catch (error) {
      console.error("Failed to save game:", error);
      throw new Error("Failed to save game to storage");
    }
  }

  // Auto-save current game state
  autoSaveGame(
    gameData: Omit<SavedGame, "id" | "name" | "createdAt" | "lastModified">
  ): void {
    if (!this.settings.autoSave) return;

    try {
      const autoSaveGame: SavedGame = {
        ...gameData,
        id: "autosave",
        name: "Auto-saved Game",
        createdAt: new Date().toISOString(),
        lastModified: new Date().toISOString(),
      };

      localStorage.setItem(this.AUTO_SAVE_KEY, JSON.stringify(autoSaveGame));
    } catch (error) {
      console.warn("Auto-save failed:", error);
    }
  }

  // Load auto-saved game
  loadAutoSavedGame(): SavedGame | null {
    try {
      const stored = localStorage.getItem(this.AUTO_SAVE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn("Failed to load auto-saved game:", error);
      return null;
    }
  }

  // Game Loading
  loadGame(gameId: string): SavedGame | null {
    try {
      const savedGames = this.getAllSavedGames();
      return savedGames.find((game) => game.id === gameId) || null;
    } catch (error) {
      console.error("Failed to load game:", error);
      return null;
    }
  }

  // Update existing game
  updateGame(
    gameId: string,
    updates: Partial<Omit<SavedGame, "id" | "createdAt">>
  ): SavedGame | null {
    try {
      const savedGames = this.getAllSavedGames();
      const gameIndex = savedGames.findIndex((game) => game.id === gameId);

      if (gameIndex === -1) return null;

      const updatedGame = {
        ...savedGames[gameIndex],
        ...updates,
        lastModified: new Date().toISOString(),
      };

      savedGames[gameIndex] = updatedGame;
      this.saveAllGames(savedGames);

      return updatedGame;
    } catch (error) {
      console.error("Failed to update game:", error);
      return null;
    }
  }

  // Delete game
  deleteGame(gameId: string): boolean {
    try {
      const savedGames = this.getAllSavedGames();
      const filteredGames = savedGames.filter((game) => game.id !== gameId);

      if (filteredGames.length === savedGames.length) {
        return false; // Game not found
      }

      this.saveAllGames(filteredGames);
      return true;
    } catch (error) {
      console.error("Failed to delete game:", error);
      return false;
    }
  }

  // Get all saved games
  getAllSavedGames(): SavedGame[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn("Failed to load saved games:", error);
      return [];
    }
  }

  // Clear all saved games
  clearAllSavedGames(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.AUTO_SAVE_KEY);
    } catch (error) {
      console.error("Failed to clear saved games:", error);
    }
  }

  // Check if auto-save exists
  hasAutoSavedGame(): boolean {
    return this.loadAutoSavedGame() !== null;
  }

  // Get storage usage information
  getStorageInfo(): { used: number; available: number; gameCount: number } {
    try {
      const games = this.getAllSavedGames();
      const usedStorage = new Blob([
        localStorage.getItem(this.STORAGE_KEY) || "",
      ]).size;

      // Estimate available storage (localStorage typically 5-10MB)
      const estimatedTotal = 5 * 1024 * 1024; // 5MB estimate

      return {
        used: usedStorage,
        available: estimatedTotal - usedStorage,
        gameCount: games.length,
      };
    } catch (error) {
      console.warn("Failed to get storage info:", error);
      return { used: 0, available: 0, gameCount: 0 };
    }
  }

  // Utility methods
  private saveAllGames(games: SavedGame[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(games));
  }

  private generateGameId(): string {
    return "game_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }

  // Export/Import functionality
  exportGame(gameId: string): string | null {
    const game = this.loadGame(gameId);
    if (!game) return null;

    try {
      return JSON.stringify(game, null, 2);
    } catch (error) {
      console.error("Failed to export game:", error);
      return null;
    }
  }

  importGame(gameData: string): SavedGame | null {
    try {
      const game = JSON.parse(gameData) as SavedGame;

      // Validate game data structure
      if (!game.fen || !game.pgn || !game.gameMode) {
        throw new Error("Invalid game data structure");
      }

      // Generate new ID and update timestamps
      const importedGame = {
        ...game,
        id: this.generateGameId(),
        lastModified: new Date().toISOString(),
        name: `${game.name} (Imported)`,
      };

      // Save the imported game
      const savedGames = this.getAllSavedGames();
      savedGames.push(importedGame);
      this.saveAllGames(savedGames);

      return importedGame;
    } catch (error) {
      console.error("Failed to import game:", error);
      return null;
    }
  }
}

// Create singleton instance
export const gameStorage = new GameStorage();
export default gameStorage;
