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
