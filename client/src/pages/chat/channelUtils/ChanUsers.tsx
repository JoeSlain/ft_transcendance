import { useContext, useState } from "react";
import { channelType } from "../../../types/channelType";
import "../../../styles/chat/channelUsersBar.css";
import "../../../styles/contact.css";
import AddChanUser from "./AddChanUser";
import { userType } from "../../../types/userType";
import { ContextMenu } from "../../../styles/menus";
import { ChanUserContextList } from "./ChanUserContextList";
import useClickListener from "../../../hooks/useClickListener";
import User from "../../../hooks/User";
import { saveItem } from "../../../utils/storage";

type Props = {
  selected: channelType | null;
  setSelected: (selected: channelType | null) => void;
};

export default function ChanUsers({ selected, setSelected }: Props) {
  const [user, setUser] = useState<userType | null>(null);
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const me = useContext(User).user;

  useClickListener({
    selected: user,
    setSelected: setUser,
  });

  if (selected && selected.users) {
    return (
      <div className="channelAside heightMinusNav pt-5">
        <div className="chanUsersBar">
          <div className="chanUsersHeader">
            <button
              className="btn btn-sm font-bold"
              onClick={() => {
                setSelected(null);
                saveItem("selected", null);
              }}
            >
              ←
            </button>
            <h1 className="usersTitle font-retro">Users</h1>
          </div>
          <div className="chanUsersBody">
            <AddChanUser selected={selected} />
            {selected.users.map((u) => {
              if (me.id !== u.id)
                return (
                  <div
                    className="userEntry"
                    key={u.id}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setPoint({ x: e.pageX, y: e.pageY });
                      setUser(u);
                    }}
                  >
                    {u.username}
                  </div>
                );
            })}
            {user && (
              <ContextMenu top={point.y} left={point.x}>
                <ChanUserContextList selectedUser={user} channel={selected} />
              </ContextMenu>
            )}
          </div>
        </div>
      </div>
    );
  }
  return <></>;
}
