import { useContext, useState } from "react";
import { notifType } from "../../types/notifType";
import User from "../../hooks/User";

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
  const [notifs, setNotifs] = useState<notif[]>([
    {
      id: 0,
      type: "Game Invite",
      from: "dchheang",
      to: "safernan",
      acceptEvent: "acceptGameInvite",
    },
  ]);

  return (
    <div className="notifs" onClick={() => setShow(true)}>
      <div className="notifIcon"> ! </div>
      <div className="notifMenu">
        {show &&
          notifs &&
          notifs.map((notif) => (
            <div key={notif.id} className="notifEntry">
              <div className={"notifBody"}></div>
              <div className={"notifButtons"}>
                <span className="checkMark"></span>
                <span className="crossMark"></span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
