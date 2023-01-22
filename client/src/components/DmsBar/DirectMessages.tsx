import User from "../../hooks/User";
import "../../styles/chat/dms.css";
import React, { useContext, useEffect, useState } from "react";
import {
  conversationType,
  directMessageType,
} from "../../types/directMessageType";
import axios from "axios";
import useDmEvents from "../../hooks/chatEvents/useDmEvents";
import { ChatContext } from "../../context/socketContext";

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
                  <div className="theirName"> {msg.from.username}</div>
                  <div className="theirMessage">
                    <div className="content">{msg.content}</div>
                  </div>
                </div>
              );
            }
          })}
      </div>
      <MessageForm conv={conv} />
    </div>
  );
};

const MessageEntry = () => {};

export default function DirectMessages() {
  const [show, setShow] = useState("");
  const { user } = useContext(User);
  const [convs, setConvs] = useState<conversationType[]>([]);

  useDmEvents({ setConvs });
  /*const [convs, setConvs] = useState([
    {
      to: "test2",
      messages: [
        { from: "dchheang", content: "sup" },
        { from: "test1", content: "sup" },
        { from: "test1", content: "sup" },
        { from: "test1", content: "sup" },
        { from: "dchheang", content: "sup" },
      ],
      show: true,
    },
    {
      to: "test3",
      messages: [
        { from: "dchheang", content: "sup" },
        { from: "test1", content: "sup" },
        { from: "dchheang", content: "sup" },
        { from: "test1", content: "sup" },
        { from: "dchheang", content: "sup" },
      ],
      show: true,
    },
  ]);*/

  const handleClick = (index: number) => {
    const copy = [...convs];
    copy[index].show = !copy[index].show;
    setConvs(copy);
  };

  return (
    <div className="dms">
      {convs &&
        convs.map((conv, index) => {
          console.log("conv", conv);
          return (
            <div className="dmEntry" key={index}>
              {conv.show && <MessageContent conv={conv} />}
              <div className="dmTitle" onClick={() => handleClick(index)}>
                {conv.to.username}
              </div>
            </div>
          );
        })}
      {/*Array.from(dms).map((dm, index) => 
          <div className='dmEntry' key={index}>
            {show && show === key && 
            <MessageContent dms={value} setDms={setDms} /> }
            <div className="dmTitle" onClick={() => handleClick(key)}>
              {key}
            </div>
          </div>
        })*/}
    </div>
  );
}
