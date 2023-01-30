export default function TableGamesRow(props: { row: any }) {
  return (
    <>
      <tr>
        <td>{props.row.id}</td>
        <td>
          {" "}
          {props.row.player1.username} ({props.row.player1.elo})
        </td>
        <td>
          {props.row.player2.username}({props.row.player2.elo})
        </td>
        <td>{props.row.score}</td>
      </tr>
    </>
  );
}
