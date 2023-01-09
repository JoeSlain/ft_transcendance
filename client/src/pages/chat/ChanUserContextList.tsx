import { useContext, useState } from "react";
import { ChatContext, GameContext } from "../../context/socketContext";
import { userType } from "../../types/userType";
import { ModalContext } from "../../context/modalContext";
import User from "../../hooks/User";

export type Props = {
  selectedUser: userType;
};

export const ChanUserContextList = ({ selectedUser }: Props) => {
  const chatSocket = useContext(ChatContext);
  const { user } = useContext(User);
  const { setModal } = useContext(ModalContext);

  const handleSetAdmin = () => {};

  const handleBan = () => {};

  const handleMute = () => {};

  const handleGetProfile = () => {};

  const handleInvite = () => {
    chatSocket.emit("notif", {
      type: "Game Invite",
      from: user,
      to: selectedUser,
      acceptEvent: "acceptChanInvite",
    });
    console.log("invited", selectedUser);
  };

  return (
    <ul>
      <li onClick={handleInvite}> Invite </li>
      <li> Block </li>
      <li onClick={handleSetAdmin}> Promote to admin </li>
      <li onClick={handleBan}> Ban </li>
      <li onClick={handleMute}> Mute </li>
      <li onClick={handleGetProfile}> Get Profile </li>
    </ul>
  );
};
