import User from "../../hooks/User";
import React, { useContext, useEffect, useRef, useState } from "react";
import { conversationType } from "../../types/directMessageType";
import useDmEvents from "../../hooks/chatEvents/useDmEvents";
import { ChatContext } from "../../context/socketContext";
import { userType } from "../../types/userType";
import { ContextMenu } from "../../styles/menus";
import { CommonContext } from "../contextMenus/commonContext";
import useClickListener from "../../hooks/useClickListener";
import "../../styles/chat/dms.css";
import { getSavedItem, saveItem } from "../../utils/storage";

type Props = {
  conv: conversationType;
};

const MessageForm = ({ conv }: Props) => {
  const [content, setContent] = useState("");
  const { user } = useContext(User);
  const socket = useContext(ChatContext);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    socket.emit("directMessage", {
      convId: conv.id,
      to: conv.to,
      user,
      content,
    });
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="dmForm ml-2 max-w-[90%]"
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </form>
  );
};

const MessageContent = ({ conv }: Props) => {
  const { user } = useContext(User);
  const messages = conv.messages;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedUser, setSelectedUser] = useState<userType | null>(null);
  const [point, setPoint] = useState({ x: 0, y: 0 });

  useClickListener({
    selected: selectedUser,
    setSelected: setSelectedUser,
  });

  useEffect(() => {
    if (messagesEndRef && messagesEndRef.current) {
      let lastChild = messagesEndRef.current.lastElementChild;
      if (messages)
        lastChild?.scrollIntoView({
          behavior: "auto",
          block: "end",
          inline: "nearest",
        });
    }
  }, [messages]);

  return (
    <div className="pb-2 dmContent bg-base-200">
      <div
        className="mb-2 dmMessages scrollbar scrollbar-thumb-gray-900 scrollbar-track-gray-100 overflow-y-scroll"
        ref={messagesEndRef}
      >
        {messages &&
          messages.map((msg, i) => {
            if (msg.from.id === user.id) {
              return (
                <div className="chat chat-end mx-3 flex flex-col" key={i}>
                  <div className="chat-header"> me</div>
                  <div className="chat-bubble bubbleOverflow">
                    {msg.content}
                  </div>
                </div>
              );
            } else {
              return (
                <div className="chat chat-start flex flex-col mx-3" key={i}>
                  <div
                    className="chat-header"
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setSelectedUser(msg.from);
                      setPoint({ x: e.pageX, y: e.pageY });
                    }}
                  >
                    {msg.from.username}
                  </div>
                  <div className="chat-bubble chat-bubble-primary bubbleOverflow">
                    <div className="content">{msg.content}</div>
                  </div>
                  {selectedUser && (
                    <ContextMenu top={point.y} left={point.x}>
                      <CommonContext selected={selectedUser} />
                    </ContextMenu>
                  )}
                </div>
              );
            }
          })}
      </div>
      <div className="align-self-center">
        <MessageForm conv={conv} />
      </div>
    </div>
  );
};

export default function DirectMessages() {
  const socket = useContext(ChatContext);
  const [convs, setConvs] = useState(getSavedItem("convs"));
  const { user } = useContext(User);
  if (convs === null) {
    saveItem("convs", []);
    setConvs([]);
  }

  useDmEvents({ setConvs });

  const handleClick = (index: number) => {
    const copy = [...convs];
    copy[index].show = !copy[index].show;
    saveItem("convs", copy);
    socket.emit("updateNewMessages", {
      convId: copy[index].id,
      userId: user.id,
    });
    setConvs(copy);
  };

  const handleClose = (conv: conversationType) => {
    setConvs((prev: any) => {
      const res = prev.filter((p: any) => p.id !== conv.id);
      saveItem("convs", res);
      return res;
    });
  };

  return (
    <div
      className="flex flex-wrap ml-2"
      style={{ position: "fixed", bottom: 0 }}
    >
      {convs &&
        convs.map((conv: any, index: any) => {
          return (
            <div className={`dmEntry flex flex-col self-end `} key={index}>
              <div
                className={`dmToggle bg-primary h-[4vh] ${
                  !conv.show ? "fixed bottom-0" : ""
                }`}
                onClick={() => handleClick(index)}
              >
                <div className="dmName">{conv.to.username} </div>
                <button
                  className="dmClose"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose(conv);
                  }}
                >
                  {" "}
                  x{" "}
                </button>
              </div>
              {conv.show && <MessageContent conv={conv} />}
            </div>
          );
        })}
    </div>
  );
}
