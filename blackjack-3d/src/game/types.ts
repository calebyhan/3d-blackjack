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
