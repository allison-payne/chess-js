import React from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
import Piece from '../Piece/Piece';
import type { PieceSymbol, PieceColor } from '../Piece/Piece';

// Define props for the Square component
interface SquareProps {
  isEven: boolean;
  piece: { type: PieceSymbol; color: PieceColor } | null;
  isSelected?: boolean;
  isLegalMove?: boolean;
  onClick?: () => void;
  lastMove?: boolean;
  squarePosition?: string;
  isDragTarget?: boolean;
  onPieceDragStart?: (piece: { type: PieceSymbol; color: PieceColor }, from: string) => void;
  onPieceDragEnd?: (piece: { type: PieceSymbol; color: PieceColor }, from: string, to: string | null) => void;
}

// Define props specifically for the SquareContainer styled component
interface SquareContainerProps {
  isEven: boolean;
  isSelected?: boolean;
  isLegalMove?: boolean;
  lastMove?: boolean;
  isDragTarget?: boolean;
}

// Styled component for a single square
const SquareContainer = styled(motion.div)<SquareContainerProps>`
  width: 100%;
  height: 100%;
  background-color: ${props => {
    if (props.isSelected) {
      return '#ffff00'; // Yellow highlight for selected square
    }
    if (props.lastMove) {
      return '#ffeaa7'; // Light yellow for last move
    }
    if (props.isDragTarget) {
      return '#90EE90'; // Light green for drag target
    }
    if (props.isLegalMove) {
      return '#90EE90'; // Light green for legal move squares
    }
    return props.isEven ? '#f0d9b5' : '#b58863';
  }};
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  cursor: pointer;
  transition: background-color 0.2s ease;
  position: relative;
  
  &:hover {
    opacity: 0.8;
    transform: scale(1.02);
  }
  
  ${props => props.isLegalMove && `
    &::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: rgba(0, 128, 0, 0.6);
      pointer-events: none;
      animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
      0% { transform: scale(1); opacity: 0.6; }
      50% { transform: scale(1.1); opacity: 0.8; }
      100% { transform: scale(1); opacity: 0.6; }
    }
  `}
  
  ${props => props.isDragTarget && `
    &::before {
      content: '';
      position: absolute;
      inset: 2px;
      border: 3px dashed #4CAF50;
      border-radius: 4px;
      background-color: rgba(76, 175, 80, 0.1);
      pointer-events: none;
      animation: dragTargetPulse 1s infinite;
    }
    
    @keyframes dragTargetPulse {
      0% { opacity: 0.5; }
      50% { opacity: 1; }
      100% { opacity: 0.5; }
    }
  `}
`;

const Square: React.FC<SquareProps> = ({ 
  isEven, 
  piece, 
  isSelected = false, 
  isLegalMove = false, 
  onClick, 
  lastMove = false,
  squarePosition,
  isDragTarget = false,
  onPieceDragStart,
  onPieceDragEnd
}) => {
  return (
    <SquareContainer 
      isEven={isEven} 
      isSelected={isSelected}
      isLegalMove={isLegalMove}
      lastMove={lastMove}
      isDragTarget={isDragTarget}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.1 }}
      data-square={squarePosition} // For drag-and-drop target detection
    >
      <AnimatePresence mode="wait">
        {piece && (
          <motion.div
            key={`${piece.type}-${piece.color}`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Piece 
              type={piece.type} 
              color={piece.color}
              isDraggable={true}
              isSelected={isSelected}
              squarePosition={squarePosition}
              onDragStart={onPieceDragStart}
              onDragEnd={onPieceDragEnd}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </SquareContainer>
  );
};

export default Square;
