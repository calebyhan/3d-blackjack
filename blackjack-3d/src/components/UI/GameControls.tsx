import { useGameStore } from '../../store/gameStore';

export function GameControls() {
  const gameState = useGameStore((state) => state.gameState);
  const hit = useGameStore((state) => state.hit);
  const stand = useGameStore((state) => state.stand);

  // Only show controls during active play
  // Betting panel handles idle and game-over states
  return (
    <div className="game-controls">
      {gameState === 'playing' && (
        <>
          <button onClick={hit} className="btn btn-success">
            Hit
          </button>
          <button onClick={stand} className="btn btn-warning">
            Stand
          </button>
        </>
      )}
    </div>
  );
}
