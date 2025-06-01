import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

interface Move {
  san: string;
  moveNumber: number;
  color: 'w' | 'b';
  fen: string;
}

interface MoveHistoryProps {
  moves: Move[];
  currentMoveIndex: number;
  onMoveClick: (moveIndex: number) => void;
  onNavigate: (direction: 'first' | 'prev' | 'next' | 'last') => void;
  canNavigateBack: boolean;
  canNavigateForward: boolean;
}

const HistoryContainer = styled(motion.div)`
  width: 220px;
  height: 480px;
  background-color: #f8f8f8;
  border: 2px solid #333;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const HistoryHeader = styled.h3`
  margin: 0 0 12px 0;
  color: #333;
  font-size: 1.1em;
  text-align: center;
`;

const MovesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  background-color: white;
`;

const MoveRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  font-size: 0.9em;
`;

const MoveNumber = styled.span`
  color: #666;
  font-weight: bold;
  width: 30px;
  text-align: right;
  margin-right: 8px;
`;

const MoveButton = styled(motion.button)<{ isActive: boolean; isWhite: boolean }>`
  background-color: ${props => 
    props.isActive 
      ? '#4CAF50' 
      : props.isWhite 
        ? '#f0f0f0' 
        : '#e0e0e0'
  };
  color: ${props => props.isActive ? 'white' : '#333'};
  border: 1px solid ${props => props.isActive ? '#4CAF50' : '#ccc'};
  border-radius: 4px;
  padding: 4px 6px;
  margin-right: 4px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 0.85em;
  min-width: 45px;
  
  &:hover {
    background-color: ${props => 
      props.isActive 
        ? '#45a049' 
        : '#d0d0d0'
    };
  }
`;

const NavigationControls = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin-top: 12px;
`;

const NavButton = styled(motion.button)<{ disabled: boolean }>`
  padding: 8px;
  background-color: ${props => props.disabled ? '#ccc' : '#2196F3'};
  color: ${props => props.disabled ? '#666' : 'white'};
  border: none;
  border-radius: 4px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-size: 14px;
  min-height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: ${props => props.disabled ? '#ccc' : '#1976D2'};
  }
`;

const MoveHistory: React.FC<MoveHistoryProps> = ({
  moves,
  currentMoveIndex,
  onMoveClick,
  onNavigate,
  canNavigateBack,
  canNavigateForward
}) => {
  // Group moves by pairs (white and black)
  const movePairs: Array<{
    moveNumber: number;
    white?: Move;
    black?: Move;
  }> = [];

  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];
    const pairIndex = Math.floor(i / 2);
    
    if (!movePairs[pairIndex]) {
      movePairs[pairIndex] = { moveNumber: move.moveNumber };
    }
    
    if (move.color === 'w') {
      movePairs[pairIndex].white = move;
    } else {
      movePairs[pairIndex].black = move;
    }
  }

  return (
    <HistoryContainer
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <HistoryHeader>Move History</HistoryHeader>
      
      <MovesContainer>
        {moves.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
            No moves yet
          </div>
        ) : (
          movePairs.map((pair, pairIndex) => (
            <MoveRow key={pairIndex}>
              <MoveNumber>{pair.moveNumber}.</MoveNumber>
              
              {pair.white && (
                <MoveButton
                  isActive={currentMoveIndex === (pairIndex * 2)}
                  isWhite={true}
                  onClick={() => onMoveClick(pairIndex * 2)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {pair.white.san}
                </MoveButton>
              )}
              
              {pair.black && (
                <MoveButton
                  isActive={currentMoveIndex === (pairIndex * 2 + 1)}
                  isWhite={false}
                  onClick={() => onMoveClick(pairIndex * 2 + 1)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {pair.black.san}
                </MoveButton>
              )}
            </MoveRow>
          ))
        )}
      </MovesContainer>
      
      <NavigationControls>
        <NavButton
          disabled={!canNavigateBack}
          onClick={() => onNavigate('first')}
          whileHover={!canNavigateBack ? {} : { scale: 1.05 }}
          whileTap={!canNavigateBack ? {} : { scale: 0.95 }}
          title="First"
        >
          ⏮
        </NavButton>
        
        <NavButton
          disabled={!canNavigateBack}
          onClick={() => onNavigate('prev')}
          whileHover={!canNavigateBack ? {} : { scale: 1.05 }}
          whileTap={!canNavigateBack ? {} : { scale: 0.95 }}
          title="Previous"
        >
          ◀
        </NavButton>
        
        <NavButton
          disabled={!canNavigateForward}
          onClick={() => onNavigate('next')}
          whileHover={!canNavigateForward ? {} : { scale: 1.05 }}
          whileTap={!canNavigateForward ? {} : { scale: 0.95 }}
          title="Next"
        >
          ▶
        </NavButton>
        
        <NavButton
          disabled={!canNavigateForward}
          onClick={() => onNavigate('last')}
          whileHover={!canNavigateForward ? {} : { scale: 1.05 }}
          whileTap={!canNavigateForward ? {} : { scale: 0.95 }}
          title="Last"
        >
          ⏭
        </NavButton>
      </NavigationControls>
    </HistoryContainer>
  );
};

export default MoveHistory;
