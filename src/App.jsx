import { GameProvider } from './game/GameContext';

function App() {
  return (
    <GameProvider>
      <div id="game">
        <h1>FMV Dating Sim</h1>
        <p>The game will load here.</p>
      </div>
    </GameProvider>
  );
}

export default App;
