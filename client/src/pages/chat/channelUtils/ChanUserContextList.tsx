import { useContext } from "react";
import { ModalContext } from "../../../context/modalContext";
import { ChatContext } from "../../../context/socketContext";
import User from "../../../hooks/User";
import { channelType } from "../../../types/channelType";
import { userType } from "../../../types/userType";
import BanUser from "./BanUser";
import MuteUser from "./MuteUser";
import { CommonContext } from "../../../components/contextMenus/commonContext";

export type Props = {
  selectedUser: userType;
  channel: channelType;
};

export const ChanUserContextList = ({ selectedUser, channel }: Props) => {
  const chatSocket = useContext(ChatContext);
  const { user } = useContext(User);
  const { setModal } = useContext(ModalContext);
  const superUser =
    (channel.owner && channel.owner.id === user.id) ||
    (channel.admins && channel.admins.find((admin) => admin.id === user.id));

  const handleSetAdmin = () => {
    console.log("set admin");
    chatSocket.emit("setAdmin", { channel, user: selectedUser });
  };

  const handleBan = () => {
    setModal({
      header: `Ban ${selectedUser.username} from channel ${channel.name}`,
      body: <BanUser user={selectedUser} channel={channel} />,
    });
  };

  const handleMute = () => {
    setModal({
      header: `Mute ${selectedUser.username} on channel ${channel.name}`,
      body: <MuteUser user={selectedUser} channel={channel} />,
    });
  };

  return (
    <ul className="z-2">
      <CommonContext selected={selectedUser} />
      {superUser && selectedUser.id !== channel.owner.id && (
        <>
          <li onClick={handleSetAdmin}> Promote to admin </li>
          <li onClick={handleBan}> Ban </li>
          <li onClick={handleMute}> Mute </li>
        </>
      )}
    </ul>
  );
};
