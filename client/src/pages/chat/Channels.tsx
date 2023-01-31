import { useContext, useState } from "react";
import { ChatContext } from "../../context/socketContext";
import { channelType } from "../../types/channelType";
import User from "../../hooks/User";
import AddChannel from "./channelUtils/AddChannel";
import "../../styles/chat/channelBar.css";
import { ChanContextMenu } from "./channelUtils/ChanContextMenu";
import useClickListener from "../../hooks/useClickListener";
import PasswordDialog from "./channelUtils/PasswordDialog";
import { ModalContext } from "../../context/modalContext";
import ChanEntry from "./channelUtils/ChanEntry";

type ChannelProps = {
  channels: channelType[];
};

type FilterProps = {
  owned: boolean;
  setOwned: (owned: boolean) => void;
  setFilter: (filter: string) => void;
};

const Filter = ({ owned, setOwned, setFilter }: FilterProps) => {
  return (
    <div className="chanFilter">
      <div className="filterOwned">
        Show owned
        <input
          className="channelCheckBox"
          type="checkbox"
          onChange={() => setOwned(!owned)}
        />
      </div>
      <div className="filterName">
        <input
          className="input w-full max-w-xs bg-base-200"
          type="text"
          placeholder="Search channel"
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
    </div>
  );
};

function Channel({ channels }: ChannelProps) {
  const [points, setPoints] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState<channelType | null>(null);
  const [owned, setOwned] = useState(false);
  const [filter, setFilter] = useState("");
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

  const getFilter = () => {
    let ret = channels;
    if (owned)
      ret = ret.filter((chan) => chan.owner && chan.owner.id === user.id);
    if (filter) return ret.filter((chan) => chan.name.includes(filter));
    return ret;
  };

  const chans = getFilter();
  useClickListener({ selected, setSelected });

  return (
    <>
      <Filter owned={owned} setOwned={setOwned} setFilter={setFilter} />
      <ChanContextMenu
        channel={selected}
        setChannel={setSelected}
        points={points}
      />
      {chans &&
        chans.map((chan) => (
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

      <div className="channelBody max-h-[100vh - 60px] scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-100 scrollbar-w-10 overflow-y-scroll">
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
