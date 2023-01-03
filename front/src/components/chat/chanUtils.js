import { useContext } from "react";
import { ChatContext } from "../../context/socketContext";
import { UserContext } from "../../context/userContext";
import { ContextMenu } from "../../styles/menus";
import { ChanStyle } from "../../styles/channels";

const PrivateContextMenu = ({ channel, setChannel }) => {
  const socket = useContext(ChatContext);
  const user = useContext(UserContext);

  const handleDelete = () => {
    console.log("chanentry right clicked", channel);
    socket.emit("deleteChannel", { channel, user });
    setChannel(null);
  };

  return (
    <ul>
      <li onClick={handleDelete}> Delete </li>
    </ul>
  );
};

const PublicContextMenu = ({ channel, setChannel }) => {
  const setPassword = () => {
    setChannel(null);
  };

  return (
    <ul>
      <li onClick={setPassword}> Change Password </li>
    </ul>
  );
};

export const ChanContextMenu = ({ channel, setChannel, points }) => {
  if (channel) {
    if (channel.type === "private")
      return (
        <ContextMenu top={points.y} left={points.x}>
          <PrivateContextMenu channel={channel} setChannel={setChannel} />
        </ContextMenu>
      );
    else if (channel.type === "protected")
      return (
        <ContextMenu top={points.y} left={points.x}>
          <PublicContextMenu channel={channel} setChannel={setChannel} />
        </ContextMenu>
      );
  }
};

export const ChanEntry = ({ channel, selected }) => {
  return (
    <ChanStyle
      color={
        selected && selected.id === channel.id && selected.type === channel.type
          ? "lightgrey"
          : "white"
      }
    >
      {channel.name}
    </ChanStyle>
  );
};
