import "../../styles/Home.css";
import "../../styles/global.css";
import "../../styles/contact.css";
import React from "react";
import Auth from "../../hooks/Auth";
import { gameType } from "../../types/gameType";
import TableRow from "../../components/tableRow";

let arr: gameType[] = [
  {
    userId1: 123,
    userId2: 999,
    winnerId: 123,
    score: "3-0",
    status: "Finished",
    date: new Date(),
    gameId: 99999,
  },
  {
    userId1: 123,
    userId2: 999,
    winnerId: 123,
    score: "3-0",
    status: "Finished",
    date: new Date(),
    gameId: 99999,
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
}

export default function Home() {
  const isLogged = React.useContext(Auth);

  return (
    <>
      <h1 className="flex justify-center text-primary w-[100%] mt-5  font-retro text-5xl">
        Current games
      </h1>
      {/*         <Games/> */}
    </>
  );
}
