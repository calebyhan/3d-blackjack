import { Canvas } from '@react-three/fiber';
import { Table } from './Table';
import { Hand } from './Hand';
import { ChipPileManager } from './ChipPileManager';
import { useGameStore } from '../store/gameStore';
import { useTexture } from '@react-three/drei';
import uncLogo from '../assets/unc-logo.png';

// Deck component - must be inside Canvas to use useTexture
function Deck({ position }: { position: [number, number, number] }) {
  const logoTexture = useTexture(uncLogo);
  const CARD_WIDTH = 1.4;
  const CARD_HEIGHT = 2;
  const CARD_THICKNESS = 0.02;
  const NUM_VISIBLE_CARDS = 25; // Number of card layers visible in the deck

  return (
    <group position={position} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Stack of cards */}
      {Array.from({ length: NUM_VISIBLE_CARDS }).map((_, i) => {
        const yOffset = i * CARD_THICKNESS;

        return (
          <group key={i} position={[0, 0, yOffset]}>
            {/* Card border (black edge) */}
            <mesh>
              <boxGeometry args={[CARD_WIDTH + 0.05, CARD_HEIGHT + 0.05, CARD_THICKNESS]} />
              <meshStandardMaterial color="#1a1a1a" />
            </mesh>

            {/* Card back base (Carolina Blue) */}
            <mesh position={[0, 0, CARD_THICKNESS / 2 + 0.001]}>
              <planeGeometry args={[CARD_WIDTH, CARD_HEIGHT]} />
              <meshStandardMaterial color="#7BAFD4" />
            </mesh>

            {/* White border frame */}
            <mesh position={[0, 0, CARD_THICKNESS / 2 + 0.002]}>
              <planeGeometry args={[CARD_WIDTH * 0.9, CARD_HEIGHT * 0.9]} />
              <meshStandardMaterial color="#FFFFFF" />
            </mesh>

            {/* Carolina Blue inner area */}
            <mesh position={[0, 0, CARD_THICKNESS / 2 + 0.003]}>
              <planeGeometry args={[CARD_WIDTH * 0.8, CARD_HEIGHT * 0.8]} />
              <meshStandardMaterial color="#7BAFD4" />
            </mesh>

            {/* UNC Logo (only on top few cards for performance) */}
            {i >= NUM_VISIBLE_CARDS - 5 && (
              <mesh position={[0, 0, CARD_THICKNESS / 2 + 0.004]} rotation={[0, 0, 0]}>
                <planeGeometry args={[CARD_WIDTH * 0.7, CARD_WIDTH * 0.7]} />
                <meshStandardMaterial map={logoTexture} transparent={true} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

export function Scene() {
  const playerHand = useGameStore((state) => state.playerHand);
  const dealerHand = useGameStore((state) => state.dealerHand);
  const dealerShowAll = useGameStore((state) => state.dealerShowAll);
  const playerBalance = useGameStore((state) => state.playerBalance);
  const currentBet = useGameStore((state) => state.currentBet);

  return (
    <Canvas
      shadows
      camera={{ position: [0, 10, 14], fov: 45 }}
      style={{ background: '#0a0a0a' }}
    >
      {/* Casino Lighting */}
      <ambientLight intensity={0.8} />
      <spotLight
        position={[0, 12, 0]}
        angle={0.8}
        penumbra={0.3}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[0, 8, 12]} intensity={1.2} />
      <pointLight position={[0, 6, 10]} intensity={1} />

      {/* Table */}
      <Table />

      {/* Dealer's hand (top) */}
      <Hand
        cards={dealerHand}
        position={[-3, 0.2, -3]}
        showAll={dealerShowAll}
        isDealer={true}
      />

      {/* Player's hand (bottom) */}
      <Hand
        cards={playerHand}
        position={[-3, 0.2, 2.5]}
        showAll={true}
        isDealer={false}
      />

      {/* Dynamic chip piles (player pile + bet pile) */}
      <ChipPileManager
        balance={playerBalance}
        currentBet={currentBet}
      />

      {/* Deck stack (right side) */}
      <Deck position={[5.5, 0.15, 0]} />
    </Canvas>
  );
}
