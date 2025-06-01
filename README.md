# Chess Game - React + TypeScript + Framer Motion

A fully functional browser-based chess game built with React, TypeScript, and Vite. Features smooth animations, both Player vs Player and Player vs AI modes, and complete chess rule implementation with professional polish.

## 🎮 Features

### Core Gameplay

- **Complete Chess Rules**: Full implementation using chess.js library
- **Interactive Board**: Click-to-select and click-to-move piece interaction
- **Smooth Animations**: Professional Framer Motion integration throughout
- **Visual Feedback**:
  - Selected pieces highlighted in yellow
  - Legal moves shown with pulsing green circular indicators
  - Last move highlighting for better game tracking
  - Real-time game status updates with smooth transitions
- **Pawn Promotion**: Animated modal dialog for piece selection upon pawn promotion
- **Game Detection**: Automatic detection of check, checkmate, stalemate, and draw conditions
- **Enhanced Interactions**: Hover effects, tap feedback, and responsive animations

### Game Modes

- **Player vs Player**: Local hotseat gameplay for two human players
- **Player vs AI**: Single-player mode against computer opponent
  - **Random AI**: Makes completely random legal moves
  - **Easy AI**: Prioritizes capturing pieces when possible

### UI/UX

- **Modern Design**: Clean styling with Emotion/styled-components
- **Professional Animations**: Comprehensive Framer Motion integration
  - Piece entrance animations with scale/opacity effects
  - Hover interactions (1.1x scale) and tap feedback (0.95x scale)
  - Board entrance with 3D rotation effect
  - Shake animation during check states
  - Smooth modal transitions with staggered effects
- **Responsive Layout**: Works well on different screen sizes
- **Game Controls**: Animated buttons for game reset and mode switching
- **Status Display**: Clear indication of current turn and game state with smooth transitions

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
- **Animations**: Framer Motion for smooth transitions and interactive effects
- **State Management**: React hooks (useState, useEffect, useCallback)

## 📁 Project Structure

```
src/
├── components/
│   ├── Board/Board.tsx          # Main game logic, board rendering, and animation coordination
│   ├── Square/Square.tsx        # Individual square with piece display and transition animations
│   ├── Piece/Piece.tsx         # Unicode piece rendering with hover/tap effects
│   ├── GameInfo/GameInfo.tsx   # Game status and controls with animated state transitions
│   └── PromotionDialog/PromotionDialog.tsx # Animated pawn promotion modal with staggered effects
└── logic/
    └── ai.ts                   # AI implementation with multiple strategies
```

## 🤖 AI Implementation

The AI opponent uses a modular architecture with different strategies:

- **Random Strategy**: Selects moves randomly from all legal options
- **Easy Strategy**: Prioritizes capturing opponent pieces when possible, otherwise plays randomly

Future enhancements could include more sophisticated algorithms like Minimax with Alpha-Beta pruning.

## ✨ Animation Features

The game includes comprehensive animations powered by Framer Motion:

### Piece Interactions

- **Entrance Animations**: Scale and opacity effects when pieces appear
- **Hover Effects**: 1.1x scale on piece hover for better interactivity
- **Tap Feedback**: 0.95x scale on piece selection for responsive feel
- **Rotation Effects**: Special animations during captures and promotions

### Board Dynamics

- **3D Entrance**: Board appears with rotateX animation for dramatic effect
- **Check Animation**: Board shake effect when a player is in check
- **Last Move Highlighting**: Visual tracking of the most recent move

### UI Transitions

- **Modal Animations**: Smooth promotion dialog with overlay fade and staggered piece selection
- **Status Transitions**: Animated text changes for game state updates
- **Button Interactions**: Hover and tap effects on all interactive elements
- **Legal Move Indicators**: Pulsing animations on available move squares

### Performance Optimizations

- **useCallback**: Optimized animation triggers for efficient re-renders
- **AnimatePresence**: Smooth transitions when components mount/unmount
- **Coordinated Timing**: Carefully timed animations for professional feel

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

The game uses Emotion for styling and Framer Motion for animations, making it easy to customize:

- Board colors and sizing in `Board.tsx`
- Piece styling and animations in `Piece.tsx`
- Animation timing and effects throughout all components
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

- [ ] Enhanced AI with Minimax algorithm and Alpha-Beta pruning
- [ ] Integration with WebAssembly chess engines (e.g., Stockfish.js)
- [ ] Move history and game notation display
- [ ] Sound effects and audio feedback
- [ ] Drag-and-drop piece movement
- [ ] Customizable themes and piece sets
- [ ] Online multiplayer capabilities
- [ ] Game timing and chess clocks
- [ ] Persistent game state with localStorage
- [ ] Move analysis and hints
- [ ] Tournament mode and player statistics

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## Development Notes

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh
