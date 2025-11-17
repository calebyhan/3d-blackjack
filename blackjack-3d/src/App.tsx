import { Scene } from './components/Scene';
import { GameControls } from './components/UI/GameControls';
import { ScoreDisplay } from './components/UI/ScoreDisplay';
import { GameStatus } from './components/UI/GameStatus';
import './App.css';

function App() {
  return (
    <div className="app">
      <div className="ui-overlay">
        <h1>3D Blackjack</h1>
        <GameStatus />
        <ScoreDisplay />
        <GameControls />
      </div>

      <div className="canvas-container">
        <Scene />
      </div>
    </div>
  );
}

export default App;
