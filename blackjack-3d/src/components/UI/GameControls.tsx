import { useGameStore } from '../../store/gameStore';

export function GameControls() {
  const gameState = useGameStore((state) => state.gameState);
  const hit = useGameStore((state) => state.hit);
  const stand = useGameStore((state) => state.stand);
  const startNewGame = useGameStore((state) => state.startNewGame);

  return (
    <div className="game-controls">
      {gameState === 'idle' && (
        <button onClick={startNewGame} className="btn btn-primary">
          New Game
        </button>
      )}

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

      {(gameState === 'game-over' || gameState === 'dealer-turn') && (
        <button onClick={startNewGame} className="btn btn-primary">
          New Game
        </button>
      )}
    </div>
  );
}
