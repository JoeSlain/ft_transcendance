import { useState } from "react";
import useClickListener from "../../hooks/useClickListener";
import useFriendsEvent from "../../hooks/chatEvents/useFriendsEvent";
import { DotStyle } from "../../styles/dot";
import { userType } from "../../types/userType";
import { ContextMenu } from "../../styles/menus";
import { UserContextList } from "./userContextList";

const getColor = (status?: string) => {
  switch (status) {
    case "online":
      return "green";
    case "ingame":
      return "yellow";
    default:
      return "grey";
  }
};

export default function Users() {
  const [show, setShow] = useState(false);
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState<userType>();
  const [friends, setFriends] = useState<userType[]>([]);
  const [statuses, setStatuses] = useState(new Map<number, string>());

  useClickListener({ show, setShow });
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
              setShow(true);
              setClicked(friend);
              setPoint({ x: e.pageX, y: e.pageY });
            }}
          >
            {friend.username}
            <DotStyle color={getColor(statuses.get(friend.id))} />
          </div>
        ))}
      {show && (
        <ContextMenu top={point.y} left={point.x}>
          <UserContextList user={clicked} />
        </ContextMenu>
      )}
    </div>
  );
}
