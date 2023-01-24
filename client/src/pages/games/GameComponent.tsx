import "../../styles/games.css";
import { useRef, useState } from "react";
import { CanvasRef } from "./type";
import { gameData } from "../../types/gameType";
import useGameEvents from "../../hooks/gameEvents/useGameEvents";
import { getSavedItem } from "../../utils/storage";

type Props = {
  game: gameData;
  setGame: (game: gameData) => void;
};

function GameComponent() {
  const canvasRef: CanvasRef = useRef<HTMLCanvasElement>(null);
  const [game, setGame] = useState<gameData | null>(getSavedItem("game"));

  useGameEvents({ game, setGame, canvasRef });

  return (
    <div className="game-canvas-container">
      <canvas
        width={game ? game.width : 800}
        height={game ? game.height : 500}
        id="game-canvas"
        ref={canvasRef}
      ></canvas>
    </div>
  );
}

export default GameComponent;
