import { useContext, useState } from "react";
import { ChatContext } from "../../../context/socketContext";
import User from "../../../hooks/User";
import { channelType } from "../../../types/channelType";
import "../../../styles/modal.css";

type Props = {
  channel: channelType;
  setProtectedChan: (chan: channelType | null) => void;
};

const PasswordDialog = ({ channel, setProtectedChan }: Props) => {
  const socket = useContext(ChatContext);
  const { user } = useContext(User);
  const [pass, setPass] = useState("");

  const handleAccept = () => {
    channel.password = pass;
    socket.emit("joinChannel", { channel, user });
    setProtectedChan(null);
  };

  return (
    <div className="modal">
      <div className="modalHeader">{`Enter ${channel.name} password`}</div>
      <div className="modalBody">
        <div> Password : </div>
        <input onChange={(e) => setPass(e.target.value)} />
      </div>
      <div className="modalButtons">
        <button className="modalButton" onClick={handleAccept}>
          Confirm
        </button>
        <button className="modalButton" onClick={() => setProtectedChan(null)}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PasswordDialog;
