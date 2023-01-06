import { Game } from "./canvas/Draw";
import "../../styles/games.css";
import { GameContext } from "../../context/socketContext";
import { useRef, useState, useContext } from "react";

function Games() {
  const canvasRef = useRef(null);
  const [game, setGame] = useState<Game | null>(null);
  const socket = useContext(GameContext);

  function startGame() {
    if (canvasRef.current) {
      const newGame = new Game(canvasRef.current, 800, 500);
      setGame(newGame);
      socket.emit("createGame", { roomId: 123 });
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
      const newGame = new Game(canvasRef.current, 800, 500);
      setGame(newGame);
      newGame.resetScore();
      newGame.StartSpeed();
    }
  }

  function start2Ball() {
    if (canvasRef.current) {
      const newGame = new Game(canvasRef.current, 800, 500);
      setGame(newGame);
      newGame.resetScore();
      newGame.Start2Ball();
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
        <div className="game-buttons-container-2ball">
          {!game && <button onClick={start2Ball}>Start 2 Ball</button>}
        </div>
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
