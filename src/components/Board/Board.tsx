import React, { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import { Chess } from 'chess.js'; // Import Chess
import Square from '../Square/Square';
import GameInfo from '../GameInfo/GameInfo';
import PromotionDialog from '../PromotionDialog/PromotionDialog';
import MoveHistory from '../MoveHistory/MoveHistory';
import SavedGames from '../SavedGames/SavedGames';
import SaveGameDialog from '../SaveGameDialog/SaveGameDialog';
import ChessAI from '../../logic/ai';
import audioManager from '../../logic/audioManager';
import gameStorage, { type SavedGame } from '../../logic/gameStorage';
import type { PieceSymbol, PieceColor } from '../Piece/Piece'; // Import types for piece data

interface MoveHistoryEntry {
  san: string;
  moveNumber: number;
  color: 'w' | 'b';
  fen: string;
}

// Enhanced styled component for the board container with animations
const BoardContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  width: 480px;
  height: 480px;
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
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const MainContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 24px;
  width: 100%;
  justify-content: center;
  max-width: 750px;
`;

const Board: React.FC = () => {
  // Initialize chess.js game instance
  const [game, setGame] = useState(() => new Chess());
  const [gameUpdateTrigger, setGameUpdateTrigger] = useState(0); // Force re-renders
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const [gameMode, setGameMode] = useState<'pvp' | 'ai'>('ai'); // Default to AI mode
  const [ai] = useState(() => new ChessAI('random'));
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [isGameShaking, setIsGameShaking] = useState(false);
  
  // Move history and navigation state
  const [moveHistory, setMoveHistory] = useState<MoveHistoryEntry[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1); // -1 means current position
  const [displayGame, setDisplayGame] = useState(() => new Chess()); // Game state for display
  
  // Promotion state
  const [pendingPromotion, setPendingPromotion] = useState<{
    from: string;
    to: string;
    color: PieceColor;
  } | null>(null);

  // Storage dialog state
  const [showSavedGames, setShowSavedGames] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Trigger check animation
  const triggerCheckAnimation = useCallback(() => {
    if (game.isCheck()) {
      setIsGameShaking(true);
      setTimeout(() => setIsGameShaking(false), 600);
    }
  }, [game]);

  // Update move history when game changes
  const updateMoveHistory = useCallback((gameInstance: Chess) => {
    const history = gameInstance.history({ verbose: true });
    const newMoveHistory: MoveHistoryEntry[] = [];
    
    // Reconstruct the game to get FEN positions for each move
    const tempGame = new Chess();
    
    for (let i = 0; i < history.length; i++) {
      const move = history[i];
      tempGame.move(move);
      
      newMoveHistory.push({
        san: move.san,
        moveNumber: Math.floor(i / 2) + 1,
        color: move.color,
        fen: tempGame.fen(),
      });
    }
    
    setMoveHistory(newMoveHistory);
    setCurrentMoveIndex(-1); // Reset to current position
    setDisplayGame(new Chess(gameInstance.fen())); // Update display game
  }, []);

  // Navigate to specific move
  const handleMoveClick = useCallback((moveIndex: number) => {
    if (moveIndex < 0 || moveIndex >= moveHistory.length) return;
    
    setCurrentMoveIndex(moveIndex);
    const targetFen = moveHistory[moveIndex].fen;
    setDisplayGame(new Chess(targetFen));
    
    // Clear selection when navigating
    setSelectedSquare(null);
    setLegalMoves([]);
  }, [moveHistory]);

  // Navigate with buttons
  const handleNavigate = useCallback((direction: 'first' | 'prev' | 'next' | 'last') => {
    const maxIndex = moveHistory.length - 1;
    
    switch (direction) {
      case 'first':
        if (moveHistory.length > 0) {
          handleMoveClick(0);
        }
        break;
      case 'prev':
        if (currentMoveIndex > 0) {
          handleMoveClick(currentMoveIndex - 1);
        } else if (currentMoveIndex === -1 && moveHistory.length > 0) {
          handleMoveClick(maxIndex - 1);
        }
        break;
      case 'next':
        if (currentMoveIndex < maxIndex) {
          handleMoveClick(currentMoveIndex + 1);
        } else if (currentMoveIndex === maxIndex) {
          setCurrentMoveIndex(-1);
          setDisplayGame(new Chess(game.fen()));
          setSelectedSquare(null);
          setLegalMoves([]);
        }
        break;
      case 'last':
        setCurrentMoveIndex(-1);
        setDisplayGame(new Chess(game.fen()));
        setSelectedSquare(null);
        setLegalMoves([]);
        break;
    }
  }, [currentMoveIndex, moveHistory, game, handleMoveClick]);

  // Check if we're viewing current position
  const isViewingCurrentPosition = currentMoveIndex === -1;

  // AI move effect - triggers when it's AI's turn (black)
  useEffect(() => {
    if (gameMode === 'ai' && game.turn() === 'b' && !game.isGameOver() && !isAIThinking && isViewingCurrentPosition) {
      setIsAIThinking(true);
      
      // Add a small delay to make AI moves visible 
      setTimeout(() => {
        console.log("AI is thinking...");
        const aiMove = ai.makeMove(game);
        if (aiMove) {
          // Update last move for highlighting
          setLastMove({ from: aiMove.from, to: aiMove.to });
          
          // Force re-render
          setGameUpdateTrigger(prev => prev + 1);
          
          // Play sound based on move type
          if (aiMove.captured) {
            audioManager.playSound('capture');
          } else {
            audioManager.playSound('move');
          }
          
          // Check for special game states after AI move
          if (game.isCheckmate()) {
            setTimeout(() => audioManager.playSound('checkmate'), 200);
          } else if (game.isStalemate() || game.isDraw()) {
            setTimeout(() => audioManager.playSound('stalemate'), 200);
          } else if (game.isCheck()) {
            setTimeout(() => audioManager.playSound('check'), 200);
          }
          
          // Update move history after the move was made
          updateMoveHistory(game);
          
          // Trigger check animation if needed
          setTimeout(() => triggerCheckAnimation(), 100);
        }
        setIsAIThinking(false);
      }, 500); // 500ms delay for better UX
    }
  }, [game, gameUpdateTrigger, gameMode, ai, isAIThinking, triggerCheckAnimation, isViewingCurrentPosition, updateMoveHistory]);

  // Reset game function
  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setGameUpdateTrigger(0);
    setSelectedSquare(null);
    setLegalMoves([]);
    setIsAIThinking(false);
    setPendingPromotion(null);
    setLastMove(null);
    setMoveHistory([]);
    setCurrentMoveIndex(-1);
    setDisplayGame(new Chess());
    
    // Play game start sound
    setTimeout(() => audioManager.playSound('gameStart'), 300);
  };

  // Toggle game mode function
  const toggleGameMode = () => {
    setGameMode(prev => prev === 'ai' ? 'pvp' : 'ai');
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
        
        setSelectedSquare(null);
        setLegalMoves([]);
        
        // Force re-render
        setGameUpdateTrigger(prev => prev + 1);
        
        // Play promotion sound
        audioManager.playSound('promotion');
        
        // Check for special game states after promotion
        if (game.isCheckmate()) {
          setTimeout(() => audioManager.playSound('checkmate'), 300);
        } else if (game.isStalemate() || game.isDraw()) {
          setTimeout(() => audioManager.playSound('stalemate'), 300);
        } else if (game.isCheck()) {
          setTimeout(() => audioManager.playSound('check'), 300);
        }
        
        // Update move history
        updateMoveHistory(game);
        
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

  // Storage handlers
  const handleSaveGame = (gameName: string) => {
    try {
      const gameStatus: 'checkmate' | 'stalemate' | 'draw' | 'playing' = game.isGameOver() 
        ? (game.isCheckmate() ? 'checkmate' : game.isStalemate() ? 'stalemate' : 'draw')
        : 'playing';
        
      const gameData = {
        name: gameName,
        fen: game.fen(),
        pgn: game.pgn(),
        gameMode,
        currentTurn: game.turn(),
        gameStatus,
        lastMove,
        moveCount: Math.ceil(game.history().length / 2),
        timeSpent: 0 // Could be enhanced to track actual time
      };

      const savedGame = gameStorage.saveGame(gameData);
      console.log('Game saved successfully:', savedGame);
      setShowSaveDialog(false);
      
      // Play a confirmation sound
      audioManager.playSound('selection');
    } catch (error) {
      console.error('Failed to save game:', error);
    }
  };

  const handleLoadGame = (savedGame: SavedGame) => {
    try {
      // Create new game from saved FEN
      const newGame = new Chess(savedGame.fen);
      setGame(newGame);
      setDisplayGame(new Chess(savedGame.fen));
      
      // Restore game state
      setGameMode(savedGame.gameMode);
      setLastMove(savedGame.lastMove);
      setSelectedSquare(null);
      setLegalMoves([]);
      setIsAIThinking(false);
      setPendingPromotion(null);
      
      // Update move history from PGN
      if (savedGame.pgn) {
        const historyGame = new Chess();
        try {
          historyGame.loadPgn(savedGame.pgn);
          const moves = historyGame.history({ verbose: true });
          const newMoveHistory: MoveHistoryEntry[] = [];
          
          const tempGame = new Chess();
          for (let i = 0; i < moves.length; i++) {
            const move = moves[i];
            tempGame.move(move);
            newMoveHistory.push({
              san: move.san,
              moveNumber: Math.floor(i / 2) + 1,
              color: move.color,
              fen: tempGame.fen(),
            });
          }
          
          setMoveHistory(newMoveHistory);
        } catch (error) {
          console.warn('Failed to load PGN:', error);
          setMoveHistory([]);
        }
      } else {
        setMoveHistory([]);
      }
      
      setCurrentMoveIndex(-1);
      setGameUpdateTrigger(prev => prev + 1);
      setShowSavedGames(false);
      
      // Play load sound
      audioManager.playSound('gameStart');
      
      console.log('Game loaded successfully:', savedGame.name);
    } catch (error) {
      console.error('Failed to load game:', error);
    }
  };

  const handleAutoSave = useCallback(() => {
    if (!game.isGameOver()) {
      try {
        const gameData = {
          fen: game.fen(),
          pgn: game.pgn(),
          gameMode,
          currentTurn: game.turn(),
          gameStatus: 'playing' as const,
          lastMove,
          moveCount: Math.ceil(game.history().length / 2),
          timeSpent: 0
        };
        
        gameStorage.autoSaveGame(gameData);
      } catch (error) {
        console.warn('Auto-save failed:', error);
      }
    }
  }, [game, gameMode, lastMove]);

  // Auto-save effect - save after each move
  useEffect(() => {
    if (game.history().length > 0) {
      handleAutoSave();
    }
  }, [gameUpdateTrigger, handleAutoSave, game]);

  // Handle square click for piece selection
  const handleSquareClick = (row: number, col: number) => {
    // Don't allow moves if game is over, AI is thinking, or not viewing current position
    if (game.isGameOver() || isAIThinking || !isViewingCurrentPosition) {
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
        
        // Play selection sound
        audioManager.playSound('selection');
      } else if (pieceData && pieceData.color !== game.turn()) {
        // Trying to select opponent's piece - play illegal move sound
        audioManager.playSound('illegal');
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
                setSelectedSquare(null);
                setLegalMoves([]);
                
                // Force re-render
                setGameUpdateTrigger(prev => prev + 1);
                
                // Play sound based on move type
                if (move.captured) {
                  audioManager.playSound('capture');
                } else {
                  audioManager.playSound('move');
                }
                
                // Check for special game states after human move
                if (game.isCheckmate()) {
                  setTimeout(() => audioManager.playSound('checkmate'), 200);
                } else if (game.isStalemate() || game.isDraw()) {
                  setTimeout(() => audioManager.playSound('stalemate'), 200);
                } else if (game.isCheck()) {
                  setTimeout(() => audioManager.playSound('check'), 200);
                }
                
                // Update move history
                updateMoveHistory(game);
                
                // Trigger check animation if needed
                setTimeout(() => triggerCheckAnimation(), 100);
              }
            } catch {
              // Invalid move, just deselect
              setSelectedSquare(null);
              setLegalMoves([]);
              // Play illegal move sound
              audioManager.playSound('illegal');
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
            
            // Play selection sound
            audioManager.playSound('selection');
          } else {
            // Just deselect or play illegal sound if trying to select opponent piece
            setSelectedSquare(null);
            setLegalMoves([]);
            
            if (pieceData && pieceData.color !== game.turn()) {
              audioManager.playSound('illegal');
            }
          }
        }
      }
    }
  };

  const renderSquares = () => {
    const squares = [];
    const boardState = displayGame.board(); // Use displayGame for board state

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const squareData = boardState[row][col];
        const piece = squareData ? { type: squareData.type as PieceSymbol, color: squareData.color as PieceColor } : null;
        const isEven = (row + col) % 2 === 0;
        const squareKey = `square-${row}-${col}`;
        const squareNotation = String.fromCharCode(97 + col) + (8 - row); // Convert to chess notation
        const isSelected = selectedSquare === squareNotation && isViewingCurrentPosition; // Only show selection on current position
        const isLegalMove = legalMoves.includes(squareNotation) && isViewingCurrentPosition; // Only show legal moves on current position
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
      {/* GameInfo as horizontal header */}
      <GameInfo 
        game={game} 
        gameMode={gameMode}
        isAIThinking={isAIThinking}
        onResetGame={resetGame} 
        onToggleGameMode={toggleGameMode}
        onShowSaveDialog={() => setShowSaveDialog(true)}
        onShowSavedGames={() => setShowSavedGames(true)}
      />
      
      {/* Main content area with History and Board */}
      <MainContent>
        <MoveHistory
          moves={moveHistory}
          currentMoveIndex={currentMoveIndex}
          onMoveClick={handleMoveClick}
          onNavigate={handleNavigate}
          canNavigateBack={currentMoveIndex > 0 || (currentMoveIndex === -1 && moveHistory.length > 0)}
          canNavigateForward={currentMoveIndex < moveHistory.length - 1 || currentMoveIndex === -1}
        />
        
        <BoardContainer
          animate={isGameShaking ? { x: [0, -5, 5, -5, 5, 0] } : { x: 0 }}
          transition={{ duration: 0.6 }}
          initial={{ rotateX: 45, opacity: 0 }}
          whileInView={{ rotateX: 0, opacity: 1 }}
        >
          {renderSquares()}
        </BoardContainer>
      </MainContent>
      
      <AnimatePresence>
        {pendingPromotion && (
          <PromotionDialog
            color={pendingPromotion.color}
            onPromotion={handlePromotion}
            onCancel={handlePromotionCancel}
          />
        )}
        {showSavedGames && (
          <SavedGames
            isOpen={showSavedGames}
            onClose={() => setShowSavedGames(false)}
            onLoadGame={handleLoadGame}
          />
        )}
        {showSaveDialog && (
          <SaveGameDialog
            isOpen={showSaveDialog}
            onClose={() => setShowSaveDialog(false)}
            onSave={handleSaveGame}
            gameInfo={{
              gameMode,
              moveCount: Math.ceil(game.history().length / 2),
              currentTurn: game.turn(),
              gameStatus: game.isGameOver() 
                ? (game.isCheckmate() ? 'checkmate' : game.isStalemate() ? 'stalemate' : 'draw')
                : 'playing'
            }}
          />
        )}
      </AnimatePresence>
    </GameContainer>
  );
};

export default Board;
