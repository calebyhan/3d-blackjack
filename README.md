# 3D Blackjack Game

A 3D blackjack game built with React, TypeScript, Three.js (via React Three Fiber), and Zustand.

## Project Setup ✅

The project is already scaffolded with:
- ✅ Vite + React 19 + TypeScript
- ✅ All dependencies installed (Three.js, React Three Fiber, Drei, React Spring, Zustand)
- ✅ Folder structure created
- ✅ TypeScript configured

## Next Steps

### Option 1: Use the One-Shot Prompt (Recommended)

Open `IMPLEMENTATION_PROMPT.md` and use it with Claude or another AI to generate all the implementation code at once. The prompt includes:

- Complete implementation details for all files
- Code snippets for every component
- Game logic (deck, rules, dealer AI)
- Zustand store setup
- 3D components (Scene, Table, Card, Hand)
- UI components (Controls, Scores, Status)
- Styling

Simply copy the contents of `IMPLEMENTATION_PROMPT.md` and paste it into your AI assistant.

### Option 2: Implement Manually

Follow the file structure in `IMPLEMENTATION_PROMPT.md` and implement each component step by step.

## File Structure

```
src/
├── game/
│   ├── types.ts       # Card, Suit, Rank types
│   ├── deck.ts        # Deck creation & shuffling
│   ├── rules.ts       # Blackjack scoring logic
│   └── dealer.ts      # Dealer AI
├── store/
│   └── gameStore.ts   # Zustand game state
├── components/
│   ├── Scene.tsx      # Main 3D canvas
│   ├── Table.tsx      # Green felt table
│   ├── Card.tsx       # 3D card component
│   ├── Hand.tsx       # Card collection
│   └── UI/
│       ├── GameControls.tsx
│       ├── ScoreDisplay.tsx
│       └── GameStatus.tsx
├── App.tsx
└── App.css
```

## Running the Project

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Three.js** - 3D graphics
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful Three.js helpers
- **@react-spring/three** - Physics-based animations
- **Zustand** - State management

## Game Features

- ✅ Basic blackjack rules (Hit/Stand)
- ✅ Single player vs dealer
- ✅ 3D card rendering with flip animations
- ✅ Automatic dealer AI (hits on <17)
- ✅ Score tracking
- ✅ Win/loss detection

## Development Timeline

Estimated 2-hour implementation:
- Hour 1: Game logic + Zustand store + Basic 3D scene
- Hour 2: Card components + UI + Polish

## Quick Start Guide

1. **Read** `IMPLEMENTATION_PROMPT.md`
2. **Generate** all the code using the prompt with an AI assistant
3. **Run** `npm run dev`
4. **Play** blackjack at `http://localhost:5173`

Good luck! 🎰
