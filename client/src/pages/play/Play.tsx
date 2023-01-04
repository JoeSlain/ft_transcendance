import { useContext, useEffect, useState } from "react";
import { ChatContext, GameContext } from "../../context/socketContext";
import User from "../../hooks/User";
import { roomType } from "../../types/roomType";
import PlayerEntry from "./playerEntry";
import Spectators from "./spectators";
import useLobbyEvents from "../../hooks/gameEvents/useLobbyEvents";
import "../../styles/play.css";

export default function Play() {
  const [room, setRoom] = useState<roomType | null>(null);
  const [hostReady, setHostReady] = useState(false);
  const [guestReady, setGuestReady] = useState(false);

  useLobbyEvents({ setRoom });

  const startGame = () => {};
  const searchOpponent = () => {};

  if (room) {
    return (
      <div className="center">
        <div className="play">
          <div className="playHeader">
            <h1> Room {room && room.id} </h1>
          </div>
          <div className="playBody">
            {room.host && (
              <PlayerEntry
                player={room.host.infos}
                ready={hostReady}
                setReady={setHostReady}
                room={room}
              />
            )}
            {room.guest && (
              <PlayerEntry
                player={room.guest.infos}
                ready={guestReady}
                setReady={setGuestReady}
                room={room}
              />
            )}
          </div>
          <div className="playFooter">
            <button onClick={startGame}> Start </button>
            <Spectators spectators={room.spectators} />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="center">
      <div className="play">
        <div className="playHeader">
          <h1> Play </h1>
        </div>
        <div className="playBody"></div>
        <div className="playFooter">
          <button onClick={searchOpponent}> Search opponent </button>
        </div>
      </div>
    </div>
  );
}
