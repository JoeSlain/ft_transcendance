import User from "../../hooks/User";
import "../../styles/chat/dms.css";
import React, { useContext, useState } from "react";
import { conversationType } from "../../types/directMessageType";
import useDmEvents from "../../hooks/chatEvents/useDmEvents";
import { ChatContext } from "../../context/socketContext";
import { userType } from "../../types/userType";
import { ContextMenu } from "../../styles/menus";
import { CommonContext } from "../contextMenus/commonContext";
import useClickListener from "../../hooks/useClickListener";

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
        className="dmForm"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </form>
  );
};

const MessageContent = ({ conv }: Props) => {
  const { user } = useContext(User);
  const messages = conv.messages;
  const [selectedUser, setSelectedUser] = useState<userType | null>(null);
  const [point, setPoint] = useState({ x: 0, y: 0 });

  useClickListener({
    selected: selectedUser,
    setSelected: setSelectedUser,
  });

  return (
    <div className="dmContent">
      <div className="dmMessages">
        {messages &&
          messages.map((msg, i) => {
            if (msg.from.id === user.id) {
              return (
                <div className="myDm" key={i}>
                  <div className="myName"> me</div>
                  <div className="myMessage">
                    <div className="content">{msg.content}</div>
                  </div>
                </div>
              );
            } else {
              return (
                <div className="theirDm" key={i}>
                  <div
                    className="theirName"
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setSelectedUser(msg.from);
                      setPoint({ x: e.pageX, y: e.pageY });
                    }}
                  >
                    {" "}
                    {msg.from.username}
                  </div>
                  <div className="theirMessage">
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
      <MessageForm conv={conv} />
    </div>
  );
};

export default function DirectMessages() {
  const [convs, setConvs] = useState<conversationType[]>([]);

  useDmEvents({ setConvs });

  const handleClick = (index: number) => {
    const copy = [...convs];
    copy[index].show = !copy[index].show;
    setConvs(copy);
  };

  const handleClose = (conv: conversationType) => {
    setConvs((prev: any) => {
      return prev.filter((p: any) => p.id !== conv.id);
    });
  };

  return (
    <div className="dms">
      {convs &&
        convs.map((conv, index) => {
          return (
            <div className="dmEntry" key={index}>
              {conv.show && <MessageContent conv={conv} />}
              <div className="dmToggle" onClick={() => handleClick(index)}>
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
            </div>
          );
        })}
    </div>
  );
}
