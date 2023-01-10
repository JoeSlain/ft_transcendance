import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/socketContext";
import { channelType } from "../../types/channelType";
import User from "../../hooks/User";
import AddChannel from "./channelUtils/AddChannel";
import "../../styles/chat/channelBar.css";
import { ChanContextMenu } from "./channelUtils/ChanContextMenu";
import useClickListener from "../../hooks/useClickListener";
import PasswordDialog from "./channelUtils/passwordDialog";
import { createShorthandPropertyAssignment } from "typescript";

type ChannelProps = {
  channels: channelType[];
};

function Channel({ channels }: ChannelProps) {
  const [points, setPoints] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<channelType | null>(null);
  const [protectedChan, setProtectedChan] = useState<channelType | null>(null);
  const socket = useContext(ChatContext);
  const { user } = useContext(User);

  const handleClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    channel: channelType
  ) => {
    console.log(e.detail);
    if (e.detail === 2) {
      console.log("left click", channel);
      if (channel.type === "protected") {
        setProtectedChan(channel);
      } else socket.emit("joinChannel", { user, channel });
    }
  };

  useClickListener({ selected, setSelected });

  return (
    <div className="chanEntries">
      <ChanContextMenu
        channel={selected}
        setChannel={setSelected}
        points={points}
      />
      {channels &&
        channels.map((chan) => (
          <div
            className="chanEntry"
            key={chan.id}
            onContextMenu={(e) => {
              e.preventDefault();
              console.log("right clicked", chan);
              setSelected(chan);
              setPoints({ x: e.pageX, y: e.pageY });
            }}
            onClick={(e) => handleClick(e, chan)}
          >
            {chan.name}
          </div>
        ))}
      {protectedChan && (
        <PasswordDialog
          channel={protectedChan}
          setProtectedChan={setProtectedChan}
        />
      )}
    </div>
  );
}

type ChannelsProps = {
  privateChans: channelType[];
  publicChans: channelType[];
};

export default function Channels({ privateChans, publicChans }: ChannelsProps) {
  const [showChanMenu, setShowChanMenu] = useState(false);

  return (
    <div className="channelAside">
      <div className="channelHeader">
        <h1> Channels </h1>
        <button
          className="customButton"
          id="chanAddButton"
          onClick={() => setShowChanMenu(true)}
        >
          {" "}
          +{" "}
        </button>
      </div>

      <div className="channelBody">
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

      {showChanMenu && <AddChannel setShowChanMenu={setShowChanMenu} />}
    </div>
  );
}
