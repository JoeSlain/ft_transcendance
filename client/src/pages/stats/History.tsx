import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../services/User/GetUser";

export default function History(props: { userId: number }) {
  let { isLoading, data, error } = useQuery({
    queryKey: ["userData", props.userId],
    queryFn: ({ queryKey }) => getUser(queryKey[1].toString()),
  });
  if (isLoading) {
    return (
      <div className="flex justify-center items-center heightMinusNavProfile ">
        <progress className="progress w-56"></progress>
      </div>
    );
  }
  if (error) {
    return (
      <div className="alert alert-error shadow-lg mt-2">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error! Couldn't find user.</span>
        </div>
      </div>
    );
  }
  if (data) {

    console.log("games: ", data.games);
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
            {data.games?.map((row: any) => (
              <TableRow row={row} />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return <></>;
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
