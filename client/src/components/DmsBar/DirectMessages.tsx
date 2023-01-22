import User from "../../hooks/User";
import "../../styles/chat/dms.css";
import React, { useContext, useEffect, useState } from "react";
import {
  conversationType,
  directMessageType,
} from "../../types/directMessageType";
import axios from "axios";
import useDmEvents from "../../hooks/chatEvents/useDmEvents";

type Props = {
  index: number;
  convs: conversationType[];
  setConvs: (dms: conversationType[]) => void;
};

const MessageForm = ({ index, convs, setConvs }: Props) => {
  const [content, setContent] = useState("");
  const { user } = useContext(User);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const copy = [...convs];
    const messages = copy[index].messages;
    messages.push({
      from: user,
      content,
    });
    setConvs(copy);
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

const MessageContent = ({ index, convs, setConvs }: Props) => {
  const { user } = useContext(User);
  const messages = [...convs[index].messages];

  return (
    <div className="dmContent">
      <div className="dmMessages">
        {messages.map((msg, i) => {
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
      <MessageForm index={index} convs={convs} setConvs={setConvs} />
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
              {conv.show && (
                <MessageContent
                  index={index}
                  convs={convs}
                  setConvs={setConvs}
                />
              )}
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
