import { useContext, useState } from "react";
import { ChatContext } from "../../../context/socketContext";
import User from "../../../hooks/User";
import { channelType } from "../../../types/channelType";
import "../../../styles/modal.css";
import { ModalContext } from "../../../context/modalContext";

type Props = {
  channel: channelType;
};

const PasswordDialog = ({ channel }: Props) => {
  const socket = useContext(ChatContext);
  const { user } = useContext(User);
  const { setModal } = useContext(ModalContext);
  const [pass, setPass] = useState("");

  const handleAccept = () => {
    channel.password = pass;
    socket.emit("joinChannel", { channel, user });
    setModal(null);
  };

  return (
    <form className="modalForm">
      <div className="modalBody">
        <div> Password : </div>
        <input onChange={(e) => setPass(e.target.value)} />
      </div>
      <div className="modalButtons">
        <button className="modalButton" onClick={handleAccept}>
          Confirm
        </button>
        <button className="modalButton" onClick={() => setModal(null)}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default PasswordDialog;
