import { useContext, useEffect, useState } from "react";
import { roomType } from "../../types/roomType";
import User from "../../hooks/User";
import { GameContext } from "../../context/socketContext";
import GameComponent from "../games/GameComponent";
import { useNavigate } from "react-router-dom";

type IProps = {
  room: roomType;
};

export default function Buttons({ room }: IProps) {
  const { user } = useContext(User);
  const socket = useContext(GameContext);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountDown] = useState(0);
  let showStart = false;
  let playersReady = false;
  let showSearch = false;
  const showLeave = room.spectators.find((sp) => sp.id === user.id);

  useEffect(() => {
    socket.on("stopQueue", () => {
      console.log("stop queue");
      setShowCountdown(false);
    });

    return () => {
      socket.off("stopQueue");
    };
  }, []);

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
        socket.emit("createGame", room);
      }
    }
  };

  const leaveRoom = () => {
    socket.emit("leaveRoom", { roomId: room.id, user });
  };

  const searchOpponent = () => {
    socket.emit("searchOpponent", user);
    setShowCountdown(true);
    const interval = setInterval(() => {
      if (!showCountdown) {
        clearInterval(interval);
        return;
      }
      setCountDown((prev) => prev + 1);
    }, 1000);
  };

  const stopSearch = () => {
    socket.emit("stopQueue", user);
    setShowCountdown(false);
  };

  return (
    <div>
      {showStart && (
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
      )}
      {showSearch && (
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
      {showCountdown && (
        <button
          className="btn btn-sm md:btn-md gap-2 normal-case lg:gap-3 "
          style={{ width: "70px" }}
          onClick={stopSearch}
        >
          {" "}
          Stop search{" "}
        </button>
      )}
      {showCountdown && <div className="countdown"> {countdown} </div>}
    </div>
  );
}
