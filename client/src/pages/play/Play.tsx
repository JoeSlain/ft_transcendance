import { useContext, useEffect, useState } from "react";
import { ChatContext, GameContext } from "../../context/socketContext";
import User from "../../hooks/User";
import { roomType } from "../../types/roomType";
import PlayerEntry from "./playerEntry";
import Spectators from "./spectators";
import useLobbyEvents from "../../hooks/gameEvents/useLobbyEvents";
import "../../styles/play.css";
import Buttons from "./Buttons";

export default function Play() {
  const [room, setRoom] = useState<roomType | null>(null);

  useLobbyEvents({ setRoom });

  const searchOpponent = () => {};

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
  return (
    <div className="center">
      <div className="play">
        <div className="playHeader">
          <h1> Play </h1>
        </div>
        <div className="playBody"></div>
        <div className="playFooter">
          <button
            className="customButton"
            id="searchOpponentButton"
            onClick={searchOpponent}
          >
            {" "}
            Search Opponent{" "}
          </button>
        </div>
      </div>
    </div>
  );
}
