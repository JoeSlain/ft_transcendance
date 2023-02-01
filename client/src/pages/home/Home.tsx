import "../../styles/Home.css";
import "../../styles/global.css";
import "../../styles/contact.css";
import React, { useContext, useEffect, useState } from "react";
import { GameContext } from "../../context/socketContext";
import { GameInfos } from "../../types/gameType";
import TableGamesRow from "../../components/tableGamesRow";

/*let arr: gameType[] = [
  {
    //user1: null,
    //user2: null,
    winnerId: 123,
    score1: 3,
    score2: 0,
    date: new Date(),
  },
  {
    //user1: null,
    //user2: null,
    winnerId: 123,
    score1: 4,
    score2: 2,
    date: new Date(),
  },
];

function Games() {
  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th></th>
            <th>Opponents</th>
            <th>Winner</th>
            <th>Score</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {arr.map((row: any, index) => (
            <TableRow key={index} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}*/

export default function Home() {
  //const isLogged = React.useContext(Auth);
  const socket = useContext(GameContext);
  const [games, setGames] = useState<GameInfos[] | null>(null);

  useEffect(() => {
    socket.emit("getCurrentGames");
    socket.on("newGames", (data) => {
      console.log(data);
      setGames(data);
    });

    socket.on("addGame", (game) => {
      setGames((prev: any) => [...prev, game]);
    });

    socket.on("deleteGame", (game) => {
      console.log("deleting game", game);
      setGames((prev: any) => {
        console.log("prev", prev);
        return prev.filter((g: GameInfos) => g.id !== game.gameId);
      });
    });

    socket.on("updateGames", (data) => {
      console.log("updating", data);
      setGames((prev: any) => {
        if (prev)
          return prev.map((game: GameInfos) => {
            if (game.id === data.gameId)
              return {
                ...game,
                score: `${data.player1.score}/${data.player2.score}`,
              };
            return game;
          });
      });
    });

    return () => {
      socket.off("newGames");
      socket.off("addGame");
      socket.off("deleteGame");
      socket.off("updateGames");
    };
  }, []);

  return (
    <div className="flex flex-col justify-center">
    <h1 className="font-retro ">Currents games</h1>
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Id</th>
            <th>Player1</th>
            <th>Player2</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {games &&
            games.map((row: any, index) => (
              <TableGamesRow row={row} key={index} />
            ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}
