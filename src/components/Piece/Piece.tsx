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
}

// Basic styled component for a piece with motion
const PieceContainer = styled(motion.div)<{ color: PieceColor }>`
  font-size: 30px; // Adjust as needed
  font-weight: bold;
  cursor: pointer;
  // Example: White pieces are white, black pieces are dark grey
  color: ${props => (props.color === 'w' ? '#eee' : '#333')};
  text-shadow: ${props => (props.color === 'w' ? '1px 1px 1px #333' : '1px 1px 1px #ccc')};
  user-select: none; // Prevent text selection on drag attempts
  transition: transform 0.1s ease;
  
  &:hover {
    transform: scale(1.05);
  }
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

const Piece: React.FC<PieceProps> = ({ type, color, isAnimating = false }) => {
  return (
    <PieceContainer 
      color={color}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        rotate: isAnimating ? [0, 5, -5, 0] : 0
      }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut"
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {pieceUnicode[color][type] || ''}
    </PieceContainer>
  );
};

export default Piece;
