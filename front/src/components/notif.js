import { useContext } from "react";
import "../styles/notif.css";
import { ChatContext, GameContext } from "../context/socketContext";
import { Modal } from "react-bootstrap";
import { Button } from "react-bootstrap";

const getNotif = (notif, chatSocket, gameSocket) => {
  switch (notif.type) {
    case "Friend Request":
      notif.data = { from: notif.from, to: notif.to };
      notif.body = `${notif.from.username} wants to be your friend`;
      notif.accept = "Accept";
      notif.decline = "Decline";
      notif.acceptEvent = "acceptFriendRequest";
      notif.declineEvent = "deleteNotif";
      notif.socket = chatSocket;
      break;
    case "Delete Friend":
      notif.data = { from: notif.from, to: notif.to };
      notif.body = `Delete ${notif.to.username} from your friendlist ?`;
      notif.accept = "Yes";
      notif.decline = "No";
      notif.acceptEvent = "deleteFriend";
      notif.socket = chatSocket;
      break;
    case "Game Invite":
      notif.data = { from: notif.from, to: notif.to };
      notif.body = `${notif.from.username} invited you to play a game`;
      notif.accept = "Accept";
      notif.decline = "Decline";
      notif.acceptEvent = "acceptGameInvite";
      notif.socket = chatSocket;
      break;
    case "Chan Invite":
      notif.data = { from: notif.from, to: notif.to, channel: notif.channel };
      notif.body = `${notif.from.username} invited you to join chat channel ${notif.channel.name}`;
      notif.accept = "Accept";
      notif.decline = "Decline";
      notif.acceptEvent = "acceptChannelInvite";
      notif.declineEvent = "deleteNotif";
      notif.socket = chatSocket;
      break;
    default:
      break;
  }
  return notif;
};

const Notif = ({ notifs, setNotifs }) => {
  const chatSocket = useContext(ChatContext);
  const gameSocket = useContext(GameContext);
  const notif = getNotif(notifs[0], chatSocket, gameSocket);

  const handleAccept = () => {
    if (notif.acceptEvent) {
      console.log(notif.acceptEvent);
      notif.socket.emit(notif.acceptEvent, notif.data);
    } else console.log("accept event undefined");
    setNotifs(notifs.filter((n) => n.id !== notif.id));
  };

  const handleDecline = () => {
    if (notif.declineEvent) {
      console.log(notif.declineEvent);
      notif.socket.emit(notif.declineEvent, {
        from: notif.from,
        to: notif.to,
      });
    } else console.log("decline event undefined");
    setNotifs(notifs.filter((n) => n.id !== notif.id));
  };

  return (
    <Modal show={true}>
      <div className="notif">
        <div className="header">
          <Modal.Title id="contained-modal-title-vcenter">
            {notif.type}
          </Modal.Title>
        </div>
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
    </Modal>
  );
};

export default Notif;
