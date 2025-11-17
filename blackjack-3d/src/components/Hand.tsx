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
        // Dealer's second card (index 1 - hole card) is hidden until showAll
        // All other cards are face up
        const faceUp = !isDealer || showAll || index !== 1;

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
