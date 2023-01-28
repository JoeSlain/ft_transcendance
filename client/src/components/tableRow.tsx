/*export default function TableRow(props: { row: any }) {
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
*/

export default function TableRow(props: { row: any; user: any }) {
  let me, opponent, winner;
  let myScore, opponentScore, result;

  if (props.user.id === props.row.user1.id) {
    me = props.row.user1;
    opponent = props.row.user2;
    myScore = props.row.score1;
    opponentScore = props.row.score2;
  } else {
    me = props.row.user2;
    opponent = props.row.user1;
    myScore = props.row.score2;
    opponentScore = props.row.score1;
  }
  if (me.id === props.row.winnerId) {
    winner = me;
    result = "win";
  } else {
    winner = opponent;
    result = "loss";
  }
  const score =
    me.id === winner.id
      ? `${myScore}/${opponentScore}`
      : `${opponentScore}/${myScore}`;

  return (
    <>
      <tr>
        <td>{opponent.username}</td>
        <td>{result}</td>
        <td>{score}</td>
        <td>{props.row.date}</td>
      </tr>
    </>
  );
}
