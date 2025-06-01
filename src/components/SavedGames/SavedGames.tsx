import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import gameStorage, { type SavedGame } from '../../logic/gameStorage';

// Styled components
const SavedGamesContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const SavedGamesModal = styled(motion.div)`
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  max-height: 80vh;
  width: 90%;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ModalTitle = styled.h2`
  color: white;
  margin: 0;
  font-size: 24px;
  font-weight: 600;
`;

const CloseButton = styled(motion.button)`
  background: rgba(244, 67, 54, 0.8);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background: rgba(244, 67, 54, 1);
  }
`;

const GamesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 20px;
`;

const GameItem = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
  }
`;

const GameHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const GameName = styled.div`
  color: white;
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
`;

const GameInfo = styled.div`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const GameActions = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ActionButton = styled(motion.button)<{ variant?: 'danger' | 'primary' }>`
  background: ${props => 
    props.variant === 'danger' 
      ? 'rgba(244, 67, 54, 0.8)' 
      : 'rgba(76, 175, 80, 0.8)'
  };
  border: none;
  border-radius: 6px;
  color: white;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => 
      props.variant === 'danger' 
        ? 'rgba(244, 67, 54, 1)' 
        : 'rgba(76, 175, 80, 1)'
    };
    transform: scale(1.05);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  padding: 40px 20px;
  font-size: 16px;
`;

const StorageInfo = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 16px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
`;

const AutoSaveSection = styled.div`
  background: rgba(33, 150, 243, 0.1);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid rgba(33, 150, 243, 0.3);
`;

const AutoSaveTitle = styled.div`
  color: #64B5F6;
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

interface SavedGamesProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadGame: (game: SavedGame) => void;
  onDeleteGame?: (gameId: string) => void;
}

const SavedGames: React.FC<SavedGamesProps> = ({ 
  isOpen, 
  onClose, 
  onLoadGame,
  onDeleteGame 
}) => {
  const [savedGames, setSavedGames] = useState<SavedGame[]>([]);
  const [autoSavedGame, setAutoSavedGame] = useState<SavedGame | null>(null);

  // Load saved games when component opens
  useEffect(() => {
    if (isOpen) {
      setSavedGames(gameStorage.getAllSavedGames());
      setAutoSavedGame(gameStorage.loadAutoSavedGame());
    }
  }, [isOpen]);

  const handleLoadGame = (game: SavedGame) => {
    onLoadGame(game);
    onClose();
  };

  const handleDeleteGame = (gameId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering load
    
    if (window.confirm('Are you sure you want to delete this saved game?')) {
      const success = gameStorage.deleteGame(gameId);
      if (success) {
        setSavedGames(prev => prev.filter(game => game.id !== gameId));
        if (onDeleteGame) {
          onDeleteGame(gameId);
        }
      }
    }
  };

  const handleLoadAutoSave = () => {
    if (autoSavedGame) {
      handleLoadGame(autoSavedGame);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getGameStatusText = (game: SavedGame): string => {
    switch (game.gameStatus) {
      case 'checkmate':
        return `Checkmate (${game.currentTurn === 'w' ? 'Black' : 'White'} wins)`;
      case 'stalemate':
        return 'Stalemate';
      case 'draw':
        return 'Draw';
      default:
        return `${game.currentTurn === 'w' ? 'White' : 'Black'} to move`;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <SavedGamesContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <SavedGamesModal
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader>
            <ModalTitle>📁 Saved Games</ModalTitle>
            <CloseButton
              onClick={onClose}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </CloseButton>
          </ModalHeader>

          <StorageInfo>
            💾 {savedGames.length} saved games • Auto-save: {gameStorage.getSettings().autoSave ? 'ON' : 'OFF'}
          </StorageInfo>

          {autoSavedGame && (
            <AutoSaveSection>
              <AutoSaveTitle>
                🔄 Auto-saved Game Available
              </AutoSaveTitle>
              <GameInfo>
                <div>Mode: {autoSavedGame.gameMode === 'ai' ? 'vs AI' : 'Player vs Player'}</div>
                <div>Moves: {autoSavedGame.moveCount}</div>
                <div>Status: {getGameStatusText(autoSavedGame)}</div>
                <div>Last saved: {formatDate(autoSavedGame.lastModified)}</div>
              </GameInfo>
              <ActionButton 
                onClick={handleLoadAutoSave}
                style={{ marginTop: '12px' }}
                whileTap={{ scale: 0.95 }}
              >
                Load Auto-save
              </ActionButton>
            </AutoSaveSection>
          )}

          <GamesList>
            {savedGames.length === 0 ? (
              <EmptyState>
                🎯 No saved games yet<br />
                Save your current game to see it here!
              </EmptyState>
            ) : (
              savedGames
                .sort((a, b) => new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime())
                .map((game) => (
                  <GameItem
                    key={game.id}
                    onClick={() => handleLoadGame(game)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <GameHeader>
                      <div>
                        <GameName>{game.name}</GameName>
                        <GameInfo>
                          <div>Mode: {game.gameMode === 'ai' ? 'vs AI' : 'Player vs Player'}</div>
                          <div>Moves: {game.moveCount} • {getGameStatusText(game)}</div>
                          <div>Saved: {formatDate(game.lastModified)}</div>
                        </GameInfo>
                      </div>
                      <GameActions>
                        <ActionButton
                          variant="danger"
                          onClick={(e) => handleDeleteGame(game.id, e)}
                          whileTap={{ scale: 0.9 }}
                        >
                          🗑️
                        </ActionButton>
                      </GameActions>
                    </GameHeader>
                  </GameItem>
                ))
            )}
          </GamesList>
        </SavedGamesModal>
      </SavedGamesContainer>
    </AnimatePresence>
  );
};

export default SavedGames;
