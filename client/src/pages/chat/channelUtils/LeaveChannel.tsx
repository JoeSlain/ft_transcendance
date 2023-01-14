import { useContext } from "react";
import { ModalContext } from "../../../context/modalContext";
import { channelType } from "../../../types/channelType";
import { ChatContext } from "../../../context/socketContext";
import User from "../../../hooks/User";

type Props = {
  channel: channelType;
};

export default function LeaveChannel({ channel }: Props) {
  const { setModal } = useContext(ModalContext);
  const socket = useContext(ChatContext);
  const { user } = useContext(User);

  const handleAccept = () => {
    socket.emit("leaveChannel", { channel, user });
    setModal(null);
  };

  return (
    <>
      <div className="modalBody">Leave {channel.name} ?</div>
      <div className="modalButtons">
        <button className="modalButton" onClick={handleAccept}>
          Yes
        </button>
        <button className="modalButton" onClick={() => setModal(null)}>
          {" "}
          No{" "}
        </button>
      </div>
    </>
  );
}
