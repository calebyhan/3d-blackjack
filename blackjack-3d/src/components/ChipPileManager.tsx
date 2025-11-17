import { useEffect, useState, useRef } from 'react';
import { useSpring, animated, config } from '@react-spring/three';
import { Chip } from './Chip';
import { useGameStore } from '../store/gameStore';

// Convert an amount to an array of chip denominations
function amountToChips(amount: number): number[] {
  if (amount === 0) return [];

  const denominations = [5000, 1000, 500, 100, 25, 5, 1];
  const chips: number[] = [];
  let remaining = amount;

  for (const denom of denominations) {
    while (remaining >= denom) {
      chips.push(denom);
      remaining -= denom;
    }
  }

  return chips;
}

interface AnimatedChipGroupProps {
  chips: number[];
  position: [number, number, number];
  animate?: boolean;
  fromPosition?: [number, number, number];
}

function AnimatedChipGroup({ chips, position, animate = false, fromPosition }: AnimatedChipGroupProps) {
  const springProps = useSpring({
    position: animate && fromPosition ? position : position,
    from: { position: fromPosition || position },
    config: { ...config.wobbly, tension: 120, friction: 20 },
  });

  return (
    <animated.group position={animate ? springProps.position as any : position}>
      {chips.map((chipValue, index) => (
        <Chip
          key={`chip-${index}-${chipValue}`}
          value={chipValue}
          position={[0, 0, 0]}
          stackIndex={index}
        />
      ))}
    </animated.group>
  );
}

interface ChipPileProps {
  balance: number;
  currentBet: number;
}

export function ChipPileManager({ balance, currentBet }: ChipPileProps) {
  const playerPilePosition: [number, number, number] = [-6, 0.15, 5];
  const betPilePosition: [number, number, number] = [0, 0.15, 5];

  const [playerChips, setPlayerChips] = useState<number[]>([]);
  const [betChips, setBetChips] = useState<number[]>([]);
  const [animatingToBet, setAnimatingToBet] = useState(false);
  const [animatingToPlayer, setAnimatingToPlayer] = useState(false);

  const prevBet = useRef(currentBet);
  const prevBalance = useRef(balance);

  useEffect(() => {
    // Detect if bet increased (chips moving to bet pile)
    if (currentBet > prevBet.current) {
      setAnimatingToBet(true);
      setTimeout(() => setAnimatingToBet(false), 600);
    }

    // Detect if bet decreased (chips moving back to player pile)
    if (currentBet < prevBet.current && currentBet === 0) {
      setAnimatingToPlayer(true);
      setTimeout(() => setAnimatingToPlayer(false), 600);
    }

    prevBet.current = currentBet;
    prevBalance.current = balance;
  }, [currentBet, balance]);

  useEffect(() => {
    // Update chip representations
    const availableBalance = balance - currentBet;
    setPlayerChips(amountToChips(availableBalance));
    setBetChips(amountToChips(currentBet));
  }, [balance, currentBet]);

  return (
    <group>
      {/* Player's chip pile (lower-left) */}
      {playerChips.length > 0 && (
        <AnimatedChipGroup
          chips={playerChips}
          position={playerPilePosition}
          animate={animatingToPlayer}
          fromPosition={betPilePosition}
        />
      )}

      {/* Bet chip pile (center of table) */}
      {betChips.length > 0 && (
        <AnimatedChipGroup
          chips={betChips}
          position={betPilePosition}
          animate={animatingToBet}
          fromPosition={playerPilePosition}
        />
      )}
    </group>
  );
}
