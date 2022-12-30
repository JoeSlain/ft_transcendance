import { useContext, useState } from "react";
import { ChatContext } from "../../context/socketContext";
import { UserContext } from "../../context/userContext";
import { Button, Modal } from "react-bootstrap";

const PasswordDialog = ({ channel, setProtectedChan }) => {
  const socket = useContext(ChatContext);
  const user = useContext(UserContext);
  const [pass, setPass] = useState("");

  const handleAccept = () => {
    channel.password = pass;
    socket.emit("joinChannel", { channel, user });
    setProtectedChan(null);
  };

  return (
    <Modal show={true}>
      <div className="notif">
        <div className="header">
          <Modal.Title id="contained-modal-title-vcenter">
            {`Enter ${channel.name} password`}
          </Modal.Title>
        </div>
        <div className="body">
          <input onChange={(e) => setPass(e.target.value)} />
        </div>
        <div className="buttons">
          <Button variant="primary" onClick={handleAccept}>
            Confirm
          </Button>
          <Button variant="secondary" onClick={() => setProtectedChan(null)}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PasswordDialog;
