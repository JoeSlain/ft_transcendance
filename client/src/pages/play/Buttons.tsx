import { useContext } from "react";
import { roomType } from "../../types/roomType";
import User from "../../hooks/User";
import { GameContext } from "../../context/socketContext";

type IProps = {
  room: roomType;
};

export default function Buttons({ room }: IProps) {
  const { user } = useContext(User);
  const socket = useContext(GameContext);
  let showStart = false;
  let playersReady = false;
  const showLeave = room.spectators.find((sp) => sp.id === user.id);

  if (room.host && room.host.infos.id === user.id) {
    showStart = true;
    if (room.host.ready && room.guest && room.guest.ready) playersReady = true;
  }

  const startGame = () => {
    if (playersReady) {
      // startGame
    }
  };

  const leaveRoom = () => {
    socket.emit("leaveRoom", { roomId: room.id, user });
  };

  return (
    <div>
      {showStart && (
        <button
          onClick={startGame}
          className="customButton"
          style={{
            width: "70px",
            color: playersReady ? "white" : "grey",
          }}
        >
          {" "}
          Start{" "}
        </button>
      )}
      {showLeave && (
        <button
          className="customButton"
          style={{ width: "70px" }}
          onClick={leaveRoom}
        >
          {" "}
          Leave{" "}
        </button>
      )}
    </div>
  );
}