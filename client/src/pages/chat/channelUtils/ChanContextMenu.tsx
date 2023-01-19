import { useContext } from "react";
import { ContextMenu } from "../../../styles/menus";
import { ChatContext } from "../../../context/socketContext";
import User from "../../../hooks/User";
import { channelType } from "../../../types/channelType";
import { ModalContext } from "../../../context/modalContext";
import RemovePassword from "./RemovePassword";
import SetPassword from "./SetPassword";
import DeleteChannel from "./DeleteChannel";
import LeaveChannel from "./LeaveChannel";

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
  const { setModal } = useContext(ModalContext);

  const handleDelete = () => {
    setModal({
      header: `Delete ${channel.name}`,
      body: <DeleteChannel channel={channel} />,
    });
  };

  return (
    <ul>
      <li onClick={handleDelete}> Delete </li>
    </ul>
  );
};

const ProtectedContextMenu = ({ channel, setChannel }: ChannelProps) => {
  const { user } = useContext(User);
  const { setModal } = useContext(ModalContext);
  const owned = channel.owner && channel.owner.id === user.id;
  const userInChannel =
    channel.users && channel.users.find((u) => u.id === user.id);

  const setPassword = () => {
    setModal({
      header: `Change ${channel.name} password`,
      body: <SetPassword channel={channel} />,
    });
  };

  const removePassword = () => {
    console.log("remove pass");

    setModal({
      header: `Remove ${channel.name} Password`,
      body: <RemovePassword channel={channel} />,
    });
  };

  const handleLeave = () => {
    setModal({
      header: `Leave ${channel.name}`,
      body: <LeaveChannel channel={channel} />,
    });
  };

  if (userInChannel) {
    return (
      <ul>
        {owned && (
          <>
            <li onClick={removePassword}> Remove Password </li>
            <li onClick={setPassword}> Change Password </li>
          </>
        )}
        <li onClick={handleLeave}> Leave </li>
      </ul>
    );
  }
  return <></>;
};

const PublicContextMenu = ({ channel, setChannel }: ChannelProps) => {
  const { user } = useContext(User);
  const { setModal } = useContext(ModalContext);
  const owned = channel.owner && channel.owner.id === user.id;
  const userInChannel =
    channel.users && channel.users.find((u) => u.id === user.id);

  const setPassword = () => {
    setModal({
      header: `Set ${channel.name} password`,
      body: <SetPassword channel={channel} />,
    });
  };

  const handleLeave = () => {
    setModal({
      header: `Leave ${channel.name}`,
      body: <LeaveChannel channel={channel} />,
    });
  };

  if (userInChannel) {
    return (
      <ul>
        {owned && (
          <>
            <li onClick={setPassword}> Set Password </li>
          </>
        )}
        <li onClick={handleLeave}> Leave </li>
      </ul>
    );
  }
  return <></>;
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
          <ProtectedContextMenu channel={channel} setChannel={setChannel} />
        </ContextMenu>
      );
    return (
      <ContextMenu top={points.y} left={points.x}>
        <PublicContextMenu channel={channel} setChannel={setChannel} />
      </ContextMenu>
    );
  }
  return <></>;
};
