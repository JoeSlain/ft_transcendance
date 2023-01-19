import { useContext, useState } from "react";
import { ChatContext } from "../../context/socketContext";
import { channelType } from "../../types/channelType";
import User from "../../hooks/User";
import AddChannel from "./channelUtils/AddChannel";
import "../../styles/chat/channelBar.css";
import { ChanContextMenu } from "./channelUtils/ChanContextMenu";
import useClickListener from "../../hooks/useClickListener";
import PasswordDialog from "./channelUtils/PasswordDialog";
import SetPassword from "./channelUtils/SetPassword";
import { ModalContext } from "../../context/modalContext";
import ChanEntry from "./channelUtils/ChanEntry";

type ChannelProps = {
  channels: channelType[];
};

function Channel({ channels }: ChannelProps) {
  const [points, setPoints] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<channelType | null>(null);
  const socket = useContext(ChatContext);
  const { user } = useContext(User);
  const { setModal } = useContext(ModalContext);

  const handleClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    channel: channelType
  ) => {
    console.log(e.detail);
    if (e.detail === 2) {
      console.log("left click", channel);
      if (channel.type === "protected") {
        setModal({
          header: `Enter ${channel.name} password`,
          body: <PasswordDialog channel={channel} />,
        });
      } else socket.emit("joinChannel", { user, channel });
    }
  };

  useClickListener({ selected, setSelected });

  return (
    <>
      <ChanContextMenu
        channel={selected}
        setChannel={setSelected}
        points={points}
      />
      {channels &&
        channels.map((chan) => (
          <div
            className="chanEntries break-all"
            key={chan.id}
            onContextMenu={(e) => {
              e.preventDefault();
              console.log("right clicked", chan);
              setSelected(chan);
              setPoints({ x: e.pageX, y: e.pageY });
            }}
            onClick={(e) => handleClick(e, chan)}
          >
            <ChanEntry channel={chan} />
          </div>
        ))}
    </>
  );
}

type ChannelsProps = {
  privateChans: channelType[];
  publicChans: channelType[];
};

export default function Channels({ privateChans, publicChans }: ChannelsProps) {
  const { setModal } = useContext(ModalContext);

  return (
    <div className="channelAside">
      <div className="channelHeader">
        <h1> Channels </h1>
        <button
          className="customButton"
          id="chanAddButton"
          onClick={() =>
            setModal({
              header: "Add channel",
              body: <AddChannel />,
            })
          }
        >
          {" "}
          New{" "}
        </button>
      </div>

      <div className="channelBody max-h-[100vh - 60px]">
        <div className="channelCategory">
          <h2 className="chanType"> Private </h2>
          <Channel channels={privateChans} />
        </div>
        <div className="channelCategory">
          <h2 className="chanType"> Public </h2>
          <Channel
            channels={publicChans.filter((chan) => chan.type !== "protected")}
          />
        </div>
        <div className="channelCategory">
          <h2 className="chanType"> Protected </h2>
          <Channel
            channels={publicChans.filter((chan) => chan.type === "protected")}
          />
        </div>
      </div>
    </div>
  );
}
