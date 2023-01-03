import { useContext } from "react";
import "../styles/notif.css";
import { ChatContext } from "../context/socketContext";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";

const getNotif = (data) => {
  let notif = { ...data };

  switch (notif.type) {
    case "Friend Request":
      notif.data = { from: notif.from, to: notif.to };
      notif.body = `${notif.from.username} wants to be your friend`;
      notif.accept = "Accept";
      notif.decline = "Decline";
      notif.acceptEvent = "acceptFriendRequest";
      notif.declineEvent = "deleteNotif";
      break;
    case "Delete Friend":
      notif.data = { from: notif.from, to: notif.to };
      notif.body = `Delete ${notif.to.username} from your friendlist ?`;
      notif.accept = "Yes";
      notif.decline = "No";
      notif.acceptEvent = "deleteFriend";
      break;
    case "Game Invite":
      notif.data = { from: notif.from, to: notif.to };
      notif.body = `${notif.from.username} invited you to play a game`;
      notif.accept = "Accept";
      notif.decline = "Decline";
      notif.acceptEvent = "acceptGameInvite";
      notif.declineEvent = "deleteNotif";
      break;
    case "Chan Invite":
      notif.data = { from: notif.from, to: notif.to, channel: notif.channel };
      notif.body = `${notif.from.username} invited you to join chat channel ${notif.channel.name}`;
      notif.accept = "Accept";
      notif.decline = "Decline";
      notif.acceptEvent = "acceptChannelInvite";
      notif.declineEvent = "deleteNotif";
      break;
    default:
      break;
  }
  return notif;
};

const Notif = ({ notifs, setNotifs }) => {
  const socket = useContext(ChatContext);
  const notif = getNotif(notifs[0]);

  const handleAccept = () => {
    if (notif.acceptEvent) {
      console.log(notif.acceptEvent);
      socket.emit(notif.acceptEvent, notifs[0]);
    } else console.log("accept event undefined");
    setNotifs((prev) => {
      const tmp = [...prev];
      tmp.shift();
      return tmp;
    });
  };

  const handleDecline = () => {
    if (notif.declineEvent) {
      console.log(notif.declineEvent);
      socket.emit(notif.declineEvent, notifs[0]);
    } else console.log("decline event undefined");
    setNotifs((prev) => {
      const tmp = [...prev];
      tmp.shift();
      return tmp;
    });
  };

  return (
    <div className="notif">
      <div className="header">{notif.type}</div>
      <div className="body">{notif.body}</div>
      <div className="buttons">
        <Button variant="primary" onClick={handleAccept}>
          {" "}
          {notif.accept}{" "}
        </Button>
        <Button variant="secondary" onClick={handleDecline}>
          {" "}
          {notif.decline}{" "}
        </Button>
      </div>
    </div>
  );
};

export default Notif;
