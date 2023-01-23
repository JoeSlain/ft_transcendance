import { useContext } from "react";
import { ChatContext, GameContext } from "../../context/socketContext";
import { userType } from "../../types/userType";
import User from "../../hooks/User";
import { useNavigate } from "react-router-dom";

export type UserProps = {
  selected: userType;
};

export const CommonContext = ({ selected }: UserProps) => {
  const chatSocket = useContext(ChatContext);
  const gameSocket = useContext(GameContext);
  const { user } = useContext(User);
  const navigate = useNavigate();

  const handleInvite = () => {
    chatSocket.emit("notif", {
      type: "Game Invite",
      from: user,
      to: selected,
      acceptEvent: "acceptGameInvite",
    });
    console.log("invited", selected);
  };

  const handleSpectate = () => {
    gameSocket.emit("spectate", { user: selected, me: user });
    console.log("spectate", selected);
  };

  const handleMessage = () => {
    chatSocket.emit("getConversation", {
      me: user,
      to: selected,
    });
  };

  const handleGetProfile = () => {
    navigate(`/profile/${selected.id}`);
  };

  return (
    <ul>
      <li onClick={handleInvite}> Invite </li>
      <li onClick={handleMessage}> Message </li>
      <li> Block </li>
      <li onClick={handleGetProfile}> Get Profile </li>
      <li onClick={handleSpectate}> Spectate </li>
    </ul>
  );
};
