import { useContext, useState } from "react";
import { ChatContext } from "../../../context/socketContext";
import User from "../../../hooks/User";
import { userType } from "../../../types/userType";

export type Props = {
  selectedUser: userType;
};

export const ChanUserContextList = ({ selectedUser }: Props) => {
  const chatSocket = useContext(ChatContext);
  const { user } = useContext(User);

  const handleSetAdmin = () => {};

  const handleBan = () => {};

  const handleMute = () => {};

  const handleGetProfile = () => {};

  const handleInvite = () => {
    chatSocket.emit("notif", {
      type: "Game Invite",
      from: user,
      to: selectedUser,
      acceptEvent: "acceptGameInvite",
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
