export default function TableGamesRow(props: { row: any }) {
  return (
    <>
      <tr>
        <td>{props.row.id}</td>
        <td>{props.row.player1}</td>
        <td>{props.row.player2}</td>
        <td>{props.row.score}</td>
      </tr>
    </>
  );
}
