# Chess Game Implementation Plan (Browser-Based)

This document outlines the plan for developing a browser-based chess game. The initial version will be a client-side application with no backend.

## 1. Technology Stack

- **UI Framework:** React
  - _Reasoning:_ Component-based architecture, large community, rich ecosystem, suitable for interactive UIs.
- **Chess Logic Library:** `chess.js`
  - _Reasoning:_ Provides robust chess rule validation, move generation, FEN notation support, and game state management (check, checkmate, stalemate).
- **AI Algorithm:** Minimax (with potential for Alpha-Beta Pruning later)
  - _Reasoning:_ A standard algorithm for game AI. A simple version can be implemented in JavaScript to run in the browser. `chess.js` will be used by the AI to evaluate moves and game states.
- **Animation Library:** Framer Motion
  - _Reasoning:_ Provides an easy-to-use API for creating smooth animations and transitions in React applications.
- **Build Tool:** Vite (recommended for new React projects for its speed) or Create React App.

## 2. Project Setup

1.  **Initialize Project:**
    - Use Vite: `npm create vite@latest chess-js --template react`
    - Or Create React App: `npx create-react-app chess-js`
    - Navigate into the project directory: `cd chess-js`
2.  **Install Dependencies:**
    - `npm install chess.js framer-motion @emotion/react @emotion/styled`
    - If using TypeScript (recommended with Vite): `npm install @types/react @types/react-dom --save-dev` (Note: `@types/react` and `@types/react-dom` are typically included by default with the `react-ts` Vite template).
3.  **Basic Project Structure:**
    - `src/`
      - `components/` (React components)
        - `Board/`
        - `Square/`
        - `Piece/`
        - `GameInfo/`
      - `logic/` (Chess game logic, AI)
      - `assets/` (Piece images/SVGs)
      - `App.jsx` (or `App.tsx`)
      - `main.jsx` (or `main.tsx`)
      - `index.css` (or other styling solution)

## 3. Core Chess Logic (using `chess.js`)

1.  **Game State Management:**
    - Initialize `chess.js` instance: `const game = new Chess();`
    - Store game state (FEN string, current turn, game over status) in React state (e.g., `useState` or a state management library like Zustand/Redux if complexity grows).
2.  **Move Validation:**
    - Use `game.move({ from, to, promotion })` which validates moves internally.
3.  **Legal Move Generation:**
    - Use `game.moves({ square: 'e4', verbose: true })` to get legal moves for a selected piece.
4.  **Game Status Detection:**
    - `game.isGameOver()`, `game.isCheckmate()`, `game.isStalemate()`, `game.isDraw()`, `game.isCheck()`.
5.  **Piece Representation:**
    - Map `chess.js` piece types (e.g., `{ type: 'p', color: 'w' }`) to visual representations.

## 4. UI Development (React & Framer Motion)

1.  **`Board` Component:**
    - Renders an 8x8 grid of `Square` components.
    - Gets board state from `chess.js` (`game.board()`).
    - Passes piece information and square properties to `Square` components.
2.  **`Square` Component:**
    - Represents a single square on the board.
    - Displays a `Piece` component if a piece is present.
    - Handles click events for piece selection and movement.
    - Alternating colors (light/dark).
    - Highlights for selected piece and legal moves.
3.  **`Piece` Component:**
    - Displays the visual representation of a chess piece (e.g., SVG or image).
    - Can be made draggable (using Framer Motion or native drag-and-drop).
4.  **`GameInfo` Component:**
    - Displays current player's turn.
    - Shows captured pieces (optional for V1).
    - Displays game status messages (e.g., "Check!", "White wins by Checkmate").
    - Button to reset the game (`game.reset()`).
5.  **Animations (Framer Motion):**
    - Animate piece movement from one square to another.
    - Animate piece capture (e.g., fading out captured piece).
    - Subtle UI feedback animations.

## 5. Player Interaction

1.  **Move Input:**
    - **Option 1 (Click-Click):**
      - Click a piece to select it.
      - Legal moves for the selected piece are highlighted.
      - Click a highlighted square to make the move.
    - **Option 2 (Drag-and-Drop):**
      - Drag a piece from its source square.
      - Drop it onto a target square.
      - Validate the move upon drop.
2.  **Visual Feedback:**
    - Highlight the selected piece.
    - Highlight available legal moves for the selected piece.
    - Clear highlights after a move or deselection.

## 6. Basic AI Opponent

1.  **AI Logic (`logic/ai.js`):**
    - Function `makeAIMove(gameInstance)` that takes the current `chess.js` game instance.
2.  **Move Selection (Initial - Simple):**
    - Get all legal moves: `const moves = gameInstance.moves();`
    - **Strategy 1 (Random):** Pick a random move from `moves`.
    - **Strategy 2 (Basic Minimax - Level 1-2 depth):**
      - Implement a simple evaluation function (e.g., material count: Pawn=1, Knight/Bishop=3, Rook=5, Queen=9).
      - Implement Minimax algorithm to a shallow depth.
      - Choose the move that maximizes the AI's score (or minimizes player's score).
3.  **Integration:**
    - After the player makes a valid move, if it's the AI's turn, call `makeAIMove`.
    - Update the board and game state with the AI's move.

## 7. Styling

1.  **CSS (Styled Components - Emotion):**
    - **Choice:** Emotion.js (a performant and flexible CSS-in-JS library, similar to Styled Components).
    - _Reasoning:_ Excellent for component-scoped styles, dynamic styling based on props/state (crucial for game interactions like highlighting squares or pieces), theming capabilities, and allows leveraging JavaScript for styling logic.
    - Define styles for the board, squares, pieces, and overall layout directly within their respective components.
    - **Pseudo-3D/2.5D Effects:** Employ CSS techniques like `box-shadow`, `transform` (perspective, rotateX/Y), gradients, and pseudo-elements to create an illusion of depth for the board and pieces, enhancing visual appeal without full 3D rendering.
    - Ensure responsive design for different screen sizes (basic consideration for V1).

## 8. Development Phases (Suggested)

### ✅ Phase 1: Core Setup & Board Rendering (COMPLETED)

- ✅ Project setup with Vite + React + TypeScript
- ✅ Dependencies installed: chess.js, @emotion/react, @emotion/styled
- ✅ Static 8x8 board rendering with proper chess colors
- ✅ chess.js integration for initial board state
- ✅ Unicode chess pieces display
- ✅ Basic Emotion/styled-components styling

### ✅ Phase 2: Player Movement & Game Logic (COMPLETED)

- ✅ Piece selection with click handling
- ✅ Visual feedback (yellow highlight for selected pieces)
- ✅ Legal move calculation and highlighting (green squares with circular indicators)
- ✅ Move execution with proper validation
- ✅ Turn management between white/black

### ✅ Phase 3: Game Status Display (COMPLETED)

- ✅ GameInfo component showing current turn
- ✅ Game status detection (check, checkmate, stalemate, draw)
- ✅ Reset game functionality
- ✅ Mode switching between "vs AI" and "Player vs Player"

### ✅ Phase 4: Basic AI Opponent (COMPLETED)

- ✅ AI logic module with random and "easy" (capture-preferring) strategies
- ✅ Automatic AI moves when it's black's turn in AI mode
- ✅ Proper turn restrictions (human can only move when it's their turn)
- ✅ 500ms thinking delay for better UX
- ✅ AI-specific status messages

### ✅ Phase 5: Pawn Promotion (COMPLETED)

- ✅ Pawn promotion detection using chess.js move flags
- ✅ Modal promotion dialog with piece selection (Queen, Rook, Bishop, Knight)
- ✅ Proper promotion handling for both human and AI players
- ✅ AI automatically promotes to Queen for optimal play

### 🔄 Phase 6: Animations & Polish (PENDING)

- 🔄 Add piece movement animations with Framer Motion
- 🔄 Refine UI/UX styling and visual effects
- 🔄 Enhanced board and piece styling

## 9. Current Implementation Status

### Completed Features ✅

- **Full Chess Game Logic**: Complete implementation using chess.js with proper move validation, check detection, and game-over conditions
- **Interactive Board**: 8x8 grid with click-to-select and click-to-move functionality
- **Visual Feedback**: Selected pieces highlighted in yellow, legal moves shown with green circular indicators
- **AI Opponent**: Two difficulty levels (random and easy/capture-preferring) with automatic move execution
- **Game Modes**: Toggle between Player vs Player and Player vs AI
- **Pawn Promotion**: Complete implementation with modal dialog for piece selection
- **Game Status Display**: Real-time updates showing turn, check status, game outcome
- **Responsive Design**: Clean styling with Emotion/styled-components

### Technical Implementation

- **Frontend**: React 18 + TypeScript + Vite
- **Chess Logic**: chess.js library for robust rule validation
- **Styling**: Emotion/styled-components for component-scoped CSS
- **State Management**: React hooks (useState, useEffect) for game state
- **AI Architecture**: Modular ChessAI class with pluggable strategies

### File Structure

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

## 10. Future Enhancements (Post-Initial Version)

- More sophisticated AI (Minimax with Alpha-Beta Pruning, iterative deepening).
- Integration with a WebAssembly chess engine (e.g., Stockfish.js).
- Move history display and navigation.
- Player vs. Player mode (local hotseat).
- Selectable piece sets and board themes.
- Sound effects.
- Persistent game state (using `localStorage`).
- Backend integration for online multiplayer (significant expansion).
- Timers for moves/games.

This plan provides a roadmap for the initial development. Specific details and priorities can be adjusted as development progresses.
