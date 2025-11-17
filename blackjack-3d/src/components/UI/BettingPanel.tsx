import { useGameStore } from '../../store/gameStore';
import './BettingPanel.css';

export const BettingPanel = () => {
  const {
    gameState,
    playerBalance,
    currentBet,
    placeBet,
    clearBet,
    startNewGame,
    resetBalance,
    message
  } = useGameStore();

  // Only show betting panel when game is idle or game-over
  const showBetting = gameState === 'idle' || gameState === 'game-over';
  const isBankrupt = playerBalance === 0;

  if (!showBetting) return null;

  const chipValues = [
    { label: '$100', value: 100 },
    { label: '$500', value: 500 },
    { label: '$1000', value: 1000 },
    { label: '$5000', value: 5000 }
  ];

  const handleAllIn = () => {
    if (playerBalance > currentBet) {
      placeBet(playerBalance - currentBet);
    }
  };

  const handleDeal = () => {
    if (currentBet >= 1 && currentBet <= playerBalance) {
      startNewGame();
    }
  };

  return (
    <div className="betting-panel">
      <div className="balance-display">
        <div className="balance-label">Balance:</div>
        <div className="balance-amount">${playerBalance.toLocaleString()}</div>
      </div>

      <div className="bet-display">
        <div className="bet-label">Current Bet:</div>
        <div className="bet-amount">${currentBet.toLocaleString()}</div>
      </div>

      {isBankrupt ? (
        <div className="bankruptcy-section">
          <p className="bankruptcy-message">You're out of money!</p>
          <button className="reset-button" onClick={resetBalance}>
            Reset to $10,000
          </button>
        </div>
      ) : gameState === 'idle' ? (
        <>
          <div className="chips-container">
            {chipValues.map((chip) => (
              <button
                key={chip.value}
                className="chip-button"
                onClick={() => placeBet(chip.value)}
                disabled={currentBet + chip.value > playerBalance}
              >
                {chip.label}
              </button>
            ))}
          </div>

          <div className="betting-actions">
            <button
              className="all-in-button"
              onClick={handleAllIn}
              disabled={playerBalance === currentBet || playerBalance === 0}
            >
              All In
            </button>
            <button
              className="clear-button"
              onClick={clearBet}
              disabled={currentBet === 0}
            >
              Clear
            </button>
            <button
              className="deal-button"
              onClick={handleDeal}
              disabled={currentBet < 1 || currentBet > playerBalance}
            >
              Deal
            </button>
          </div>
        </>
      ) : (
        <div className="game-over-section">
          <p className="result-message">{message}</p>
          <button
            className="new-game-button"
            onClick={() => {
              useGameStore.setState({ gameState: 'idle', message: 'Place your bet to start' });
            }}
          >
            New Game
          </button>
        </div>
      )}
    </div>
  );
};
