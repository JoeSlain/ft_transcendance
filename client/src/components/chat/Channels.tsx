import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/socketContext";
import AddChannel from "./addChannel";
import { UserContext } from "../../context/userContext";
import PasswordDialog from "./passwordDialog";
import { ChanContextMenu, ChanEntry } from "./chanUtils";
import { channelType } from "../../types/channelType";

type ChannelProps = {
  channels: channelType[];
  selected: channelType;
};

function Channel({ channels, selected }: ChannelProps) {
  const [points, setPoints] = useState({ x: 0, y: 0 });
  const [contextChan, setContextChan] = useState<channelType | null>(null);
  const [protectedChan, setProtectedChan] = useState<channelType | null>(null);
  const socket = useContext(ChatContext);
  const user = useContext(UserContext);

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

  useEffect(() => {
    window.addEventListener("click", () => {
      setContextChan(null);
    });

    return () => {
      window.removeEventListener("click", () => {
        setContextChan(null);
      });
    };
  }, []);

  return (
    <div>
      <ChanContextMenu
        channel={contextChan}
        setChannel={setContextChan}
        points={points}
      />
      {channels &&
        channels.map((chan) => (
          <div
            key={chan.id}
            onContextMenu={(e) => {
              e.preventDefault();
              console.log("right clicked", chan);
              setContextChan(chan);
              setPoints({ x: e.pageX, y: e.pageY });
            }}
            onClick={(e) => handleClick(e, chan)}
          >
            <ChanEntry channel={chan} selected={selected} />
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
  selected: channelType;
};

export default function Channels({
  privateChans,
  publicChans,
  selected,
}: ChannelsProps) {
  const [showChanMenu, setShowChanMenu] = useState(false);

  return (
    <div className="aside">
      <h2> Channels </h2>
      <button onClick={() => setShowChanMenu(true)}> + </button>

      <h3 className="chanType"> Private </h3>
      <Channel channels={privateChans} selected={selected} />
      <h3 className="chanType"> Public </h3>
      <Channel channels={publicChans} selected={selected} />

      {showChanMenu && <AddChannel setShowChanMenu={setShowChanMenu} />}
    </div>
  );
}
