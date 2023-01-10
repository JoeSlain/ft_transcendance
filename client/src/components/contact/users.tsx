import { useState } from "react";
import useClickListener from "../../hooks/useClickListener";
import useFriendsEvent from "../../hooks/chatEvents/useFriendsEvent";
import { DotStyle } from "../../styles/dot";
import { userType } from "../../types/userType";
import { ContextMenu } from "../../styles/menus";
import { UserContextList } from "./userContextList";
import "../../styles/contact.css";
import AddFriend from "./addFriendForm";

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
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<userType | null>(null);
  const [friends, setFriends] = useState<userType[]>([]);
  const [statuses, setStatuses] = useState(new Map<number, string>());

  useClickListener({ selected, setSelected });
  useFriendsEvent({ setFriends, setStatuses });

  return (
    <div className="users">
      <AddFriend />
      {friends &&
        friends.map((friend) => (
          <div
            key={friend.id}
            className="userEntry"
            onContextMenu={(e) => {
              e.preventDefault();
              setSelected(friend);
              setPoint({ x: e.pageX, y: e.pageY });
            }}
          >
            {friend.username}
            <DotStyle color={getColor(statuses.get(friend.id))} />
          </div>
        ))}
      {selected && (
        <ContextMenu top={point.y} left={point.x}>
          <UserContextList selected={selected} />
        </ContextMenu>
      )}
    </div>
  );
}
