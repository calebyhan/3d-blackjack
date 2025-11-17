import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Table } from './Table';
import { Hand } from './Hand';
import { useGameStore } from '../store/gameStore';

export function Scene() {
  const playerHand = useGameStore((state) => state.playerHand);
  const dealerHand = useGameStore((state) => state.dealerHand);
  const dealerShowAll = useGameStore((state) => state.dealerShowAll);

  return (
    <Canvas
      camera={{ position: [0, 8, 12], fov: 50 }}
      style={{ background: '#1a1a2e' }}
    >
      {/* Lighting */}
      <Environment preset="sunset" />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />

      {/* Camera controls (optional - can disable for fixed camera) */}
      <OrbitControls
        enablePan={false}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={8}
        maxDistance={20}
      />

      {/* Table */}
      <Table />

      {/* Dealer's hand (top) */}
      <Hand
        cards={dealerHand}
        position={[-3, 0.11, -3]}
        showAll={dealerShowAll}
        isDealer={true}
      />

      {/* Player's hand (bottom) */}
      <Hand
        cards={playerHand}
        position={[-3, 0.11, 2]}
        showAll={true}
        isDealer={false}
      />
    </Canvas>
  );
}
