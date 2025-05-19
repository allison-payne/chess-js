import React from 'react';
import styled from '@emotion/styled';
import { Chess } from 'chess.js'; // Import Chess
import Square from '../Square/Square';
import type { PieceSymbol, PieceColor } from '../Piece/Piece'; // Import types for piece data

// Basic styled component for the board container
const BoardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);
  width: 400px; // Example size, can be adjusted
  height: 400px; // Example size, can be adjusted
  border: 2px solid #333;
`;

const Board: React.FC = () => {
  // Initialize chess.js game instance
  // For now, it's a new game. Later, this could come from state or props.
  const game = new Chess();

  const renderSquares = () => {
    const squares = [];
    const boardState = game.board(); // Get the board state from chess.js

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const squareData = boardState[row][col];
        const piece = squareData ? { type: squareData.type as PieceSymbol, color: squareData.color as PieceColor } : null;
        const isEven = (row + col) % 2 === 0;
        const squareKey = `square-${row}-${col}`;

        squares.push(
          <Square
            key={squareKey}
            isEven={isEven}
            piece={piece}
          />
        );
      }
    }
    return squares;
  };

  return (
    <BoardContainer>
      {renderSquares()}
    </BoardContainer>
  );
};

export default Board;
