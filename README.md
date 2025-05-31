# Chess Game - React + TypeScript

A fully functional browser-based chess game built with React, TypeScript, and Vite. Features both Player vs Player and Player vs AI modes with complete chess rule implementation.

## 🎮 Features

### Core Gameplay

- **Complete Chess Rules**: Full implementation using chess.js library
- **Interactive Board**: Click-to-select and click-to-move piece interaction
- **Visual Feedback**:
  - Selected pieces highlighted in yellow
  - Legal moves shown with green circular indicators
  - Real-time game status updates
- **Pawn Promotion**: Modal dialog for piece selection upon pawn promotion
- **Game Detection**: Automatic detection of check, checkmate, stalemate, and draw conditions

### Game Modes

- **Player vs Player**: Local hotseat gameplay for two human players
- **Player vs AI**: Single-player mode against computer opponent
  - **Random AI**: Makes completely random legal moves
  - **Easy AI**: Prioritizes capturing pieces when possible

### UI/UX

- **Clean Design**: Modern styling with Emotion/styled-components
- **Responsive Layout**: Works well on different screen sizes
- **Game Controls**: Easy game reset and mode switching
- **Status Display**: Clear indication of current turn and game state

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd chess-js
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎯 How to Play

1. **Select a Piece**: Click on any piece of your color to select it
2. **Make a Move**: Click on a highlighted green square to move the selected piece
3. **Pawn Promotion**: When a pawn reaches the opposite end, choose your promotion piece
4. **Game Modes**: Toggle between "Player vs Player" and "vs AI" using the mode button
5. **Reset Game**: Click "New Game" to start over

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Chess Logic**: chess.js library
- **Styling**: Emotion/styled-components
- **State Management**: React hooks (useState, useEffect)

## 📁 Project Structure

```
src/
├── components/
│   ├── Board/Board.tsx          # Main game logic and board rendering
│   ├── Square/Square.tsx        # Individual square with piece display
│   ├── Piece/Piece.tsx         # Unicode piece rendering
│   ├── GameInfo/GameInfo.tsx   # Game status and controls
│   └── PromotionDialog/PromotionDialog.tsx # Pawn promotion modal
└── logic/
    └── ai.ts                   # AI implementation with multiple strategies
```

## 🤖 AI Implementation

The AI opponent uses a modular architecture with different strategies:

- **Random Strategy**: Selects moves randomly from all legal options
- **Easy Strategy**: Prioritizes capturing opponent pieces when possible, otherwise plays randomly

Future enhancements could include more sophisticated algorithms like Minimax with Alpha-Beta pruning.

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Adding New Features

The codebase is structured for easy extension:

- Add new AI strategies in `src/logic/ai.ts`
- Extend UI components in their respective directories
- Game logic enhancements can be added to `Board.tsx`

## 🎨 Customization

The game uses Emotion for styling, making it easy to customize:

- Board colors and sizing in `Board.tsx`
- Piece styling in `Piece.tsx`
- UI theme colors in respective component files

## 📝 Chess Rules Implemented

- ✅ All standard piece movements
- ✅ Castling (kingside and queenside)
- ✅ En passant capture
- ✅ Pawn promotion with piece selection
- ✅ Check and checkmate detection
- ✅ Stalemate and draw conditions
- ✅ Turn-based gameplay
- ✅ Move validation

## 🔮 Future Enhancements

- [ ] Piece movement animations with Framer Motion
- [ ] Enhanced AI with Minimax algorithm
- [ ] Move history and game notation display
- [ ] Sound effects and better visual feedback
- [ ] Drag-and-drop piece movement
- [ ] Customizable themes and piece sets
- [ ] Online multiplayer capabilities
- [ ] Game timing and clocks

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## Development Notes

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
