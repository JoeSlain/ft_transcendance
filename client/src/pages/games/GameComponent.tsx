import "../../styles/gameComponent.css";
import { useContext, useRef } from "react";
import { CanvasRef } from "./type";
import useGameEvents from "../../hooks/gameEvents/useGameEvents";
import { GameContext } from "../../context/socketContext";
import { roomType } from "../../types/roomType";

type Props = {
  setRoom: (room: roomType) => void;
};

function GameComponent({ setRoom }: Props) {
  const canvasRef: CanvasRef = useRef<HTMLCanvasElement>(null);
  const socket = useContext(GameContext);
  const game = useGameEvents({ canvasRef, setRoom });

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
      </div>
    </div>
  );
}

export default GameComponent;
