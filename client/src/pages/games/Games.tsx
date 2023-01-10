import { Game } from "./canvas/Draw";
import "../../styles/games.css";
import { useRef, useState } from "react";

function Games() {
  const canvasRef = useRef(null);
  const [game, setGame] = useState<Game | null>(null);

  function startGame() {
    if (canvasRef.current) {
      const newGame = new Game(canvasRef.current);
      setGame(newGame);
      // socket.emit("startGame", { roomId: 123 });
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

  function start2Ball() {
    if (canvasRef.current) {
      const newGame = new Game(canvasRef.current);
      setGame(newGame);
      newGame.resetScore();
      newGame.Start2Ball();
    }
  }

return (
  <div className="game">
    <div className="game-buttons-container">
      {game && (
        <button className="btn btn-primary" onClick={stopGame}>
          Stop
        </button>
      )}
    </div>
    <div className="game-canvas-container ">
      {!game && (
        <div className="game-buttons-container-vitesse pt-56 ml-80 flex flex-col justify-center gap-3">
          <button
            className="btn btn-sm md:btn-md gap-2 normal-case lg:gap-3 "
            onClick={startGame}
          >
            Start
          </button>
          <button
            className="btn btn-sm md:btn-md  gap-2 normal-case lg:gap-3"
            onClick={startSpeed}
          >
            Start speed game{" "}
          </button>
          <button
            className="btn btn-sm md:btn-md gap-2 normal-case lg:gap-3"
            onClick={start2Ball}
          >
            Start 2 Ball
          </button>
        </div>
      )}
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
