import "../styles/userEntries.css";
import { FriendStatusStyle } from "../styles/statuses";

const UserEntry = ({ user, status }) => {
  const colors = {
    offline: "grey",
    online: "green",
    ingame: "yellow",
    away: "red",
  };

  return (
    <div className="userEntry">
      <div className="username">{user.username}</div>
      <div className="status">
        <FriendStatusStyle color={colors[status]}> `` </FriendStatusStyle>
      </div>
    </div>
  );
};

export default UserEntry;
