import { useContext } from "react";
import { GameContext } from "../../context/socketContext";
import User from "../../hooks/User";
import { roomType } from "../../types/roomType";
import { userType } from "../../types/userType";
import { ReadyStyle } from "../../styles/readyStyle";

type IProps = {
  room: roomType;
  player: userType;
  ready: boolean;
  setReady: (props: boolean) => void;
};

export default function PlayerEntry({ room, player, ready, setReady }: IProps) {
  const { user } = useContext(User);
  const socket = useContext(GameContext);
  const me = user.id === player.id;

  const isEmptyRoom = () => {
    return !room.guest && !room.spectators.length;
  };

  const leaveRoom = () => {
    const data = {
      user,
      roomId: room.id,
    };
    console.log("userId", user.id);
    console.log("roomId", room.id);
    socket.emit("leaveRoom", data);
  };

  return (
    <div className="playerEntry">
      <h2>
        {`${player.username} `}
        {ready ? (
          <ReadyStyle color="green"> ✓ </ReadyStyle>
        ) : (
          <ReadyStyle color="red"> x </ReadyStyle>
        )}
      </h2>
      <div className="playerButtons">
        <button onClick={() => setReady(!ready)}> Ready </button>
        {me && !isEmptyRoom() && <button onClick={leaveRoom}> Leave </button>}
      </div>
    </div>
  );
}
