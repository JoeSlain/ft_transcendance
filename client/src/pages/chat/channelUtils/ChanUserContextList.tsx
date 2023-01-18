import { useContext, useState } from "react";
import { ModalContext } from "../../../context/modalContext";
import { ChatContext } from "../../../context/socketContext";
import User from "../../../hooks/User";
import { channelType } from "../../../types/channelType";
import { userType } from "../../../types/userType";
import BanUser from "./BanUser";

export type Props = {
  selectedUser: userType;
  channel: channelType;
};

export const ChanUserContextList = ({ selectedUser, channel }: Props) => {
  const chatSocket = useContext(ChatContext);
  const { user } = useContext(User);
  const { setModal } = useContext(ModalContext);

  const handleSetAdmin = () => {};

  const handleBan = () => {
    setModal({
      header: `Ban ${selectedUser.username} from channel ${channel.name}`,
      body: <BanUser user={selectedUser} channel={channel} />,
    });
  };

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
    <ul className="z-2">
      <li onClick={handleInvite}> Invite </li>
      <li> Block </li>
      <li onClick={handleSetAdmin}> Promote to admin </li>
      <li onClick={handleBan}> Ban </li>
      <li onClick={handleMute}> Mute </li>
      <li onClick={handleGetProfile}> Get Profile </li>
    </ul>
  );
};
