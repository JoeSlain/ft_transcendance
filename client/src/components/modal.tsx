import { ReadyStyle } from "../styles/readyStyle";
import { ModalType } from "../types/modalType";
import "../styles/modal.css";
import { useContext } from "react";
import { ChatContext } from "../context/socketContext";
import { ModalContext } from "../context/modalContext";

export default function Modal({ header, body, acceptEvent, data }: ModalType) {
  const socket = useContext(ChatContext);
  const { setModal } = useContext(ModalContext);

  const handleAccept = () => {
    socket.emit(acceptEvent, data);
    setModal(null);
  };

  const handleDecline = () => {
    setModal(null);
  };

  return (
    <div className="modal">
      <div className="modalHeader">{header}</div>
      <div className="modalBody">{body}</div>
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
    </div>
  );
}
