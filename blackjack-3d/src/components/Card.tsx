import { useRef } from 'react';
import { useSpring, animated } from '@react-spring/three';
import { Text, useTexture } from '@react-three/drei';
import type { Card as CardType } from '../game/types';
import * as THREE from 'three';
import uncLogo from '../assets/unc-logo.png';

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

  // Load UNC logo texture
  const logoTexture = useTexture(uncLogo);

  // Animate card flip
  const { rotationY } = useSpring({
    rotationY: faceUp ? 0 : Math.PI,
    config: { tension: 200, friction: 25 }
  });

  // Stagger card appearance
  const offsetX = index * 1.6; // Spread cards horizontally with more spacing
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
      rotation-x={-Math.PI / 2}
      rotation-z={rotationY}
    >
      {/* Card border/outline (bottom - back side) */}
      <mesh position={[0, 0, -0.015]}>
        <planeGeometry args={[CARD_WIDTH + 0.1, CARD_HEIGHT + 0.1]} />
        <meshStandardMaterial color="#13294B" />
      </mesh>

      {/* Card back (UNC Carolina Blue) */}
      <mesh position={[0, 0, -0.01]} rotation={[0, 0, Math.PI]}>
        <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
        <meshStandardMaterial color="#7BAFD4" />
      </mesh>

      {/* Card back pattern - white border */}
      <mesh position={[0, 0, -0.009]} rotation={[0, 0, Math.PI]}>
        <planeGeometry args={[CARD_WIDTH * 0.9, CARD_HEIGHT * 0.9]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* UNC Logo image */}
      <mesh position={[0, 0, -0.008]} rotation={[0, 0, Math.PI]}>
        <planeGeometry args={[CARD_WIDTH * 0.7, CARD_WIDTH * 0.7]} />
        <meshStandardMaterial map={logoTexture} transparent={true} />
      </mesh>

      {/* Card front - only render when face up */}
      {faceUp && (
        <>
          {/* Card border/outline (top - front side) */}
          <mesh position={[0, 0, 0.005]}>
            <planeGeometry args={[CARD_WIDTH + 0.1, CARD_HEIGHT + 0.1]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>

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
        </>
      )}
    </animated.group>
  );
}
