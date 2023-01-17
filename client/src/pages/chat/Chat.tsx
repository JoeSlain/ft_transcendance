import { createRef, useRef, useState } from "react";
import useChatEvents from "../../hooks/chatEvents/useChatEvents";
import Channels from "./Channels";
import { channelType } from "../../types/channelType";
import ChanUsers from "./channelUtils/ChanUsers";
import MessageForm from "./MessageForm";
import "../../styles/chat/chat.css";
import ChatMessages from "./ChatMessages";

export default function Chat() {
  const [selected, setSelected] = useState<channelType | null>(null);
  const [privateChans, setPrivateChans] = useState([]);
  const [publicChans, setPublicChans] = useState([]);
  const [openTabs, setOpenTabs] = useState([]);

  //    ^?

  useChatEvents({
    privateChans,
    publicChans,
    setPrivateChans,
    setPublicChans,
    setSelected,
  });

  return (
    <div className="flex ">
      <div className="heightMinusNav">
        {selected ? (
          <ChanUsers selected={selected} setSelected={setSelected} />
        ) : (
          <Channels privateChans={privateChans} publicChans={publicChans} />
        )}
      </div>
      <div className="wholechat flex flex-col justify-center flex-grow ">
        <div className="chatMain  heightMinusNav bg-base-300">
          <div className="drop-shadow-xl">
            <h2 className="font-retro mt-5 text-4xl">
              {selected ? selected.name : "CHAT"}{" "}
            </h2>
            <div className="bg-base-content/10  mx-2 h-px"></div>
          </div>
          {/*<DirectMessages
          directMessages={directMessages}
          selected={selected}
          setSelected={setSelected}
        />*/}
          <div className="">
            <ChatMessages selected={selected} />
          </div>
          <div
            className="
            flex
            justify center
            fixed
             bottom-0
             p-4
             max-w-[50%]
             sm:max-w-[70%]"
          >
            <MessageForm selected={selected} />
          </div>
        </div>
      </div>
    </div>
  );
}
