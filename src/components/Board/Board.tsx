import React, { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { Chess } from 'chess.js'; // Import Chess
import Square from '../Square/Square';
import GameInfo from '../GameInfo/GameInfo';
import PromotionDialog from '../PromotionDialog/PromotionDialog';
import ChessAI from '../../logic/ai';
import type { PieceSymbol, PieceColor } from '../Piece/Piece'; // Import types for piece data

// Enhanced styled component for the board container with animations
const BoardContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  width: 400px; // Example size, can be adjusted
  height: 400px; // Example size, can be adjusted
  border: 2px solid #333;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  overflow: hidden;
`;

const GameContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
`;

const Board: React.FC = () => {
  // Initialize chess.js game instance
  const [game, setGame] = useState(() => new Chess());
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [gameMode, setGameMode] = useState<'pvp' | 'ai'>('ai'); // Default to AI mode
  const [ai] = useState(() => new ChessAI('random'));
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [isGameShaking, setIsGameShaking] = useState(false);
  
  // Promotion state
  const [pendingPromotion, setPendingPromotion] = useState<{
    from: string;
    to: string;
    color: PieceColor;
  } | null>(null);

  // Trigger check animation
  const triggerCheckAnimation = useCallback(() => {
    if (game.isCheck()) {
      setIsGameShaking(true);
      setTimeout(() => setIsGameShaking(false), 600);
    }
  }, [game]);

  // AI move effect - triggers when it's AI's turn (black)
  useEffect(() => {
    if (gameMode === 'ai' && game.turn() === 'b' && !game.isGameOver() && !isAIThinking) {
      setIsAIThinking(true);
      
      // Add a small delay to make AI moves visible 
      setTimeout(() => {
        console.log("AI is thinking...");
        const aiMove = ai.makeMove(game);
        if (aiMove) {
          // Update last move for highlighting
          setLastMove({ from: aiMove.from, to: aiMove.to });
          
          // Update game state with AI move
          setGame(new Chess(game.fen()));
          
          // Trigger check animation if needed
          setTimeout(() => triggerCheckAnimation(), 100);
        }
        setIsAIThinking(false);
      }, 500); // 500ms delay for better UX
    }
  }, [game, gameMode, ai, isAIThinking, triggerCheckAnimation]);

  // Reset game function
  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setSelectedSquare(null);
    setLegalMoves([]);
    setIsAIThinking(false);
    setPendingPromotion(null);
    setLastMove(null);
  };

  // Handle promotion selection
  const handlePromotion = (promotionPiece: PieceSymbol) => {
    if (!pendingPromotion) return;
    
    try {
      const move = game.move({
        from: pendingPromotion.from,
        to: pendingPromotion.to,
        promotion: promotionPiece
      });
      
      if (move) {
        // Update last move for highlighting
        setLastMove({ from: pendingPromotion.from, to: pendingPromotion.to });
        
        setGame(new Chess(game.fen()));
        setSelectedSquare(null);
        setLegalMoves([]);
        
        // Trigger check animation if needed
        setTimeout(() => triggerCheckAnimation(), 100);
      }
    } catch (error) {
      console.error('Promotion move failed:', error);
    }
    
    setPendingPromotion(null);
  };

  // Handle promotion cancellation
  const handlePromotionCancel = () => {
    setPendingPromotion(null);
    setSelectedSquare(null);
    setLegalMoves([]);
  };

  // Check if a move would result in pawn promotion
  const wouldPromote = (from: string, to: string): boolean => {
    // Use chess.js to validate the move and check if it's a promotion
    const moves = game.moves({ verbose: true });
    const move = moves.find(m => m.from === from && m.to === to);
    return move ? move.flags.includes('p') : false; // 'p' flag indicates promotion
  };

  // Toggle game mode
  const toggleGameMode = () => {
    setGameMode(prev => prev === 'pvp' ? 'ai' : 'pvp');
    resetGame(); // Reset when changing modes
  };

  // Handle square click for piece selection
  const handleSquareClick = (row: number, col: number) => {
    // Don't allow moves if game is over or AI is thinking
    if (game.isGameOver() || isAIThinking) {
      return;
    }

    // In AI mode, only allow human player (white) to move
    if (gameMode === 'ai' && game.turn() === 'b') {
      return;
    }

    const square = String.fromCharCode(97 + col) + (8 - row); // Convert to chess notation (e.g., 'e4')
    
    // If no piece is selected, try to select the clicked piece
    if (!selectedSquare) {
      // Get piece using board() method instead of get()
      const boardState = game.board();
      const pieceData = boardState[row][col];
      // Only select if there's a piece and it's the current player's turn
      if (pieceData && pieceData.color === game.turn()) {
        setSelectedSquare(square);
        // Get legal moves for this piece
        const allMoves = game.moves({ verbose: true });
        const pieceMoves = allMoves.filter(move => move.from === square);
        const moveSquares = pieceMoves.map(move => move.to);
        setLegalMoves(moveSquares);
      }
    } else {
      // If a piece is already selected, try to move or deselect
      if (selectedSquare === square) {
        // Clicking the same square deselects
        setSelectedSquare(null);
        setLegalMoves([]);
      } else {
        // Check if this is a legal move
        if (legalMoves.includes(square)) {
          // Check if this move would result in pawn promotion
          if (wouldPromote(selectedSquare, square)) {
            // Get piece color for promotion dialog
            const boardState = game.board();
            const fromRow = 8 - parseInt(selectedSquare[1]);
            const fromCol = selectedSquare.charCodeAt(0) - 97;
            const piece = boardState[fromRow][fromCol];
            
            if (piece) {
              setPendingPromotion({
                from: selectedSquare,
                to: square,
                color: piece.color as PieceColor
              });
            }
          } else {
            // Make the move normally
            try {
              const move = game.move({ from: selectedSquare, to: square });
              if (move) {
                // Update last move for highlighting
                setLastMove({ from: selectedSquare, to: square });
                
                // Move was successful, update the game state
                setGame(new Chess(game.fen())); // Create new instance to trigger re-render
                setSelectedSquare(null);
                setLegalMoves([]);
                
                // Trigger check animation if needed
                setTimeout(() => triggerCheckAnimation(), 100);
              }
            } catch {
              // Invalid move, just deselect
              setSelectedSquare(null);
              setLegalMoves([]);
            }
          }
        } else {
          // Not a legal move, try to select the new piece if it belongs to current player
          const boardState = game.board();
          const pieceData = boardState[row][col];
          if (pieceData && pieceData.color === game.turn()) {
            setSelectedSquare(square);
            const allMoves = game.moves({ verbose: true });
            const pieceMoves = allMoves.filter(move => move.from === square);
            const moveSquares = pieceMoves.map(move => move.to);
            setLegalMoves(moveSquares);
          } else {
            // Just deselect
            setSelectedSquare(null);
            setLegalMoves([]);
          }
        }
      }
    }
  };

  const renderSquares = () => {
    const squares = [];
    const boardState = game.board(); // Get the board state from chess.js

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const squareData = boardState[row][col];
        const piece = squareData ? { type: squareData.type as PieceSymbol, color: squareData.color as PieceColor } : null;
        const isEven = (row + col) % 2 === 0;
        const squareKey = `square-${row}-${col}`;
        const squareNotation = String.fromCharCode(97 + col) + (8 - row); // Convert to chess notation
        const isSelected = selectedSquare === squareNotation;
        const isLegalMove = legalMoves.includes(squareNotation);
        const isLastMove = !!(lastMove && (lastMove.from === squareNotation || lastMove.to === squareNotation));

        squares.push(
          <Square
            key={squareKey}
            isEven={isEven}
            piece={piece}
            isSelected={isSelected}
            isLegalMove={isLegalMove}
            lastMove={isLastMove}
            onClick={() => handleSquareClick(row, col)}
          />
        );
      }
    }
    return squares;
  };

  return (
    <GameContainer
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <GameInfo 
        game={game} 
        gameMode={gameMode}
        isAIThinking={isAIThinking}
        onResetGame={resetGame} 
        onToggleGameMode={toggleGameMode}
      />
      <BoardContainer
        animate={isGameShaking ? { x: [0, -5, 5, -5, 5, 0] } : { x: 0 }}
        transition={{ duration: 0.6 }}
        initial={{ rotateX: 45, opacity: 0 }}
        whileInView={{ rotateX: 0, opacity: 1 }}
      >
        {renderSquares()}
      </BoardContainer>
      <AnimatePresence>
        {pendingPromotion && (
          <PromotionDialog
            color={pendingPromotion.color}
            onPromotion={handlePromotion}
            onCancel={handlePromotionCancel}
          />
        )}
      </AnimatePresence>
    </GameContainer>
  );
};

export default Board;
