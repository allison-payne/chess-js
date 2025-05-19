import React from 'react';
import styled from '@emotion/styled';

// Define types for piece (e.g., 'p', 'r', 'n', 'b', 'q', 'k')
export type PieceSymbol = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
// Define types for color (e.g., 'w' or 'b')
export type PieceColor = 'w' | 'b';

interface PieceProps {
  type: PieceSymbol;
  color: PieceColor;
}

// Basic styled component for a piece
// We'll use text for now, SVGs/images would be better for actual visuals
const PieceContainer = styled.div`
  font-size: 30px; // Adjust as needed
  font-weight: bold;
  // Example: White pieces are white, black pieces are dark grey
  color: ${props => (props.color === 'w' ? '#eee' : '#333')};
  text-shadow: ${props => (props.color === 'w' ? '1px 1px 1px #333' : '1px 1px 1px #ccc')};
  user-select: none; // Prevent text selection on drag attempts
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

const Piece: React.FC<PieceProps> = ({ type, color }) => {
  return (
    <PieceContainer color={color}>
      {pieceUnicode[color][type] || ''}
    </PieceContainer>
  );
};

export default Piece;
