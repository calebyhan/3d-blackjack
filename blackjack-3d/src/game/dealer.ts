import type { Card } from './types';
import { calculateHandValue } from './rules';

export function shouldDealerHit(hand: Card[]): boolean {
  const score = calculateHandValue(hand);
  return score < 17; // Standard casino rules: hit on 16 or less
}
