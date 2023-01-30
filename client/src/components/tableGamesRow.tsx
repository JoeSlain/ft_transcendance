import { useContext } from "react";
import { GameContext } from "../context/socketContext";
import User from "../hooks/User";
import { useNavigate } from "react-router-dom";

export default function TableGamesRow(props: { row: any }) {
  const socket = useContext(GameContext);
  const { user } = useContext(User);
  const navigate = useNavigate();

  const spectate = () => {
    console.log("spectate");
    socket.emit("spectate", { me: user, user: props.row.player1 });
    navigate("/play");
  };

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
        {user.id !== props.row.player1.id && user.id !== props.row.player2.id && (
          <td onClick={spectate} className="btn btn-primary">
            {" "}
            Spectate{" "}
          </td>
        )}
      </tr>
    </>
  );
}
