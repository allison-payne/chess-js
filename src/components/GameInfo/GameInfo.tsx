import React from 'react';
import styled from '@emotion/styled';
import { Chess } from 'chess.js';

interface GameInfoProps {
  game: Chess;
  gameMode: 'pvp' | 'ai';
  isAIThinking: boolean;
  onResetGame: () => void;
  onToggleGameMode: () => void;
}

const GameInfoContainer = styled.div`
  padding: 20px;
  margin: 20px 0;
  background-color: #f5f5f5;
  border-radius: 8px;
  border: 2px solid #333;
  max-width: 400px;
`;

const StatusText = styled.h2`
  margin: 0 0 10px 0;
  color: #333;
  font-size: 1.2em;
`;

const TurnText = styled.p`
  margin: 5px 0;
  font-size: 1em;
  color: #666;
`;

const ModeButton = styled.button`
  margin-top: 10px;
  margin-right: 10px;
  padding: 8px 16px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9em;
  
  &:hover {
    background-color: #1976D2;
  }
`;

const ResetButton = styled.button`
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  
  &:hover {
    background-color: #45a049;
  }
`;

const GameInfo: React.FC<GameInfoProps> = ({ game, gameMode, isAIThinking, onResetGame, onToggleGameMode }) => {
  const getGameStatus = () => {
    if (game.isCheckmate()) {
      const winner = game.turn() === 'w' ? 'Black' : 'White';
      if (gameMode === 'ai') {
        return winner === 'White' ? 'You win!' : 'AI wins!';
      }
      return `Checkmate! ${winner} wins!`;
    }
    
    if (game.isStalemate()) {
      return 'Stalemate! Game is a draw.';
    }
    
    if (game.isDraw()) {
      return 'Draw!';
    }
    
    if (game.isCheck()) {
      const player = game.turn() === 'w' ? 'White' : 'Black';
      if (gameMode === 'ai') {
        return game.turn() === 'w' ? 'You are in check!' : 'AI is in check!';
      }
      return `${player} is in check!`;
    }
    
    if (isAIThinking) {
      return 'AI is thinking...';
    }
    
    return 'Game in progress';
  };

  const getCurrentPlayer = () => {
    if (gameMode === 'ai') {
      return game.turn() === 'w' ? 'Your turn' : 'AI turn';
    }
    return game.turn() === 'w' ? 'White' : 'Black';
  };

  const isGameOver = () => {
    return game.isGameOver();
  };

  return (
    <GameInfoContainer>
      <StatusText>{getGameStatus()}</StatusText>
      {!isGameOver() && (
        <TurnText>Current turn: {getCurrentPlayer()}</TurnText>
      )}
      <ModeButton onClick={onToggleGameMode}>
        Mode: {gameMode === 'ai' ? 'vs AI' : 'Player vs Player'}
      </ModeButton>
      <ResetButton onClick={onResetGame}>
        New Game
      </ResetButton>
    </GameInfoContainer>
  );
};

export default GameInfo;
