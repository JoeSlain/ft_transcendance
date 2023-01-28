import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/loading";
import Error from "../../components/error";
import { getUser } from "../../services/User/GetUser";
import TableRow from "../../components/tableRow";
import axios from "axios";
import { useEffect, useState } from "react";
import { gameType } from "../../types/gameType";
import { getGames } from "../../services/User/GetGames";

/*const games = [
  {
    userId1: 123,
    userId2: 123,
    winnerId: 123,
    score: "3/0",
    status: "Over",
    date: new Date().toISOString().slice(0, 10),
    gameId: 89043,
  },
  {
    userId1: 123,
    userId2: 123,
    winnerId: 123,
    score: "3/0",
    status: "Over",
    date: new Date().toISOString().slice(0, 10),
    gameId: 89043,
  },
];*/

export default function History(props: { userId: number }) {
  /* let { isLoading, data, error } = useQuery({
    queryKey: ["userData", props.userId],
    queryFn: ({ queryKey }) => getUser(queryKey[1].toString()),
  });
  if (isLoading) return <Loading />;
  if (error) {
    return <Error err="Error fetching user" />;
  }*/

  const [games, setGames] = useState<gameType[] | null>(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/users/games/${props.userId}`, {
        withCredentials: true,
      })
      .then((response) => {
        setGames(response.data);
      });
  }, []);

  //if (data) {
  //console.log("games: ", data);

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          <tr>
            <th>Game Id</th>
            <th>Opponents</th>
            <th>Winner</th>
            <th>Score</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {games &&
            games.map((row: any, index) => <TableRow row={row} key={index} />)}
        </tbody>
      </table>
    </div>
  );
  /*}
  return <></>;*/
}
