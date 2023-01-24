import { useContext, useEffect, useRef, useState } from "react";
import User from "../../hooks/User";
import { channelType } from "../../types/channelType";
import "../../styles/chat/chatMessages.css";
import { ChanUserContextList } from "./channelUtils/ChanUserContextList";
import { userType } from "../../types/userType";
import { ContextMenu } from "../../styles/menus";
import useClickListener from "../../hooks/useClickListener";

type Props = {
  selected: channelType | null;
};

const ChatMessages = ({ selected }: Props) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useContext(User);
  const [selectedUser, setSelectedUser] = useState<userType | null>(null);
  const [point, setPoint] = useState({ x: 0, y: 0 });

  useClickListener({ selected: selectedUser, setSelected: setSelectedUser });

  //console.log("win dimensions: ", windowDimensions);
  useEffect(() => {
    if (messagesEndRef && messagesEndRef.current) {
      let lastChild = messagesEndRef.current.lastElementChild;
      if (selected?.messages)
        lastChild?.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
    }
  }, [selected?.messages]);

  if (selected && selected.messages) {
    const messages = selected.messages;
    return (
      <div
        ref={messagesEndRef}
        className="chatMessages mx-2 max-h-[400px] sm:max-h-[700px] overflow-y-auto rounded-md bg-base-200"
      >
        {messages.map((message, index) => {
          //console.log("message", message);
          if (!message.from) {
            return (
              <div
                key={index}
                className="pr-5 chat chat-end justify-end flex flex-col"
              >
                <div className="chat-header mr-1">Server</div>
                <div className="chat-bubble">{message.content}</div>
              </div>
            );
          } else if (message.from.id === user.id) {
            return (
              <div
                key={index}
                className="pr-5 chat chat-end justify-end flex flex-col"
              >
                <div className="chat-header mr-1">{message.from.username}</div>
                <div className="bubbleOverflow chat-bubble max-w-[90%] ">
                  {message.content}
                </div>
              </div>
              /*               <div key={message.id} className="messageWrapper">
                <div className="myUsername"> me</div>
                <div className="myMessage">
                  <div className="content">{message.content}</div>
                </div>
              </div> */
            );
          } else {
            return (
              <div key={index} className="pl-5 chat chat-start flex flex-col">
                <div
                  className="chat-header ml-1"
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setPoint({ x: e.pageX, y: e.pageY });
                    setSelectedUser(message.from);
                  }}
                >
                  {message.from.username}
                </div>

                <div className="bubbleOverflow chat-bubble chat-bubble-primary max-w-[90%]">
                  {message.content}
                </div>
                {selectedUser && (
                  <ContextMenu top={point.y} left={point.x}>
                    <ChanUserContextList
                      selectedUser={selectedUser}
                      channel={selected}
                    />
                  </ContextMenu>
                )}
              </div>
              /*               <div key={message.id} className="messageWrapper">
                <div className="theirUsername">{message.from.username}</div>
                <div className="theirMessage">
                  <div className="content"> {message.content}</div>
                </div>
              </div> */
            );
          }
        })}
      </div>
    );
  }
  return <></>;
};

export default ChatMessages;
