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
