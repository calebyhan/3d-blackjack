import { Text, useTexture } from '@react-three/drei';
import uncLogo from '../assets/unc-logo.png';

export function Table() {
  // Load UNC logo for table center
  const logoTexture = useTexture(uncLogo);

  return (
    <group>
      {/* Table base/wood rail (BELOW the green felt) */}
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[7.5, 7.5, 0.5, 64]} />
        <meshStandardMaterial
          color="#4a2511"
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>

      {/* Main table surface (green felt) - ON TOP */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[6.8, 6.8, 0.1, 64]} />
        <meshStandardMaterial
          color="#0f9d58"
          roughness={0.9}
          metalness={0}
        />
      </mesh>

      {/* Wood trim ring around edge - ONLY at the outer edge */}
      <mesh position={[0, 0.06, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[7.075, 0.225, 16, 64]} />
        <meshStandardMaterial
          color="#8b4513"
          roughness={0.5}
          metalness={0.2}
        />
      </mesh>

      {/* Dealer betting circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, -3]}>
        <ringGeometry args={[1.2, 1.3, 64]} />
        <meshStandardMaterial
          color="#FFD700"
          transparent
          opacity={0.5}
          roughness={0.8}
        />
      </mesh>

      {/* Player betting circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 3]}>
        <ringGeometry args={[1.2, 1.3, 64]} />
        <meshStandardMaterial
          color="#FFD700"
          transparent
          opacity={0.5}
          roughness={0.8}
        />
      </mesh>

      {/* DEALER text */}
      <Text
        position={[0, 0.07, -3]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.4}
        color="#FFD700"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        DEALER
      </Text>

      {/* PLAYER text */}
      <Text
        position={[0, 0.07, 3]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.4}
        color="#FFD700"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        PLAYER
      </Text>

      {/* UNC Logo in center of table */}
      <mesh position={[0, 0.07, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial
          map={logoTexture}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Decorative lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <ringGeometry args={[6.5, 6.6, 64]} />
        <meshStandardMaterial
          color="#FFD700"
          transparent
          opacity={0.2}
        />
      </mesh>
    </group>
  );
}
