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

  useClickListener(setShow);

  return (
    <div className="notifs">
      <div
        className="notifIcon"
        onClick={(e) => {
          console.log("icon clicked");
          setPoint({ x: e.pageX, y: e.pageY });
          setShow(true);
        }}
      >
        {" "}
        !{" "}
      </div>
      <ContextMenu top={point.y} left={point.x}>
        {show &&
          notifs &&
          notifs.map((notif) => (
            <div key={notif.id} className="notifEntry">
              <div className={"notifBody"}> {notif.type} </div>
              <div className={"notifButtons"}>
                <ReadyStyle color="green"> ✓ </ReadyStyle>
                <ReadyStyle color="red"> x </ReadyStyle>
                <span className="crossMark"></span>
              </div>
            </div>
          ))}
      </ContextMenu>
    </div>
  );
}
