import "../../styles/games.css";
import { useContext, useEffect, useRef, useState } from "react";
import { CanvasRef } from "./type";
import { gameData } from "../../types/gameType";
import useGameEvents from "../../hooks/gameEvents/useGameEvents";
import { getSavedItem } from "../../utils/storage";
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

  return (
    <div className="game-canvas-container">
      <canvas
        width={game ? game.width : 800}
        height={game ? game.height : 500}
        id="game-canvas"
        ref={canvasRef}
      ></canvas>
      {timer && <div className="timer"> {timer} </div>}
    </div>
  );
}

export default GameComponent;
