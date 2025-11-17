# 3D Blackjack Game - One-Shot Implementation Prompt

## Project Context
You are implementing a 3D blackjack game using React, TypeScript, Three.js (via React Three Fiber), and Zustand for state management. The project structure is already set up with all dependencies installed.

## Tech Stack
- **React 19** + **TypeScript**
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Helper components (OrbitControls, Environment, Text)
- **@react-spring/three** - Physics-based animations
- **Zustand** - Lightweight state management
- **Vite** - Build tool

## Requirements
- **Simple & clean visuals**: Flat card planes with basic textures/colors, green felt table
- **Basic blackjack rules**: Hit/Stand only, single player vs dealer
- **Client-side only**: All game logic in the browser
- **Stationary camera**: Player faces the table, cards slide into position
- **2-hour timeline**: Focus on functionality over polish

## File Structure to Implement

```
src/
├── main.tsx                    # Entry point (already exists, may need updates)
├── App.tsx                     # Main app component
├── App.css                     # Styling
├── game/
│   ├── types.ts               # Card, Suit, Rank, GameState types
│   ├── deck.ts                # Deck creation & shuffling
│   ├── rules.ts               # Scoring, blackjack, bust checking
│   └── dealer.ts              # Dealer AI logic
├── store/
│   └── gameStore.ts           # Zustand game state store
├── components/
│   ├── Scene.tsx              # Main 3D canvas wrapper
│   ├── Table.tsx              # 3D green felt table
│   ├── Card.tsx               # Single 3D card component
│   ├── Hand.tsx               # Collection of cards
│   └── UI/
│       ├── GameControls.tsx   # Hit/Stand/New Game buttons
│       ├── ScoreDisplay.tsx   # Player/Dealer scores
│       └── GameStatus.tsx     # Win/Loss/Push messages
└── utils/
    └── cardTextures.ts        # Card color/texture helpers (optional)
```

---

## Implementation Details

### 1. src/game/types.ts
Define core game types:

```typescript
export type Suit = 'H' | 'D' | 'C' | 'S'; // Hearts, Diamonds, Clubs, Spades
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A';

export interface Card {
  suit: Suit;
  rank: Rank;
  id: string; // Unique identifier for React keys
}

export type GameState = 'idle' | 'playing' | 'dealer-turn' | 'game-over';

export interface GameStore {
  // State
  deck: Card[];
  playerHand: Card[];
  dealerHand: Card[];
  gameState: GameState;
  message: string;

  // Computed values
  playerScore: number;
  dealerScore: number;
  dealerShowAll: boolean; // Show dealer's hidden card

  // Actions
  startNewGame: () => void;
  hit: () => void;
  stand: () => void;
  dealCard: (to: 'player' | 'dealer') => Card;
  updateScores: () => void;
  playDealerTurn: () => void;
  determineWinner: () => void;
}
```

**Key points:**
- Each card has a unique `id` for React keys (e.g., `${suit}${rank}-${timestamp}`)
- Keep types simple and focused

---

### 2. src/game/deck.ts
Implement deck creation and shuffling:

```typescript
import type { Card, Suit, Rank } from './types';

const suits: Suit[] = ['H', 'D', 'C', 'S'];
const ranks: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export function createDeck(): Card[] {
  const deck: Card[] = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({
        suit,
        rank,
        id: `${suit}${rank}-${Math.random()}` // Simple unique ID
      });
    }
  }

  return shuffleDeck(deck);
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];

  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}
```

**Key points:**
- Use Fisher-Yates shuffle for randomization
- Generate unique IDs for each card instance

---

### 3. src/game/rules.ts
Implement blackjack scoring and rules:

```typescript
import type { Card } from './types';

export function getCardValue(card: Card): number {
  if (card.rank === 'A') return 11;
  if (['J', 'Q', 'K'].includes(card.rank)) return 10;
  return parseInt(card.rank);
}

export function calculateHandValue(hand: Card[]): number {
  let total = 0;
  let aces = 0;

  for (const card of hand) {
    const value = getCardValue(card);
    total += value;
    if (card.rank === 'A') aces++;
  }

  // Convert aces from 11 to 1 if busting
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }

  return total;
}

export function isBlackjack(hand: Card[]): boolean {
  return hand.length === 2 && calculateHandValue(hand) === 21;
}

export function isBust(hand: Card[]): boolean {
  return calculateHandValue(hand) > 21;
}

export function determineWinner(
  playerHand: Card[],
  dealerHand: Card[]
): string {
  const playerScore = calculateHandValue(playerHand);
  const dealerScore = calculateHandValue(dealerHand);

  const playerBJ = isBlackjack(playerHand);
  const dealerBJ = isBlackjack(dealerHand);

  if (playerBJ && !dealerBJ) return 'Blackjack! You win!';
  if (dealerBJ && !playerBJ) return 'Dealer has Blackjack!';
  if (playerBJ && dealerBJ) return 'Push - Both have Blackjack';

  if (playerScore > 21) return 'Bust! You lose.';
  if (dealerScore > 21) return 'Dealer busts! You win!';

  if (playerScore > dealerScore) return 'You win!';
  if (dealerScore > playerScore) return 'Dealer wins.';

  return 'Push (Tie)';
}
```

**Key points:**
- Handle ace conversion (11 → 1) properly
- Check for blackjack (21 with 2 cards)
- Return clear win/loss messages

---

### 4. src/game/dealer.ts
Simple dealer AI:

```typescript
import type { Card } from './types';
import { calculateHandValue } from './rules';

export function shouldDealerHit(hand: Card[]): boolean {
  const score = calculateHandValue(hand);
  return score < 17; // Standard casino rules: hit on 16 or less
}
```

**Key points:**
- Dealer must hit on 16 or less
- Dealer must stand on 17 or more (soft 17 rule not implemented for simplicity)

---

### 5. src/store/gameStore.ts
Zustand store with all game logic:

```typescript
import { create } from 'zustand';
import type { Card, GameState, GameStore } from '../game/types';
import { createDeck } from '../game/deck';
import { calculateHandValue, determineWinner, isBust } from '../game/rules';
import { shouldDealerHit } from '../game/dealer';

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  deck: [],
  playerHand: [],
  dealerHand: [],
  gameState: 'idle',
  message: 'Click "New Game" to start',
  playerScore: 0,
  dealerScore: 0,
  dealerShowAll: false,

  // Start a new game
  startNewGame: () => {
    const deck = createDeck();

    // Deal initial cards (player, dealer, player, dealer)
    const playerHand = [deck.pop()!, deck.pop()!];
    const dealerHand = [deck.pop()!, deck.pop()!];

    set({
      deck,
      playerHand,
      dealerHand,
      gameState: 'playing',
      message: 'Hit or Stand?',
      dealerShowAll: false,
      playerScore: calculateHandValue(playerHand),
      dealerScore: calculateHandValue([dealerHand[0]]) // Only show first card
    });
  },

  // Player hits
  hit: () => {
    const state = get();
    if (state.gameState !== 'playing') return;

    const deck = [...state.deck];
    const newCard = deck.pop()!;
    const playerHand = [...state.playerHand, newCard];
    const playerScore = calculateHandValue(playerHand);

    if (isBust(playerHand)) {
      set({
        deck,
        playerHand,
        playerScore,
        gameState: 'game-over',
        dealerShowAll: true,
        dealerScore: calculateHandValue(state.dealerHand),
        message: 'Bust! You lose.'
      });
    } else {
      set({
        deck,
        playerHand,
        playerScore
      });
    }
  },

  // Player stands
  stand: () => {
    const state = get();
    if (state.gameState !== 'playing') return;

    set({ gameState: 'dealer-turn', dealerShowAll: true });

    // Play dealer's turn
    setTimeout(() => {
      get().playDealerTurn();
    }, 500);
  },

  // Deal a card
  dealCard: (to: 'player' | 'dealer') => {
    const state = get();
    const deck = [...state.deck];
    const card = deck.pop()!;

    if (to === 'player') {
      set({
        deck,
        playerHand: [...state.playerHand, card]
      });
    } else {
      set({
        deck,
        dealerHand: [...state.dealerHand, card]
      });
    }

    return card;
  },

  // Update scores
  updateScores: () => {
    const state = get();
    set({
      playerScore: calculateHandValue(state.playerHand),
      dealerScore: calculateHandValue(state.dealerHand)
    });
  },

  // Play dealer's turn
  playDealerTurn: () => {
    const state = get();
    let dealerHand = [...state.dealerHand];
    let deck = [...state.deck];

    // Dealer hits until 17+
    while (shouldDealerHit(dealerHand)) {
      const newCard = deck.pop()!;
      dealerHand.push(newCard);
    }

    const dealerScore = calculateHandValue(dealerHand);
    const message = determineWinner(state.playerHand, dealerHand);

    set({
      dealerHand,
      deck,
      dealerScore,
      gameState: 'game-over',
      message
    });
  },

  // Determine winner (called after dealer's turn)
  determineWinner: () => {
    const state = get();
    const message = determineWinner(state.playerHand, state.dealerHand);
    set({ message, gameState: 'game-over' });
  }
}));
```

**Key points:**
- Use Zustand's `create` API
- Use `get()` to access current state in actions
- Use `set()` to update state
- Implement dealer turn with setTimeout for visual delay
- Only show dealer's first card until stand/bust

---

### 6. src/components/Scene.tsx
Main 3D scene container:

```typescript
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Table } from './Table';
import { Hand } from './Hand';
import { useGameStore } from '../store/gameStore';

export function Scene() {
  const playerHand = useGameStore((state) => state.playerHand);
  const dealerHand = useGameStore((state) => state.dealerHand);
  const dealerShowAll = useGameStore((state) => state.dealerShowAll);

  return (
    <Canvas
      camera={{ position: [0, 8, 12], fov: 50 }}
      style={{ background: '#1a1a2e' }}
    >
      {/* Lighting */}
      <Environment preset="sunset" />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* Camera controls (optional - can disable for fixed camera) */}
      <OrbitControls
        enablePan={false}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={8}
        maxDistance={20}
      />

      {/* Table */}
      <Table />

      {/* Dealer's hand (top) */}
      <Hand
        cards={dealerHand}
        position={[-3, 0.11, -3]}
        showAll={dealerShowAll}
        isDealer={true}
      />

      {/* Player's hand (bottom) */}
      <Hand
        cards={playerHand}
        position={[-3, 0.11, 2]}
        showAll={true}
        isDealer={false}
      />
    </Canvas>
  );
}
```

**Key points:**
- Use fixed camera position facing the table
- OrbitControls allows player to adjust view (optional)
- Environment preset for quick lighting
- Position dealer and player hands on opposite sides

---

### 7. src/components/Table.tsx
Simple green felt table:

```typescript
export function Table() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 15]} />
      <meshStandardMaterial color="#1a5f2f" roughness={0.8} />
    </mesh>
  );
}
```

**Key points:**
- Rotate plane to be horizontal
- Use green color for felt (#1a5f2f)
- Large enough to show cards

---

### 8. src/components/Card.tsx
Single 3D card with flip animation:

```typescript
import { useRef } from 'react';
import { useSpring, animated } from '@react-spring/three';
import { Text } from '@react-three/drei';
import type { Card as CardType } from '../game/types';
import * as THREE from 'three';

interface CardProps {
  card: CardType;
  position: [number, number, number];
  faceUp: boolean;
  index: number;
}

const CARD_WIDTH = 1.4;
const CARD_HEIGHT = 2;

// Get card color
function getCardColor(suit: string): string {
  return suit === 'H' || suit === 'D' ? '#ff0000' : '#000000';
}

// Get suit symbol
function getSuitSymbol(suit: string): string {
  const symbols = { H: '♥', D: '♦', C: '♣', S: '♠' };
  return symbols[suit as keyof typeof symbols] || suit;
}

export function Card({ card, position, faceUp, index }: CardProps) {
  const meshRef = useRef<THREE.Group>(null);

  // Animate card flip
  const { rotationY } = useSpring({
    rotationY: faceUp ? 0 : Math.PI,
    config: { tension: 200, friction: 25 }
  });

  // Stagger card appearance
  const offsetX = index * 0.6; // Spread cards horizontally
  const finalPosition: [number, number, number] = [
    position[0] + offsetX,
    position[1],
    position[2]
  ];

  const color = getCardColor(card.suit);
  const symbol = getSuitSymbol(card.suit);

  return (
    <animated.group
      ref={meshRef}
      position={finalPosition}
      rotation-y={rotationY}
    >
      {/* Card front (white background) */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Rank text */}
      <Text
        position={[0, 0.5, 0.02]}
        fontSize={0.4}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {card.rank}
      </Text>

      {/* Suit symbol */}
      <Text
        position={[0, 0, 0.02]}
        fontSize={0.6}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {symbol}
      </Text>

      {/* Card back (blue pattern) */}
      <mesh position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>

      {/* Card border/outline */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[CARD_WIDTH + 0.05, CARD_HEIGHT + 0.05]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
    </animated.group>
  );
}
```

**Key points:**
- Use `@react-spring/three` for smooth flip animation
- Two planes: front (white with rank/suit) and back (blue)
- Use `Text` from drei for rank and suit symbols
- Stagger cards horizontally using index
- Border mesh behind for card outline

---

### 9. src/components/Hand.tsx
Collection of cards:

```typescript
import { Card } from './Card';
import type { Card as CardType } from '../game/types';

interface HandProps {
  cards: CardType[];
  position: [number, number, number];
  showAll: boolean;
  isDealer: boolean;
}

export function Hand({ cards, position, showAll, isDealer }: HandProps) {
  return (
    <group position={position}>
      {cards.map((card, index) => {
        // Dealer's first card is hidden until showAll is true
        const faceUp = showAll || index > 0 || !isDealer;

        return (
          <Card
            key={card.id}
            card={card}
            position={[0, 0, 0]}
            faceUp={faceUp}
            index={index}
          />
        );
      })}
    </group>
  );
}
```

**Key points:**
- Map over cards array
- Dealer's first card (index 0) is hidden until `showAll` is true
- Player's cards are always face up
- Use card.id as React key

---

### 10. src/components/UI/GameControls.tsx
HTML overlay with game buttons:

```typescript
import { useGameStore } from '../../store/gameStore';

export function GameControls() {
  const gameState = useGameStore((state) => state.gameState);
  const hit = useGameStore((state) => state.hit);
  const stand = useGameStore((state) => state.stand);
  const startNewGame = useGameStore((state) => state.startNewGame);

  return (
    <div className="game-controls">
      {gameState === 'idle' && (
        <button onClick={startNewGame} className="btn btn-primary">
          New Game
        </button>
      )}

      {gameState === 'playing' && (
        <>
          <button onClick={hit} className="btn btn-success">
            Hit
          </button>
          <button onClick={stand} className="btn btn-warning">
            Stand
          </button>
        </>
      )}

      {(gameState === 'game-over' || gameState === 'dealer-turn') && (
        <button onClick={startNewGame} className="btn btn-primary">
          New Game
        </button>
      )}
    </div>
  );
}
```

**Key points:**
- Show different buttons based on game state
- Use Zustand hooks to access state and actions
- Simple button styling with CSS classes

---

### 11. src/components/UI/ScoreDisplay.tsx
Display player and dealer scores:

```typescript
import { useGameStore } from '../../store/gameStore';

export function ScoreDisplay() {
  const playerScore = useGameStore((state) => state.playerScore);
  const dealerScore = useGameStore((state) => state.dealerScore);
  const gameState = useGameStore((state) => state.gameState);

  return (
    <div className="score-display">
      <div className="score-item">
        <span className="score-label">Dealer:</span>
        <span className="score-value">{dealerScore}</span>
      </div>

      <div className="score-item">
        <span className="score-label">Player:</span>
        <span className="score-value">{playerScore}</span>
      </div>
    </div>
  );
}
```

---

### 12. src/components/UI/GameStatus.tsx
Display win/loss messages:

```typescript
import { useGameStore } from '../../store/gameStore';

export function GameStatus() {
  const message = useGameStore((state) => state.message);
  const gameState = useGameStore((state) => state.gameState);

  return (
    <div className="game-status">
      <h2 className={gameState === 'game-over' ? 'game-over' : ''}>
        {message}
      </h2>
    </div>
  );
}
```

---

### 13. src/App.tsx
Main application component:

```typescript
import { Scene } from './components/Scene';
import { GameControls } from './components/UI/GameControls';
import { ScoreDisplay } from './components/UI/ScoreDisplay';
import { GameStatus } from './components/UI/GameStatus';
import './App.css';

function App() {
  return (
    <div className="app">
      <div className="ui-overlay">
        <h1>3D Blackjack</h1>
        <GameStatus />
        <ScoreDisplay />
        <GameControls />
      </div>

      <div className="canvas-container">
        <Scene />
      </div>
    </div>
  );
}

export default App;
```

---

### 14. src/App.css
Basic styling:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  overflow: hidden;
}

.app {
  width: 100vw;
  height: 100vh;
  position: relative;
}

.canvas-container {
  width: 100%;
  height: 100%;
}

.ui-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 20px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, transparent 100%);
  color: white;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.game-status {
  margin: 20px 0;
  min-height: 40px;
}

.game-status h2 {
  font-size: 1.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

.game-status .game-over {
  color: #ffd700;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.score-display {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 20px 0;
  font-size: 1.2rem;
}

.score-item {
  background: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 8px;
  min-width: 120px;
}

.score-label {
  margin-right: 10px;
  font-weight: bold;
}

.score-value {
  font-size: 1.5rem;
  color: #ffd700;
}

.game-controls {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.btn {
  padding: 12px 30px;
  font-size: 1.1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.4);
}

.btn:active {
  transform: translateY(0);
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background: #45a049;
}

.btn-success {
  background: #2196F3;
  color: white;
}

.btn-success:hover {
  background: #0b7dda;
}

.btn-warning {
  background: #ff9800;
  color: white;
}

.btn-warning:hover {
  background: #e68900;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

---

### 15. src/main.tsx
Update if needed (should already exist):

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

---

## Running the Project

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Open browser:**
   Navigate to `http://localhost:5173`

3. **Test gameplay:**
   - Click "New Game" to start
   - Click "Hit" to take a card
   - Click "Stand" to end turn
   - Dealer plays automatically
   - See win/loss message
   - Click "New Game" to play again

---

## Implementation Checklist

- [ ] Create all type definitions in `src/game/types.ts`
- [ ] Implement deck creation and shuffling in `src/game/deck.ts`
- [ ] Implement scoring logic in `src/game/rules.ts`
- [ ] Implement dealer AI in `src/game/dealer.ts`
- [ ] Create Zustand store in `src/store/gameStore.ts`
- [ ] Create 3D components:
  - [ ] Scene.tsx
  - [ ] Table.tsx
  - [ ] Card.tsx
  - [ ] Hand.tsx
- [ ] Create UI components:
  - [ ] GameControls.tsx
  - [ ] ScoreDisplay.tsx
  - [ ] GameStatus.tsx
- [ ] Update App.tsx
- [ ] Create App.css
- [ ] Test full game flow

---

## Quick Wins & Optimizations

### If you have extra time:
1. **Card animations**: Add slide-in animations when cards are dealt using `@react-spring/three`
2. **Better card textures**: Use actual card images instead of text
3. **Sound effects**: Add card dealing and chip sounds
4. **Betting system**: Add chip betting before each hand
5. **Multiple decks**: Use 6 decks instead of 1 (more realistic)
6. **Split & double down**: Add advanced blackjack moves
7. **Statistics**: Track wins/losses across sessions

### If you're running out of time:
1. **Skip animations**: Cards just appear instantly
2. **Remove OrbitControls**: Fix camera completely
3. **Simplify UI**: Use basic HTML buttons without fancy styling
4. **Skip dealer delay**: Dealer plays instantly instead of setTimeout

---

## Common Issues & Solutions

### Cards not rendering:
- Check that `useGameStore` is providing cards array
- Verify card IDs are unique
- Check Three.js console warnings

### Animations not working:
- Ensure `@react-spring/three` is imported (not `@react-spring/web`)
- Use `animated.group` or `animated.mesh`, not regular `group`/`mesh`

### State not updating:
- Make sure you're using `set()` in Zustand actions
- Don't mutate state directly - always create new arrays/objects
- Use `get()` to access current state inside actions

### TypeScript errors:
- Ensure `@types/three` is installed
- Add `"three"` to `types` array in tsconfig.app.json
- Use `!` operator for array.pop() since we know deck has cards

---

## Success Criteria

✅ **Game works**: Player can hit, stand, and see win/loss
✅ **3D renders**: Cards and table visible in 3D scene
✅ **Rules correct**: Scoring follows blackjack rules
✅ **UI functional**: Buttons work, scores update
✅ **No crashes**: Game handles all states without errors

---

## Final Notes

- **Focus on functionality first**, polish later
- **Test frequently** during development
- **Keep it simple** - you have 2 hours
- **Don't over-engineer** - basic implementation is fine
- **Have fun!** It's blackjack after all 🎰

Good luck building your 3D blackjack game!
