import "../styles/play.css";
import { useContext, useEffect, useState } from "react";
import Friend from "./friend";
import { UserContext } from "../context/userContext";
import { GameContext } from "../context/socketContext";
import { getStorageItem } from "../storage/localStorage";
import { Socket } from "socket.io-client";
import { saveStorageItem } from "../storage/localStorage";
import { GameReadyStyle, ReadyStyle } from "../styles/statuses";

const GetReady = ({ ready }) => {
  if (ready) return <ReadyStyle color="green"> ✓ </ReadyStyle>;
  return <ReadyStyle color="red"> x </ReadyStyle>;
};

const PlayerEntry = ({ room, player, ready, setReady }) => {
  const user = useContext(UserContext);
  const socket = useContext(GameContext);
  const me = user.id === player.infos.id;

  const leaveRoom = () => {
    const data = {
      userId: user.id,
      roomId: room.id,
    };
    console.log("userId", user.id);
    console.log("roomId", room.id);
    socket.emit("leaveRoom", data);
  };

  return (
    <div className="playerEntry">
      <h2>
        {`${player.infos.username} `}
        <GetReady ready={ready} />
      </h2>
      <div className="playerButtons">
        <button onClick={() => setReady(!ready)}> Ready </button>
        {me && <button onClick={leaveRoom}> Leave </button>}
      </div>
    </div>
  );
};

const Spectators = ({ room }) => {
  console.log('spectators', room.spectators)
  console.log('room', room)
  return (
    <div className='spectators'>
      <b>Spectating : </b>
      {room.spectators && room.spectators.map(spectator => {
        return `${spectator.username}, `
      })}
    </div>
  )
}

const Play = ({ room, setRoom }) => {
  const [hostReady, setHostReady] = useState(false)
  const [guestReady, setGuestReady] = useState(false)

  const searchOpponent = () => {

  }

  const startGame = () => {

  }

  if (room) {
    return (
      <div className='play'>
        <div className='playHeader'>
          <h1> Room {room && room.id} </h1>
        </div>
        <div className='playBody'>
          {room.host && <PlayerEntry player={room.host} ready={hostReady} setReady={setHostReady} room={room} />}
          {room.guest && <PlayerEntry player={room.guest} ready={guestReady} setReady={setGuestReady} room={room} />}
        </div>
        <div className='playFooter'>
          <button onClick={startGame}> Start </button>
          <Spectators room={room} />
        </div>
      </div >
    )
  }
  else {
    return (
      <div className='play'>
        <div className='playHeader'>
          <h1> Play </h1>
        </div>
        <div className='playBody'>
        </div>
        <div className='playFooter'>
          <button onClick={searchOpponent}> Search opponent </button>
        </div>
      </div>
    )
  }
}

export default Play;
