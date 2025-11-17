import { Canvas } from '@react-three/fiber';
import { Table } from './Table';
import { Hand } from './Hand';
import { ChipStack } from './Chip';
import { useGameStore } from '../store/gameStore';

export function Scene() {
  const playerHand = useGameStore((state) => state.playerHand);
  const dealerHand = useGameStore((state) => state.dealerHand);
  const dealerShowAll = useGameStore((state) => state.dealerShowAll);

  // Example chip stacks (can be connected to game state later)
  const playerChips = [
    { value: 100 },
    { value: 100 },
    { value: 50 },
    { value: 25 },
    { value: 25 }
  ];

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

      {/* Player's chip stack */}
      <ChipStack
        chips={playerChips}
        position={[-6, 0.15, 3]}
      />

      {/* Deck stack (right side) */}
      <group position={[5.5, 0.15, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.4, 0.5, 2]} />
          <meshStandardMaterial color="#13294B" roughness={0.6} />
        </mesh>
      </group>
    </Canvas>
  );
}
