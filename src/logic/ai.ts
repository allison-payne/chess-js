import { Chess } from "chess.js";

/**
 * Basic AI that makes random moves
 * This is a simple implementation that can be enhanced later with minimax algorithm
 */
export class ChessAI {
  private difficulty: "random" | "easy";

  constructor(difficulty: "random" | "easy" = "random") {
    this.difficulty = difficulty;
  }

  /**
   * Makes a move for the AI
   * @param game - The current chess game instance
   * @returns The move made by the AI, or null if no moves available
   */
  makeMove(game: Chess) {
    const moves = game.moves();

    if (moves.length === 0) {
      return null; // No legal moves (game over)
    }

    switch (this.difficulty) {
      case "random":
        return this.makeRandomMove(game, moves);
      case "easy":
        return this.makeSmartMove(game, moves);
      default:
        return this.makeRandomMove(game, moves);
    }
  }

  /**
   * Makes a completely random move
   */
  private makeRandomMove(game: Chess, moves: string[]) {
    const randomIndex = Math.floor(Math.random() * moves.length);
    const selectedMove = moves[randomIndex];

    try {
      return game.move(selectedMove);
    } catch (error) {
      console.error("AI move failed:", error);
      return null;
    }
  }

  /**
   * Makes a slightly smarter move (captures pieces if possible, otherwise random)
   */
  private makeSmartMove(game: Chess, moves: string[]) {
    const detailedMoves = game.moves({ verbose: true });

    // Prioritize pawn promotions to queen
    const promotions = detailedMoves.filter((move) => move.promotion);
    if (promotions.length > 0) {
      // Always promote to queen for simplicity
      const queenPromotions = promotions.filter(
        (move) => move.promotion === "q"
      );
      if (queenPromotions.length > 0) {
        const randomPromotion =
          queenPromotions[Math.floor(Math.random() * queenPromotions.length)];
        try {
          return game.move(randomPromotion);
        } catch (error) {
          console.error("AI promotion move failed:", error);
        }
      }
    }

    // Prioritize captures
    const captures = detailedMoves.filter((move) => move.captured);
    if (captures.length > 0) {
      const randomCapture =
        captures[Math.floor(Math.random() * captures.length)];
      try {
        return game.move(randomCapture);
      } catch (error) {
        console.error("AI capture move failed:", error);
      }
    }

    // If no captures, make a random move
    return this.makeRandomMove(game, moves);
  }
}

export default ChessAI;
