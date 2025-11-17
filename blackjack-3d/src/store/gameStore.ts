import { create } from 'zustand';
import type { GameStore } from '../game/types';
import { createDeck } from '../game/deck';
import { calculateHandValue, determineWinner, isBust, isBlackjack } from '../game/rules';
import { shouldDealerHit } from '../game/dealer';

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  deck: [],
  playerHand: [],
  dealerHand: [],
  gameState: 'idle',
  message: 'Place your bet to start',
  playerScore: 0,
  dealerScore: 0,
  dealerShowAll: false,

  // Betting state
  playerBalance: 10000,
  currentBet: 0,

  // Start a new game
  startNewGame: () => {
    const state = get();

    // Check if bet is placed
    if (state.currentBet === 0) {
      set({ message: 'Place a bet first!' });
      return;
    }

    // Check if player has enough balance
    if (state.currentBet > state.playerBalance) {
      set({ message: 'Insufficient balance!' });
      return;
    }

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
        message: `Bust! You lose $${state.currentBet}.`,
        playerBalance: state.playerBalance - state.currentBet,
        currentBet: 0
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
    const dealerHand = [...state.dealerHand];
    const deck = [...state.deck];

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

    // Process bet result after determining winner
    get().processBetResult();
  },

  // Determine winner (called after dealer's turn)
  determineWinner: () => {
    const state = get();
    const message = determineWinner(state.playerHand, state.dealerHand);
    set({ message, gameState: 'game-over' });
  },

  // Betting actions
  placeBet: (amount: number) => {
    const state = get();
    const newBet = state.currentBet + amount;

    // Don't allow bet higher than balance
    if (newBet > state.playerBalance) {
      set({ message: 'Insufficient balance!' });
      return;
    }

    // Don't allow bet higher than $10,000
    if (newBet > 10000) {
      set({ message: 'Maximum bet is $10,000!' });
      return;
    }

    set({
      currentBet: newBet,
      message: `Bet: $${newBet}. Click Deal to start!`
    });
  },

  clearBet: () => {
    set({
      currentBet: 0,
      message: 'Place your bet to start'
    });
  },

  processBetResult: () => {
    const state = get();
    const playerHand = state.playerHand;
    const dealerHand = state.dealerHand;
    const bet = state.currentBet;

    // Determine outcome
    const playerValue = calculateHandValue(playerHand);
    const dealerValue = calculateHandValue(dealerHand);
    const playerHasBlackjack = isBlackjack(playerHand);
    const dealerHasBlackjack = isBlackjack(dealerHand);

    let payout = 0;
    let newMessage = '';

    // Player busts - already handled in hit()
    if (isBust(playerHand)) {
      return; // Already deducted in hit()
    }

    // Dealer busts, player wins
    if (isBust(dealerHand)) {
      if (playerHasBlackjack) {
        payout = bet * 2.5; // Return bet + 1.5x
        newMessage = `Blackjack! You win $${bet * 1.5}!`;
      } else {
        payout = bet * 2; // Return bet + bet
        newMessage = `Dealer busts! You win $${bet}!`;
      }
    }
    // Both have blackjack - push
    else if (playerHasBlackjack && dealerHasBlackjack) {
      payout = bet; // Return bet
      newMessage = `Push! Bet returned.`;
    }
    // Player has blackjack
    else if (playerHasBlackjack) {
      payout = bet * 2.5; // Return bet + 1.5x
      newMessage = `Blackjack! You win $${bet * 1.5}!`;
    }
    // Dealer has blackjack
    else if (dealerHasBlackjack) {
      payout = 0; // Lose bet
      newMessage = `Dealer Blackjack! You lose $${bet}.`;
    }
    // Compare values
    else if (playerValue > dealerValue) {
      payout = bet * 2; // Return bet + bet
      newMessage = `You win $${bet}!`;
    } else if (playerValue < dealerValue) {
      payout = 0; // Lose bet
      newMessage = `You lose $${bet}.`;
    } else {
      payout = bet; // Return bet
      newMessage = `Push! Bet returned.`;
    }

    const newBalance = state.playerBalance - bet + payout;

    set({
      playerBalance: newBalance,
      currentBet: 0,
      message: newMessage
    });

    // Check for bankruptcy
    if (newBalance === 0) {
      setTimeout(() => {
        set({ message: 'Bankrupt! Click Reset to start over.' });
      }, 2000);
    }
  },

  resetBalance: () => {
    set({
      playerBalance: 10000,
      currentBet: 0,
      gameState: 'idle',
      message: 'Place your bet to start',
      deck: [],
      playerHand: [],
      dealerHand: [],
      playerScore: 0,
      dealerScore: 0,
      dealerShowAll: false
    });
  }
}));
