import { useGameStore } from '../../store/gameStore';

export function ScoreDisplay() {
  const playerScore = useGameStore((state) => state.playerScore);
  const dealerScore = useGameStore((state) => state.dealerScore);
  const dealerShowAll = useGameStore((state) => state.dealerShowAll);

  return (
    <div className="score-display">
      <div className="score-item">
        <span className="score-label">Dealer:</span>
        <span className="score-value">
          {dealerShowAll ? dealerScore : `${dealerScore} + ?`}
        </span>
      </div>

      <div className="score-item">
        <span className="score-label">Player:</span>
        <span className="score-value">{playerScore}</span>
      </div>
    </div>
  );
}
