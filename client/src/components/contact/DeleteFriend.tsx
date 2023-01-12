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
      <div className="modalButtons mb-5 gap-2">
        <button
          className="btn btn-sm md:btn-md gap-2 normal-case lg:gap-3 bg-primary"
          onClick={handleAccept}
        >
          {" "}
          Yes{" "}
        </button>
        <button
          className="btn btn-sm md:btn-md gap-2 normal-case lg:gap-3 bg-primary"
          onClick={handleDecline}
        >
          {" "}
          No{" "}
        </button>
      </div>
    </>
  );
}
