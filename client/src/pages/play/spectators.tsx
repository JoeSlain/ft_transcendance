import { roomType } from "../../types/roomType";
import { userType } from "../../types/userType";

type IProps = {
  spectators: userType[];
};

export default function Spectators({ spectators }: IProps) {
  console.log("spectators", spectators);
  return (
    <div className="spectators">
      <b>Spectating : </b>
      {spectators &&
        spectators.map((spectator) => {
          return `${spectator.username}, `;
        })}
    </div>
  );
}
