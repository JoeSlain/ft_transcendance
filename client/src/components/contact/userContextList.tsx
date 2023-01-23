import { useContext } from "react";
import { userType } from "../../types/userType";
import { ModalContext } from "../../context/modalContext";
import DeleteFriend from "./DeleteFriend";
import { CommonContext } from "../contextMenus/commonContext";

export type UserProps = {
  selected: userType;
};

export const UserContextList = ({ selected }: UserProps) => {
  const { setModal } = useContext(ModalContext);

  const handleDelete = () => {
    setModal({
      header: "Delete Friend",
      body: <DeleteFriend friend={selected} />,
    });
  };

  return (
    <ul>
      <CommonContext selected={selected} />
      <li onClick={handleDelete}> Delete </li>
    </ul>
  );
};
