import { Game } from "./canvas/Draw";
import "../../styles/games.css";
import { useRef, useEffect, useState } from "react";

function Games() {
  const canvasRef = useRef(null);
  const [game, setGame] = useState<Game | null>(null);

  function startGame() {
    if (canvasRef.current) {
      const newGame = new Game(canvasRef.current);
      setGame(newGame);
      newGame.resetScore();
      newGame.start();
    }
  }

  function stopGame() {
    if (game) {
      game.stop();
      game.resetScore();
      setGame(null);
    }
  }

  function startSpeed() {
    if (canvasRef.current) {
      const newGame = new Game(canvasRef.current);
      setGame(newGame);
      newGame.resetScore();
      newGame.StartSpeed();
    }
  }

  return (
    <div className="game">
      <div className="game-buttons-container">
        {!game && <button onClick={startGame}>Start</button>}
        {game && <button onClick={stopGame}>Stop</button>}
      </div>
      <div className="game-buttons-container-vitesse">
        {!game && <button onClick={startSpeed}>Start speed game </button>}
      </div>
      <div className="game-canvas-container">
        <canvas
          width="800"
          height="500"
          id="game-canvas"
          ref={canvasRef}
        ></canvas>
      </div>
    </div>
  );
}

export default Games;
