import "../../styles/gameComponent.css";
import { useContext, useEffect, useRef, useState } from "react";
import { CanvasRef } from "./type";
import { gameData } from "../../types/gameType";
import useGameEvents from "../../hooks/gameEvents/useGameEvents";
import { GameContext } from "../../context/socketContext";

type Props = {
  game: gameData;
  setGame: (game: gameData) => void;
};

type CdProps = {
  timer: number;
  setTimer: (timer: number) => void;
};

function GameComponent() {
  const canvasRef: CanvasRef = useRef<HTMLCanvasElement>(null);
  const [timer, setTimer] = useState(3);
  const socket = useContext(GameContext);
  const game = useGameEvents({ canvasRef });

  useEffect(() => {
    console.log("timer", timer);
    if (timer) {
      setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    } else socket.emit("startGame", game);
  }, [timer]);

  const rematch = () => {
    socket.emit("rematch", game);
  };

  return (
    <div className="gameContainer">
      <div className="gameButtons">
        {game && !game.gameRunning && (
          <button className="btn btn-primary" onClick={rematch}>
            Rematch
          </button>
        )}
      </div>

      <div className="gameCanvas">
        <canvas
          width={game ? game.width : 800}
          height={game ? game.height : 500}
          id="game-canvas"
          ref={canvasRef}
        ></canvas>
        {timer && <div className="timer"> {timer} </div>}
      </div>
    </div>
  );
}

export default GameComponent;
