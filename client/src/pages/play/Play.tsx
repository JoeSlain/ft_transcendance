import { useState } from "react";
import { roomType } from "../../types/roomType";
import PlayerEntry from "./playerEntry";
import Spectators from "./spectators";
import useLobbyEvents from "../../hooks/gameEvents/useLobbyEvents";
import Buttons from "./Buttons";
import GameComponent from "../games/GameComponent";
import "../../styles/play.css";

export default function Play() {
  const [room, setRoom] = useState<roomType | null>(null);

  useLobbyEvents({ setRoom });

  if (room && room.gameStarted) {
    return <GameComponent room={room} setRoom={setRoom} />;
  }

  if (room) {
    return (
      <div className="flex flex-col justify-center items-center mt-7">
        <div className="">
          <h1> Room {room && room.id} </h1>
        </div>
        <div className="playBody">
          {room.host && <PlayerEntry player={room.host} room={room} />}
          {room.guest && <PlayerEntry player={room.guest} room={room} />}
        </div>
        <div className="playFooter">
          <Buttons room={room} />
          <Spectators spectators={room.spectators} />
        </div>
      </div>
    );
  }
  return <></>;
}
