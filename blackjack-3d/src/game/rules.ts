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
