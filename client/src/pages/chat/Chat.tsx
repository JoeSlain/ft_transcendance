import { createRef, useState } from "react";
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
  const chatContainer = createRef();


  useChatEvents({
    privateChans,
    publicChans,
    setPrivateChans,
    setPublicChans,
    setSelected,
  });

/*   function scrollToMyRef() {
    const scroll =
      chatContainer.current.scrollHeight -
      chatContainer.current.clientHeight;
    chatContainer.current.scrollTo(0, scroll);
  }; */

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
        <div className="chatMain heightMinusNav bg-base-300">
          <div className="drop-shadow-xl">
            <h2 className="font-retro mt-5 text-4xl">
              {selected ? selected.name : "CHAT"}{" "}
            </h2>
            <div className="bg-base-content/10 my-2 mx-1 h-px"></div>
          </div>
          {/*<DirectMessages
          directMessages={directMessages}
          selected={selected}
          setSelected={setSelected}
        />*/}
          <div  className="">
            <ChatMessages selected={selected} />
          </div>
          <div
            className="fixed
             inset-x-0
             bottom-0
             p-4"
          >
            <MessageForm selected={selected} />
          </div>
        </div>
      </div>
    </div>
  );
}
