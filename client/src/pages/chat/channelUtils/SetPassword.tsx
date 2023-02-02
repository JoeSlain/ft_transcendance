import { useContext, useState } from "react";
import { channelType } from "../../../types/channelType";
import { ModalContext } from "../../../context/modalContext";
import { ChatContext } from "../../../context/socketContext";

type Props = {
  channel: channelType;
};

export default function SetPassword({ channel }: Props) {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const { setModal } = useContext(ModalContext);
  const socket = useContext(ChatContext);

  console.log("set pass");

  const handleAccept = () => {
    channel.password = oldPass;
    socket.emit("setChannelPassword", {
      channel,
      newPassword: newPass,
    });
    setModal(null);
  };

  const handleDecline = () => {
    console.log("cancel set pass");
    setModal(null);
  };

  return (
    <>
      <div className="modalBody">
        {channel.type === "protected" && (
          <>
            <div>Old Password :</div>
            <input
              value={oldPass}
              type='password'
              onChange={(e) => setOldPass(e.target.value)}
            />
          </>
        )}
        <div>New Password :</div>
        <input value={newPass} type='password' onChange={(e) => setNewPass(e.target.value)} />
      </div>
      <div className="modalButtons">
        <button className="modalButton" onClick={handleAccept}>
          Confirm
        </button>
        <button className="modalButton" onClick={handleDecline}>
          Cancel
        </button>
      </div>
    </>
  );
}
