import { useContext, useState } from "react";
import { ChatContext, GameContext } from "../../context/socketContext";
import { userType } from "../../types/userType";
import { ModalContext } from "../../context/modalContext";
import User from "../../hooks/User";

export type UserProps = {
  selected: userType;
};

export const UserContextList = ({ selected }: UserProps) => {
  const chatSocket = useContext(ChatContext);
  const gameSocket = useContext(GameContext);
  const { user } = useContext(User);
  const { setModal } = useContext(ModalContext);

  const handleInvite = () => {
    chatSocket.emit("notif", {
      type: "Game Invite",
      from: user,
      to: selected,
      acceptEvent: "acceptGameInvite",
    });
    console.log("invited", selected);
  };

  const handleDelete = () => {
    setModal({
      header: "Delete Friend",
      body: `Are you sure you want to remove ${selected.username} from your friends  ?`,
      acceptEvent: "deleteFriend",
      data: {
        selected,
        user,
      },
    });
  };

  const handleSpectate = () => {
    gameSocket.emit("spectate", { user: selected, me: user });
    console.log("spectate", selected);
  };

  return (
    <ul>
      <li onClick={handleInvite}> Invite </li>
      <li> Block </li>
      <li onClick={handleDelete}> Delete </li>
      <li onClick={handleSpectate}> Spectate </li>
    </ul>
  );
};
