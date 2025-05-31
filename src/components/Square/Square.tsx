import React from 'react';
import styled from '@emotion/styled';
import Piece from '../Piece/Piece';
import type { PieceSymbol, PieceColor } from '../Piece/Piece';

// Define props for the Square component
interface SquareProps {
  isEven: boolean;
  piece: { type: PieceSymbol; color: PieceColor } | null;
  isSelected?: boolean;
  isLegalMove?: boolean;
  onClick?: () => void;
}

// Define props specifically for the SquareContainer styled component
interface SquareContainerProps {
  isEven: boolean;
  isSelected?: boolean;
  isLegalMove?: boolean;
}

// Styled component for a single square
const SquareContainer = styled.div<SquareContainerProps>`
  width: 100%;
  height: 100%;
  background-color: ${props => {
    if (props.isSelected) {
      return '#ffff00'; // Yellow highlight for selected square
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
    }
  `}
`;

const Square: React.FC<SquareProps> = ({ isEven, piece, isSelected = false, isLegalMove = false, onClick }) => {
  return (
    <SquareContainer 
      isEven={isEven} 
      isSelected={isSelected}
      isLegalMove={isLegalMove}
      onClick={onClick}
    >
      {piece && <Piece type={piece.type} color={piece.color} />}
    </SquareContainer>
  );
};

export default Square;
