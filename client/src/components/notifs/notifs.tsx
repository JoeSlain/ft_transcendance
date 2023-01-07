import { useContext, useEffect, useState } from "react";
import "../../styles/notifs.css";
import User from "../../hooks/User";
import { ReadyStyle } from "../../styles/readyStyle";
import useClickListener from "../../hooks/useClickListener";
import { notifType } from "../../types/notifType";
import useNotifsEvent from "../../hooks/chatEvents/useNotifsEvent";
import { ChatContext } from "../../context/socketContext";

type notif = {
  id: number;
  type: string;
  from: string;
  to: string;
  acceptEvent: string;
};

export default function Notifs() {
  const user = useContext(User);
  const [show, setShow] = useState(false);
  const [notifs, setNotifs] = useState<notifType[]>([]);
  const socket = useContext(ChatContext);

  useClickListener({ show, setShow });
  useNotifsEvent(setNotifs);

  const handleAccept = (notif: notifType) => {
    socket.emit(notif.acceptEvent, notif);
    setNotifs(notifs.filter((n) => n.id !== notif.id));
  };

  const handleDecline = (notif: notifType) => {
    socket.emit("deleteNotif", notif);
    setNotifs(notifs.filter((n) => n.id !== notif.id));
  };

  return (
    <div className="notifs">
      <button onClick={() => setShow(true)} className="notifIcon">
        !
      </button>
      {show && notifs && (
        <div className="dropdown-content">
          {notifs.map((notif) => (
            <div className="notifEntry" key={notif.id}>
              <div className={"notifBody"}>
                {" "}
                {notif.type} from {notif.from.username}{" "}
              </div>
              <div className={"notifButtons"}>
                <ReadyStyle color="green" onClick={() => handleAccept(notif)}>
                  {" "}
                  ✓{" "}
                </ReadyStyle>
                <ReadyStyle color="red" onClick={() => handleDecline(notif)}>
                  {" "}
                  x{" "}
                </ReadyStyle>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
