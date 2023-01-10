import { useContext } from "react";
import { userType } from "../../types/userType";
import { ChatContext } from "../../context/socketContext";
import User from "../../hooks/User";
import { ModalContext } from "../../context/modalContext";

type Props = {
  friend: userType;
};

export default function DeleteFriend({ friend }: Props) {
  const socket = useContext(ChatContext);
  const { user } = useContext(User);
  const { setModal } = useContext(ModalContext);

  const handleAccept = () => {
    socket.emit("deleteFriend", { user, friend });
    setModal(null);
  };

  const handleDecline = () => {
    setModal(null);
  };

  return (
    <>
      <div className="modalBody">
        Are you sure you want to remove {friend.username} from your friends ?
      </div>
      <div className="modalButtons">
        <button className="modalButton" onClick={handleAccept}>
          {" "}
          Yes{" "}
        </button>
        <button className="modalButton" onClick={handleDecline}>
          {" "}
          No{" "}
        </button>
      </div>
    </>
  );
}
