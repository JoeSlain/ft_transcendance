import { useQuery } from "@tanstack/react-query";
import Loading from "../../components/loading";
import Error from "../../components/error";
import { getUser } from "../../services/User/GetUser";

const games = [
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
];

export default function History(props: { userId: number }) {
  let { isLoading, data, error } = useQuery({
    queryKey: ["userData", props.userId],
    queryFn: ({ queryKey }) => getUser(queryKey[1].toString()),
  });
  if (isLoading) return <Loading />;
  if (error) {
    return <Error err="Error fetching user" />;
  }
  if (data) {
    console.log("games: ", data.games);
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
            {games.map((row: any) => (
              <TableRow row={row} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return <></>;
}
