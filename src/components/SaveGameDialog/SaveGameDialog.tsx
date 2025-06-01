import React, { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';

// Styled components
const SaveDialogContainer = styled(motion.div)`
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

const SaveDialogModal = styled(motion.div)`
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 90%;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const DialogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const DialogTitle = styled.h2`
  color: white;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
`;

const CloseButton = styled(motion.button)`
  background: rgba(244, 67, 54, 0.8);
  border: none;
  border-radius: 6px;
  color: white;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: rgba(244, 67, 54, 1);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  font-weight: 500;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  padding: 12px;
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #64B5F6;
    background: rgba(255, 255, 255, 0.15);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

const GamePreview = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const PreviewRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const Button = styled(motion.button)<{ variant?: 'primary' | 'secondary' }>`
  flex: 1;
  background: ${props => 
    props.variant === 'primary' 
      ? 'rgba(76, 175, 80, 0.8)' 
      : 'rgba(158, 158, 158, 0.8)'
  };
  border: none;
  border-radius: 8px;
  color: white;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => 
      props.variant === 'primary' 
        ? 'rgba(76, 175, 80, 1)' 
        : 'rgba(158, 158, 158, 1)'
    };
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

interface SaveGameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (gameName: string) => void;
  gameInfo: {
    gameMode: 'pvp' | 'ai';
    moveCount: number;
    currentTurn: 'w' | 'b';
    gameStatus: string;
  };
}

const SaveGameDialog: React.FC<SaveGameDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  gameInfo 
}) => {
  const [gameName, setGameName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate default game name
  const generateDefaultName = (): string => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const modeStr = gameInfo.gameMode === 'ai' ? 'vs AI' : 'vs Player';
    return `Game ${timeStr} (${modeStr})`;
  };

  // Reset form when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setGameName(generateDefaultName());
      setIsSubmitting(false);
    }
  }, [isOpen, gameInfo, generateDefaultName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!gameName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      await onSave(gameName.trim());
      onClose();
    } catch (error) {
      console.error('Failed to save game:', error);
      // Could add error display here
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusText = (): string => {
    switch (gameInfo.gameStatus) {
      case 'checkmate':
        return `Checkmate (${gameInfo.currentTurn === 'w' ? 'Black' : 'White'} wins)`;
      case 'stalemate':
        return 'Stalemate';
      case 'draw':
        return 'Draw';
      default:
        return `${gameInfo.currentTurn === 'w' ? 'White' : 'Black'} to move`;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <SaveDialogContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <SaveDialogModal
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle>💾 Save Game</DialogTitle>
            <CloseButton
              onClick={onClose}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </CloseButton>
          </DialogHeader>

          <GamePreview>
            <PreviewRow>
              <span>Mode:</span>
              <span>{gameInfo.gameMode === 'ai' ? 'vs AI' : 'Player vs Player'}</span>
            </PreviewRow>
            <PreviewRow>
              <span>Moves:</span>
              <span>{gameInfo.moveCount}</span>
            </PreviewRow>
            <PreviewRow>
              <span>Status:</span>
              <span>{getStatusText()}</span>
            </PreviewRow>
            <PreviewRow>
              <span>Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </PreviewRow>
          </GamePreview>

          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label htmlFor="gameName">Game Name</Label>
              <Input
                id="gameName"
                type="text"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                placeholder="Enter a name for your game..."
                maxLength={50}
                required
                autoFocus
              />
            </InputGroup>

            <ButtonGroup>
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isSubmitting}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={!gameName.trim() || isSubmitting}
                whileTap={{ scale: 0.95 }}
              >
                {isSubmitting ? 'Saving...' : 'Save Game'}
              </Button>
            </ButtonGroup>
          </Form>
        </SaveDialogModal>
      </SaveDialogContainer>
    </AnimatePresence>
  );
};

export default SaveGameDialog;
