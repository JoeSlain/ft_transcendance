import "../../styles/Home.css";
import "../../styles/global.css";
import "../../styles/contact.css";
import React from "react";
import Auth from "../../hooks/Auth";
import TableRow from "../../components/tableRow";
import { gameType } from "../../types/gameType";

let arr: gameType[] = [
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
          {/*arr.map((row: any, index) => (
            <TableRow key={index} row={row} />
          ))*/}
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
