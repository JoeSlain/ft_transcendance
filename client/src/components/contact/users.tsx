import { useState } from "react";
import { ContextMenu } from "../../styles/menus";
import useClickListener from "../../hooks/useClickListener";
import { UserContextList } from "./userContextList";
import useFriendsEvent from "../../hooks/chatEvents/useFriendsEvent";
import { DotStyle } from "../../styles/dot";
import { userType } from "../../types/userType";

const getColor = (status?: string) => {
  switch (status) {
    case "online":
      console.log("green");
      return "green";
    case "offline":
      console.log("grey");
      return "grey";
    default:
      console.log("yellow");
      return "yellow";
  }
};

export default function Users() {
  const [showContext, setShowContext] = useState(false);
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState<userType>();
  const [friends, setFriends] = useState<userType[]>([]);
  const [statuses, setStatuses] = useState(new Map<number, string>());

  useClickListener(setShowContext);
  useFriendsEvent({ setFriends, setStatuses });

  return (
    <div className="users">
      {friends &&
        friends.map((friend) => (
          <div
            key={friend.id}
            className="userEntry"
            onContextMenu={(e) => {
              e.preventDefault();
              setShowContext(true);
              setClicked(friend);
              setPoint({ x: e.pageX, y: e.pageY });
            }}
          >
            {friend.username}
            <DotStyle color={getColor(statuses.get(friend.id))} />
          </div>
        ))}
      {showContext && (
        <ContextMenu top={point.y} left={point.x}>
          <UserContextList user={clicked} />
        </ContextMenu>
      )}
    </div>
  );
}
