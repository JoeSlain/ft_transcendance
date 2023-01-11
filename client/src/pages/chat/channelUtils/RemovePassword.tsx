import { useContext, useState } from "react";
import { ModalContext } from "../../../context/modalContext";

type Props = {
  handleAccept: () => void;
};

export default function RemovePassword({ handleAccept }: Props) {
  const [pass, setPass] = useState("");
  const { setModal } = useContext(ModalContext);

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
