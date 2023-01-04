import { useContext, useEffect, useState } from "react";
import { notifType } from "../../types/notifType";
import "../../styles/notifs.css";
import User from "../../hooks/User";
import { ReadyStyle } from "../../styles/readyStyle";
import { ContextMenu } from "../../styles/menus";
import useClickListener from "../../hooks/useClickListener";

type notif = {
  id: number;
  type: string;
  from: string;
  to: string;
  acceptEvent: string;
};

export default function Notif() {
  const user = useContext(User);
  const [show, setShow] = useState(false);
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const [notifs, setNotifs] = useState<notif[]>([
    {
      id: 0,
      type: "Game Invite",
      from: "dchheang",
      to: "safernan",
      acceptEvent: "acceptGameInvite",
    },
  ]);
  useClickListener({ show, setShow });
  console.log("show", show);

  return (
    <div className="notifs">
      <button onClick={() => setShow(true)} className="notifIcon">
        !
      </button>
      {show && notifs && (
        <div className="dropdown-content">
          {notifs.map((notif) => (
            <div className="notifEntry" key={notif.id}>
              <div className={"notifBody"}> {notif.type} </div>
              <div className={"notifButtons"}>
                <ReadyStyle color="green"> ✓ </ReadyStyle>
                <ReadyStyle color="red"> x </ReadyStyle>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
