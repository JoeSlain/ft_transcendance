import { useContext } from "react";
import { GameContext } from "../../context/socketContext";
import User from "../../hooks/User";
import { roomType, roomUser } from "../../types/roomType";
import { ReadyStyle } from "../../styles/readyStyle";

type IProps = {
  room: roomType;
  player: roomUser;
};

export default function PlayerEntry({ room, player }: IProps) {
  const { user } = useContext(User);
  const socket = useContext(GameContext);
  const me = user.id === player.infos.id;

  const isEmptyRoom = () => {
    return !room.guest && !room.spectators.length;
  };

  const leaveRoom = () => {
    socket.emit("leaveRoom", { roomId: room.id, user });
  };

  const readyUp = () => {
    socket.emit("setReady", { roomId: room.id, userId: user.id });
  };

  return (
    <div className="playerEntry">
      <h1>
        {`${player.infos.username} `}
        {player.ready ? (
          <ReadyStyle color="green"> ✓ </ReadyStyle>
        ) : (
          <ReadyStyle color="red"> x </ReadyStyle>
        )}
      </h1>
      <div className="playerButtons">
        {me && (
          <button
            className="btn btn-sm md:btn-md gap-2 normal-case lg:gap-3 mb-3"
            style={{ width: "70px" }}
            onClick={readyUp}
          >
            {" "}
            Ready{" "}
          </button>
        )}
        {me && !isEmptyRoom() && (
          <button
            className="btn btn-sm md:btn-md gap-2 normal-case lg:gap-3 "
            style={{ width: "70px" }}
            onClick={leaveRoom}
          >
            {" "}
            Leave{" "}
          </button>
        )}
      </div>
    </div>
  );
}
