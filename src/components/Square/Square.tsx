import React from 'react';
import styled from '@emotion/styled';
import Piece from '../Piece/Piece';
import type { PieceSymbol, PieceColor } from '../Piece/Piece';

// Define props for the Square component
interface SquareProps {
  isEven: boolean;
  piece: { type: PieceSymbol; color: PieceColor } | null;
}

// Define props specifically for the SquareContainer styled component
interface SquareContainerProps {
  isEven: boolean;
}

// Styled component for a single square
const SquareContainer = styled.div<SquareContainerProps>`
  width: 100%;
  height: 100%;
  background-color: ${props => (props.isEven ? '#f0d9b5' : '#b58863')};
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box; 
`;

const Square: React.FC<SquareProps> = ({ isEven, piece }) => {
  return (
    <SquareContainer isEven={isEven}>
      {piece && <Piece type={piece.type} color={piece.color} />}
    </SquareContainer>
  );
};

export default Square;
