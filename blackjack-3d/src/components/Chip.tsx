import { Text } from '@react-three/drei';

interface ChipProps {
  value: number;
  position: [number, number, number];
  stackIndex?: number;
}

// Get chip color based on value (casino standard + UNC theme)
function getChipColor(value: number): string {
  const chipColors: { [key: number]: string } = {
    1: '#ffffff',    // White
    5: '#dc143c',    // Red
    10: '#0000ff',   // Blue
    25: '#00ff00',   // Green
    50: '#ffa500',   // Orange
    100: '#000000',  // Black
    500: '#800080',  // Purple
    1000: '#7BAFD4', // UNC Carolina Blue
  };
  return chipColors[value] || '#7BAFD4'; // Default to UNC blue
}

export function Chip({ value, position, stackIndex = 0 }: ChipProps) {
  const color = getChipColor(value);
  const chipHeight = 0.15;
  const chipRadius = 0.4;

  // Stack chips with slight offset
  const finalPosition: [number, number, number] = [
    position[0],
    position[1] + stackIndex * chipHeight,
    position[2]
  ];

  return (
    <group position={finalPosition}>
      {/* Main chip body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[chipRadius, chipRadius, chipHeight, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* White edge stripe */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[chipRadius + 0.02, chipRadius + 0.02, chipHeight * 0.4, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Inner circle detail */}
      <mesh position={[0, chipHeight / 2 + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[chipRadius * 0.5, chipRadius * 0.7, 32]} />
        <meshStandardMaterial
          color="#ffffff"
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Value text on top */}
      <Text
        position={[0, chipHeight / 2 + 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        ${value}
      </Text>

      {/* Bottom text (for when looking from below) */}
      <Text
        position={[0, -chipHeight / 2 - 0.02, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        ${value}
      </Text>
    </group>
  );
}

// ChipStack component for multiple chips
interface ChipStackProps {
  chips: { value: number }[];
  position: [number, number, number];
}

export function ChipStack({ chips, position }: ChipStackProps) {
  return (
    <group position={position}>
      {chips.map((chip, index) => (
        <Chip
          key={`chip-${index}`}
          value={chip.value}
          position={[0, 0, 0]}
          stackIndex={index}
        />
      ))}
    </group>
  );
}
