import { useState } from "react";
import useChatEvents from "../../hooks/chatEvents/useChatEvents";
import Channels from "./Channels";
import { channelType } from "../../types/channelType";
import ChanUsers from "./ChanUsers";
import MessageForm from "./MessageForm";
import "../../styles/chat/chat.css";
import ChatMessages from "./ChatMessages";

export default function Chat() {
  const [selected, setSelected] = useState<channelType | null>(null);
  const [privateChans, setPrivateChans] = useState([]);
  const [publicChans, setPublicChans] = useState([]);
  const [openTabs, setOpenTabs] = useState([]);

  useChatEvents({
    privateChans,
    publicChans,
    setPrivateChans,
    setPublicChans,
    setSelected,
  });

  return (
    <div className="center">
      <div className="chat">
        {selected ? (
          <ChanUsers selected={selected} setSelected={setSelected} />
        ) : (
          <Channels privateChans={privateChans} publicChans={publicChans} />
        )}
        <div className="chatMain">
          {/*<DirectMessages
          directMessages={directMessages}
          selected={selected}
          setSelected={setSelected}
        />*/}
          <div className="chatBody">
            <h2>{selected ? selected.name : "CHAT"} </h2>
            <ChatMessages selected={selected} />
          </div>
          <MessageForm selected={selected} />
        </div>
      </div>
    </div>
  );
}
