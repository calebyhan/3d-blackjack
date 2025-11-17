import { useGameStore } from '../../store/gameStore';

export function GameStatus() {
  const message = useGameStore((state) => state.message);
  const gameState = useGameStore((state) => state.gameState);

  return (
    <div className="game-status">
      <h2 className={gameState === 'game-over' ? 'game-over' : ''}>
        {message}
      </h2>
    </div>
  );
}
