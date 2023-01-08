import { useState } from "react";
import "../../styles/page.css";
import useChatEvents from "../../hooks/chatEvents/useChatEvents";

export default function Chat() {
  const [selected, setSelected] = useState(null);
  const [privateChans, setPrivateChans] = useState([]);
  const [publicChans, setPublicChans] = useState([]);
  const [directMessages, setDirectMessages] = useState([]);
  const [openTabs, setOpenTabs] = useState([]);

  useChatEvents(
    privateChans,
    publicChans,
    setPrivateChans,
    setPublicChans,
    setSelected
  );

  return (
    <div className="center">
      <Channels
        privateChans={privateChans}
        publicChans={publicChans}
        selected={selected}
      />
      <Users selected={selected} />

      <div className="chatMain">
        <DirectMessages
          directMessages={directMessages}
          selected={selected}
          setSelected={setSelected}
        />
        <div className="chatBody">
          <h2>{selected ? selected.name : "CHAT"} </h2>
          {selected && selected.messages && (
            <ChatMessages selected={selected} />
          )}
        </div>
        <MessageForm selected={selected} setSelected={setSelected} />
      </div>
    </div>
  );
}
