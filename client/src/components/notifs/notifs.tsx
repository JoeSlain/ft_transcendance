import { useContext, useState } from "react";
import "../../styles/notifs.css";
import User from "../../hooks/User";
import { ReadyStyle } from "../../styles/readyStyle";
import useClickListener from "../../hooks/useClickListener";
import { notifType } from "../../types/notifType";
import useNotifsEvent from "../../hooks/chatEvents/useNotifsEvent";
import { ChatContext } from "../../context/socketContext";
import { useNavigate } from "react-router-dom";

export default function Notifs() {
  const [selected, setSelected] = useState<boolean | null>(null);
  const [notifs, setNotifs] = useState<notifType[]>([]);
  const socket = useContext(ChatContext);
  const navigate = useNavigate();

  useClickListener({ selected, setSelected });
  useNotifsEvent(setNotifs);

  const handleAccept = (notif: notifType) => {
    socket.emit(notif.acceptEvent, notif);
    if (notif.type === "Game Invite") navigate("/play");
    setNotifs(notifs.filter((n) => n.id !== notif.id));
  };

  const handleDecline = (notif: notifType) => {
    socket.emit("deleteNotif", notif);
    setNotifs(notifs.filter((n) => n.id !== notif.id));
  };

  return (
    <div className="notifs">
      <button
        onClick={() => setSelected(true)}
        className={`notifIcon sm:text-[26px] ${
          notifs.length === 0 ? "" : "text-ata-yellow"
        }`}
      >
        !
      </button>
      {selected && (
        <div className="dropdown-content">
          {notifs.length ? (
            notifs.map((notif) => (
              <div className="notifEntry" key={notif.id}>
                <div className={"notifBody"}>
                  {" "}
                  {notif.type} from {notif.from.username}{" "}
                </div>
                <div className={"notifButtons"}>
                  <ReadyStyle
                    color="green"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAccept(notif);
                    }}
                  >
                    {" "}
                    ✓{" "}
                  </ReadyStyle>
                  <ReadyStyle
                    color="red"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDecline(notif);
                    }}
                  >
                    {" "}
                    x{" "}
                  </ReadyStyle>
                </div>
              </div>
            ))
          ) : (
            <div className="notifEntry">
              <div className="notifBody"> No new notifs. </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
