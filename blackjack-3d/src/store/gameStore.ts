import { create } from 'zustand';
import type { GameStore } from '../game/types';
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

    // Deal initial cards alternating: player, dealer, player, dealer
    const card1 = deck.pop()!; // Player first card
    const card2 = deck.pop()!; // Dealer first card (upcard - visible)
    const card3 = deck.pop()!; // Player second card
    const card4 = deck.pop()!; // Dealer second card (hole card - hidden)
    
    const playerHand = [card1, card3];
    const dealerHand = [card2, card4];

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
