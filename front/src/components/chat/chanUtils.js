import { useContext } from "react";
import { ChatContext } from "../../context/socketContext";
import { UserContext } from "../../context/userContext";
import { ContextMenu } from "../../styles/menus";
import { ChanStyle } from "../../styles/channels";

export const ChanContextMenu = ({ channel, setChannel, points }) => {
  const socket = useContext(ChatContext);
  const user = useContext(UserContext);

  const handleDelete = () => {
    console.log("chanentry right clicked", channel);
    socket.emit("deleteChannel", { channel, user });
    setChannel(null);
  };

  if (channel && channel.type === "private") {
    return (
      <ContextMenu top={points.y} left={points.x}>
        <ul>
          <li onClick={handleDelete}> Delete </li>
        </ul>
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
