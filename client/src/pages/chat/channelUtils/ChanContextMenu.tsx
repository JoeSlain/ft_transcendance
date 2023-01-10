import { useContext } from "react";
import { ContextMenu } from "../../../styles/menus";
import { ChatContext } from "../../../context/socketContext";
import User from "../../../hooks/User";
import { channelType } from "../../../types/channelType";

type ContextMenuProps = {
  channel: channelType | null;
  setChannel: (chan: channelType | null) => void;
  points: {
    x: number;
    y: number;
  };
};

type ChannelProps = {
  channel: channelType;
  setChannel: (chan: channelType | null) => void;
};

const PrivateContextMenu = ({ channel, setChannel }: ChannelProps) => {
  const socket = useContext(ChatContext);
  const { user } = useContext(User);

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

const PublicContextMenu = ({ channel, setChannel }: ChannelProps) => {
  const { user } = useContext(User);

  const setPassword = () => {
    setChannel(null);
  };
  const removePassword = () => {
    setChannel(null);
  };

  return user.id === channel.owner.id ? (
    <ul>
      <li onClick={removePassword}> Remove Password </li>
      <li onClick={setPassword}> Change Password </li>
    </ul>
  ) : (
    <></>
  );
};

export const ChanContextMenu = ({
  channel,
  setChannel,
  points,
}: ContextMenuProps) => {
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
  return <></>;
};
