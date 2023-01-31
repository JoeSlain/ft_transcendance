import "../../styles/gameComponent.css";
import { useContext, useRef } from "react";
import { CanvasRef } from "./type";
import useGameEvents from "../../hooks/gameEvents/useGameEvents";
import { GameContext } from "../../context/socketContext";
import { roomType } from "../../types/roomType";
import User from "../../hooks/User";

type Props = {
  room: roomType;
  setRoom: (room: roomType) => void;
};

function GameComponent({ room, setRoom }: Props) {
  const canvasRef: CanvasRef = useRef<HTMLCanvasElement>(null);
  const socket = useContext(GameContext);
  const game = useGameEvents({ canvasRef, setRoom });
  const { user } = useContext(User);

  const leave = () => {
    socket.emit("leaveRoom", { roomId: room.id, user });
  };

  /*const giveUp = () => {
    socket.emit("giveUp", { game, user });
  };*/

  return (
    <div className="gameContainer">
      <div className="gameButtons">
        {user.id !== room.host.infos.id && user.id !== room.guest.infos.id && (
          <button className="btn btn-primary" onClick={leave}>
            {" "}
            Leave{" "}
          </button>
        )}
        {/*(user.id === room.host.infos.id ||
          user.id === room.guest.infos.id) && (
          <button className="btn btn-primary" onClick={giveUp}>
            {" "}
            Give Up{" "}
          </button>
          )*/}
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
