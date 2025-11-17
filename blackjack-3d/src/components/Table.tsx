export function Table() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[20, 15]} />
      <meshStandardMaterial color="#1a5f2f" roughness={0.8} />
    </mesh>
  );
}
