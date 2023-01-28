export default function TableRow(props: { row: any }) {
  return (
    <>
      <tr>
        <td>{props.row.gameId}</td>
        <td>{props.row.userId1}</td>
        <td>{props.row.winnerId}</td>
        <td>{props.row.score}</td>
        <td>{props.row.date}</td>
        <td>{props.row.status}</td>
      </tr>
    </>
  );
}
