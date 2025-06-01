import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';

// Define types for piece (e.g., 'p', 'r', 'n', 'b', 'q', 'k')
export type PieceSymbol = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
// Define types for color (e.g., 'w' or 'b')
export type PieceColor = 'w' | 'b';

interface PieceProps {
  type: PieceSymbol;
  color: PieceColor;
  isAnimating?: boolean;
  isDraggable?: boolean;
  isSelected?: boolean;
  squarePosition?: string;
  onDragStart?: (piece: { type: PieceSymbol; color: PieceColor }, from: string) => void;
  onDragEnd?: (piece: { type: PieceSymbol; color: PieceColor }, from: string, to: string | null) => void;
}

// Basic styled component for a piece with motion
const PieceContainer = styled(motion.div)<{ color: PieceColor; isSelected?: boolean; isDragging?: boolean }>`
  font-size: 30px; // Adjust as needed
  font-weight: bold;
  cursor: ${props => props.isDragging ? 'grabbing' : 'grab'};
  // Example: White pieces are white, black pieces are dark grey
  color: ${props => (props.color === 'w' ? '#eee' : '#333')};
  text-shadow: ${props => (props.color === 'w' ? '1px 1px 1px #333' : '1px 1px 1px #ccc')};
  user-select: none; // Prevent text selection on drag attempts
  transition: transform 0.1s ease;
  z-index: ${props => props.isDragging ? 1000 : 'auto'};
  
  &:hover {
    transform: ${props => props.isDragging ? 'none' : 'scale(1.05)'};
  }
  
  ${props => props.isSelected && `
    filter: drop-shadow(0 0 8px #ffff00);
    transform: scale(1.1);
  `}
`;

const pieceUnicode: Record<PieceColor, Record<PieceSymbol, string>> = {
  w: {
    p: '♙', // White Pawn
    r: '♖', // White Rook
    n: '♘', // White Knight
    b: '♗', // White Bishop
    q: '♕', // White Queen
    k: '♔', // White King
  },
  b: {
    p: '♟︎', // Black Pawn
    r: '♜', // Black Rook
    n: '♞', // Black Knight
    b: '♝', // Black Bishop
    q: '♛', // Black Queen
    k: '♚', // Black King
  },
};

const Piece: React.FC<PieceProps> = ({ 
  type, 
  color, 
  isAnimating = false, 
  isDraggable = false,
  isSelected = false,
  squarePosition,
  onDragStart,
  onDragEnd
}) => {
  const [isDragging, setIsDragging] = React.useState(false);

  const handleDragStart = () => {
    if (!isDraggable || !squarePosition) return;
    
    setIsDragging(true);
    onDragStart?.({ type, color }, squarePosition);
  };

  const handleDragEnd = (_event: unknown, info: { point: { x: number; y: number } }) => {
    if (!isDraggable || !squarePosition) return;
    
    setIsDragging(false);
    
    // Find the target square under the drag position
    const targetElement = document.elementFromPoint(
      info.point.x, 
      info.point.y
    );
    
    let targetSquare = null;
    if (targetElement) {
      // Find the square container by traversing up the DOM
      let element = targetElement as HTMLElement;
      while (element && !element.dataset.square) {
        element = element.parentElement as HTMLElement;
      }
      
      if (element && element.dataset.square) {
        targetSquare = element.dataset.square;
      }
    }
    
    onDragEnd?.({ type, color }, squarePosition, targetSquare);
  };

  // Configure drag props only if draggable
  const dragProps = isDraggable ? {
    drag: true,
    dragMomentum: false,
    dragElastic: 0.1,
    dragTransition: { bounceStiffness: 300, bounceDamping: 20 },
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    whileDrag: { 
      scale: 1.2, 
      zIndex: 1000,
      transition: { duration: 0.1 }
    }
  } : {};

  return (
    <PieceContainer 
      color={color}
      isSelected={isSelected}
      isDragging={isDragging}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: isSelected ? 1.1 : 1, 
        opacity: 1,
        rotate: isAnimating ? [0, 5, -5, 0] : 0
      }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut"
      }}
      whileHover={isDraggable && !isDragging ? { scale: 1.1 } : {}}
      whileTap={isDraggable && !isDragging ? { scale: 0.95 } : {}}
      {...dragProps}
    >
      {pieceUnicode[color][type] || ''}
    </PieceContainer>
  );
};

export default Piece;
