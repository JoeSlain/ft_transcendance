import { useContext } from "react";
import { ChatContext, GameContext } from "../../context/socketContext";
import { userType } from "../../types/userType";
import User from "../../hooks/User";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { saveItem } from "../../utils/storage";

export type UserProps = {
  selected: userType;
};

export const CommonContext = ({ selected }: UserProps) => {
  const chatSocket = useContext(ChatContext);
  const gameSocket = useContext(GameContext);
  const { user, setUser } = useContext(User);
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
    navigate("/play");
    console.log("spectate", selected);
  };

  const handleMessage = () => {
    chatSocket.emit("getConversation", {
      me: user,
      to: selected,
    });
  };

  const handleBlock = () => {
    axios
      .post(
        "http://10.11.7.11:3001/api/users/blockUser",
        {
          userId: selected.id,
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        if (!response.data)
          alert('error blocking user');
        else {
          setUser(response.data);
          saveItem('user', response.data);
          console.log("blocked", response.data);
        }
      });
  };

  const handleGetProfile = () => {
    navigate(`/profile/${selected.id}`);
  };

  return (
    <ul>
      <li onClick={handleInvite}> Invite </li>
      <li onClick={handleMessage}> Message </li>
      <li onClick={handleBlock}> Block </li>
      <li onClick={handleGetProfile}> Get Profile </li>
      <li onClick={handleSpectate}> Spectate </li>
    </ul>
  );
};
