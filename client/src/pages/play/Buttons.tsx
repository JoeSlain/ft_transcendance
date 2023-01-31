import { useContext, useState } from "react";
import { roomType } from "../../types/roomType";
import User from "../../hooks/User";
import { GameContext } from "../../context/socketContext";
import { CountdownContext } from "../../context/countDownContext";

type IProps = {
  room: roomType;
};

export default function Buttons({ room }: IProps) {
  const { user } = useContext(User);
  const socket = useContext(GameContext);
  const { countdown, setCountdown } = useContext(CountdownContext);
  const [powerUps, setPowerUps] = useState(false);
  let showStart = false;
  let playersReady = false;
  let showSearch = false;
  const showLeave = room.spectators.find((sp) => sp.id === user.id);

  if (room.host && room.host.infos.id === user.id) {
    if (room.guest) {
      showStart = true;
      if (room.host.ready && room.guest.ready) playersReady = true;
    } else showSearch = true;
  }

  const startGame = () => {
    if (playersReady) {
      if (playersReady) {
        console.log("start game", room);
        socket.emit("createGame", { room, powerUps });
      }
    }
  };

  const leaveRoom = () => {
    socket.emit("leaveRoom", { roomId: room.id, user });
  };

  const searchOpponent = () => {
    console.log(`search opponent, my elo = ${user.elo}`);
    console.log(`my wins = ${user.n_win}, my losses = ${user.n_lose}`);
    socket.emit("searchOpponent", user);
    setCountdown({ min: 0, sec: 0 });
  };

  const stopSearch = () => {
    socket.emit("stopQueue", user);
    setCountdown(null);
  };

  return (
    <div>
      {showStart && (
        <div className="flex flex-col">
          <button
            onClick={startGame}
            className={`btn ${
              playersReady ? "" : "btn-disabled"
            } btn-sm md:btn-md gap-2 normal-case lg:gap-3 `}
            style={{
              width: "70px",
              color: playersReady ? "white" : "grey",
            }}
          >
            {" "}
            Start{" "}
          </button>
          <div className="flex flex-row">
            <div>PowerUps</div>
            <input
              className="channelCheckBox"
              type="checkbox"
              onChange={() => setPowerUps(!powerUps)}
            />
          </div>
        </div>
      )}
      {!countdown && showSearch && (
        <button
          className="btn btn-sm md:btn-md gap-2 normal-case lg:gap-3 "
          style={{ width: "70px" }}
          onClick={searchOpponent}
        >
          {" "}
          Search Opponent{" "}
        </button>
      )}
      {showLeave && (
        <button
          className="btn btn-sm md:btn-md gap-2 normal-case lg:gap-3 "
          style={{ width: "70px" }}
          onClick={leaveRoom}
        >
          {" "}
          Leave{" "}
        </button>
      )}
      <div className="flex flex-col">
        {countdown && (
          <button
            className="btn btn-sm md:btn-md gap-2 normal-case lg:gap-3 self-center"
            style={{ width: "70px" }}
            onClick={stopSearch}
          >
            {" "}
            Stop search{" "}
          </button>
        )}
        {countdown && (
          <div>
            {" "}
            Time in queue : {countdown.min}m{countdown.sec}s{" "}
          </div>
        )}
      </div>
    </div>
  );
}
