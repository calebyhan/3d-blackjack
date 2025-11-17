import { useRef, useMemo } from 'react';
import { useSpring, animated } from '@react-spring/three';
import { useTexture } from '@react-three/drei';
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
  return suit === 'H' || suit === 'D' ? '#dc143c' : '#000000';
}

// Get suit symbol
function getSuitSymbol(suit: string): string {
  const symbols = { H: '♥', D: '♦', C: '♣', S: '♠' };
  return symbols[suit as keyof typeof symbols] || suit;
}

// Generate card face texture procedurally
function generateCardFaceTexture(rank: string, suit: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 716; // Poker card ratio (2.5:3.5)
  const ctx = canvas.getContext('2d')!;

  // White background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Border
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = 3;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

  // Get suit symbol and color
  const symbol = getSuitSymbol(suit);
  const color = getCardColor(suit);
  ctx.fillStyle = color;

  // Top-left corner
  ctx.font = 'bold 72px serif';
  ctx.fillText(rank, 30, 90);
  ctx.font = '60px serif';
  ctx.fillText(symbol, 30, 160);

  // Center symbol (large)
  ctx.font = '180px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(symbol, canvas.width / 2, canvas.height / 2);

  // Bottom-right corner (rotated)
  ctx.save();
  ctx.translate(canvas.width - 30, canvas.height - 30);
  ctx.rotate(Math.PI);
  ctx.font = 'bold 72px serif';
  ctx.fillText(rank, 0, 60);
  ctx.font = '60px serif';
  ctx.fillText(symbol, 0, 130);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export function Card({ card, position, faceUp, index }: CardProps) {
  const meshRef = useRef<THREE.Group>(null);

  // Load UNC logo texture
  const logoTexture = useTexture(uncLogo);

  // Generate card face texture (memoized for performance)
  const faceTexture = useMemo(
    () => generateCardFaceTexture(card.rank, card.suit),
    [card.rank, card.suit]
  );

  // Deck position (where cards start)
  const DECK_POSITION: [number, number, number] = [5.5, 0.7, 0];

  // Stagger card appearance
  const offsetX = index * 1.6; // Spread cards horizontally with more spacing
  const finalPosition: [number, number, number] = [
    position[0] + offsetX,
    position[1],
    position[2]
  ];

  // Animate card dealing from deck to final position
  const { animatedPosition } = useSpring({
    from: {
      animatedPosition: DECK_POSITION,
    },
    to: {
      animatedPosition: finalPosition,
    },
    delay: index * 150, // Stagger each card
    config: { tension: 120, friction: 20 }
  });

  // Separate animation for card flip (so it can update independently)
  const { rotationY } = useSpring({
    rotationY: faceUp ? 0 : Math.PI,
    config: { tension: 200, friction: 25 }
  });

  return (
    <animated.group
      ref={meshRef}
      position={animatedPosition as any}
      rotation-x={-Math.PI / 2}
      rotation-y={rotationY}
    >
      {/* Card border/outline */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[CARD_WIDTH + 0.05, CARD_HEIGHT + 0.05, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Card back base (Carolina Blue) - bottom side when face down */}
      <mesh position={[0, 0, -0.015]} rotation={[Math.PI, 0, 0]}>
        <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
        <meshStandardMaterial color="#7BAFD4" side={THREE.DoubleSide} />
      </mesh>

      {/* White border frame */}
      <mesh position={[0, 0, -0.015]} rotation={[Math.PI, 0, 0]}>
        <planeGeometry args={[CARD_WIDTH * 0.9, CARD_HEIGHT * 0.9]} />
        <meshStandardMaterial color="#FFFFFF" side={THREE.DoubleSide} />
      </mesh>

      {/* Carolina Blue inner area */}
      <mesh position={[0, 0, -0.016]} rotation={[Math.PI, 0, 0]}>
        <planeGeometry args={[CARD_WIDTH * 0.8, CARD_HEIGHT * 0.8]} />
        <meshStandardMaterial color="#7BAFD4" side={THREE.DoubleSide} />
      </mesh>

      {/* UNC Logo image */}
      <mesh position={[0, 0, -0.016]} rotation={[Math.PI, 0, Math.PI]}>
        <planeGeometry args={[CARD_WIDTH * 0.7, CARD_WIDTH * 0.7]} />
        <meshStandardMaterial map={logoTexture} transparent={true} side={THREE.DoubleSide} />
      </mesh>

      {/* Card front with procedural texture - top side when face up */}
      <mesh position={[0, 0, 0.015]}>
        <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
        <meshStandardMaterial map={faceTexture} side={THREE.DoubleSide} />
      </mesh>
    </animated.group>
  );
}
