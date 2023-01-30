import { useContext } from "react";
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
  /*const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountDown] = useState({
    min: 0,
    sec: 0,
  });*/
  const { countdown, setCountdown } = useContext(CountdownContext);
  let showStart = false;
  let playersReady = false;
  let showSearch = false;
  const showLeave = room.spectators.find((sp) => sp.id === user.id);

  /*useEffect(() => {
    socket.on("stopQueue", () => {
      console.log("stop queue");
      setCountdown(null);
      //setShowCountdown(false);
    });

    return () => {
      socket.off("stopQueue");
    };
  }, []);

  useEffect(() => {
    if (countdown) {
      const interval = setInterval(() => {
        console.log("countdown", countdown);
        let min = countdown.min;
        let sec = countdown.sec + 1;
        if (sec === 60) {
          min += 1;
          sec = 0;
        }
        setCountdown({ min, sec });
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [countdown]);*/

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
    setCountdown({ min: 0, sec: 0 });
    /*const interval = setInterval(() => {
      setCountDown((prev) => prev + 1);
      console.log("countdown", countdown);
    }, 1000);*/
  };

  const stopSearch = () => {
    socket.emit("stopQueue", user);
    setCountdown(null);
    //setShowCountdown(false);
  };

  return (
    <div className="flex flex-col justify-center">
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
  );
}
