import { useContext } from "react";
import { channelType } from "../../../types/channelType";
import User from "../../../hooks/User";

type Props = {
  channel: channelType;
};

export default function ChanEntry({ channel }: Props) {
  const { user } = useContext(User);
  const color = channel.owner.id === user.id ? "yellow" : "white";

  return (
    <div className="chanEntry" style={{ color: color }}>
      {channel.name}
    </div>
  );
}
