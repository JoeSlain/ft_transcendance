import { useContext, useState } from "react";
import { ModalContext } from "../../../context/modalContext";
import { channelType } from "../../../types/channelType";
import { ChatContext } from "../../../context/socketContext";

type Props = {
  channel: channelType;
};

export default function RemovePassword({ channel }: Props) {
  const [pass, setPass] = useState("");
  const socket = useContext(ChatContext);
  const { setModal } = useContext(ModalContext);

  const handleAccept = () => {
    channel.password = pass;
    socket.emit("removeChannelPassword", channel);
    setModal(null);
  };

  return (
    <>
      <div className="modalBody">
        <div>Password : </div>
        <input value={pass} onChange={(e) => setPass(e.target.value)} />
      </div>
      <div className="modalButtons">
        <button className="modalButton" onClick={handleAccept}>
          Confirm
        </button>
        <button className="modalButton" onClick={() => setModal(null)}>
          Cancel
        </button>
      </div>
    </>
  );
}
