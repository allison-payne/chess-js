import React from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import Piece from '../Piece/Piece';
import type { PieceSymbol, PieceColor } from '../Piece/Piece';

interface PromotionDialogProps {
  color: PieceColor;
  onPromotion: (piece: PieceSymbol) => void;
  onCancel: () => void;
}

const DialogOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const DialogContainer = styled(motion.div)`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  max-width: 300px;
`;

const DialogTitle = styled.h3`
  margin: 0 0 15px 0;
  text-align: center;
  color: #333;
`;

const PieceOptions = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 10px;
  margin-bottom: 15px;
`;

const PieceButton = styled.button`
  background-color: #f5f5f5;
  border: 2px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #4CAF50;
    background-color: #e8f5e8;
  }
`;

const CancelButton = styled.button`
  width: 100%;
  padding: 8px;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #d32f2f;
  }
`;

const PromotionDialog: React.FC<PromotionDialogProps> = ({ color, onPromotion, onCancel }) => {
  const promotionPieces: PieceSymbol[] = ['q', 'r', 'b', 'n'];

  return (
    <DialogOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <DialogContainer
        initial={{ scale: 0.5, opacity: 0, y: -50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.5, opacity: 0, y: -50 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <DialogTitle>Choose Promotion Piece</DialogTitle>
        <PieceOptions>
          {promotionPieces.map((pieceType, index) => (
            <motion.div
              key={pieceType}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: index * 0.1,
                duration: 0.3,
                ease: "easeOut"
              }}
            >
              <PieceButton
                onClick={() => onPromotion(pieceType)}
                title={getPieceName(pieceType)}
              >
                <Piece type={pieceType} color={color} />
              </PieceButton>
            </motion.div>
          ))}
        </PieceOptions>
        <CancelButton onClick={onCancel}>Cancel</CancelButton>
      </DialogContainer>
    </DialogOverlay>
  );
};

function getPieceName(piece: PieceSymbol): string {
  switch (piece) {
    case 'q': return 'Queen';
    case 'r': return 'Rook';
    case 'b': return 'Bishop';
    case 'n': return 'Knight';
    default: return '';
  }
}

export default PromotionDialog;
