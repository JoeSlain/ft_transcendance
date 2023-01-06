import { useContext, useState } from "react";
import { ChatContext } from "../../context/socketContext";
import { userType } from "../../types/userType";
import { ModalContext } from "../../context/modalContext";
import User from "../../hooks/User";

export type UserProps = {
  friend: userType;
};

export const UserContextList = ({ friend }: UserProps) => {
  const socket = useContext(ChatContext);
  const { user } = useContext(User);
  const { setModal } = useContext(ModalContext);

  const handleInvite = () => {
    socket.emit("notif", {
      type: "Game Invite",
      from: user,
      to: friend,
      acceptEvent: "acceptGameInvite",
    });
    console.log("invited", friend);
  };

  const handleDelete = () => {
    setModal({
      header: "Delete Friend",
      body: `Are you sure you want to remove ${friend.username} from your friends  ?`,
      acceptEvent: "deleteFriend",
      data: {
        friend,
        user,
      },
    });
  };

  const handleSpectate = () => {
    console.log("spectate", user);
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
