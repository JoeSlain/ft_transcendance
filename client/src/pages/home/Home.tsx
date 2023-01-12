import "../../styles/Home.css";
import "../../styles/global.css";
import "../../styles/contact.css";
import React from "react";
import Auth from "../../hooks/Auth";
import { gameType } from "../../types/gameType";

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

function Games()
{
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
          {arr?.map((row: any) => (
            <TableRow row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableRow(props: { row: any }) {
  return (
    <tr>
      {props.row.map((val: any) => (
        <td>{val}</td>
      ))}
    </tr>
  );
}


export default function Home() {
  const isLogged = React.useContext(Auth);
  console.log("isLogged", isLogged);

  return (
        <>
        <h1 className="flex justify-center text-primary w-[100%] mt-5  font-retro text-5xl">Current games</h1>
        {/*         <Games/> */}
        </>
  
  );
}
