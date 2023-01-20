import User from "../../hooks/User";
import "../../styles/chat/dms.css";
import React, { useContext, useEffect, useState } from "react";
import { directMessageType } from "../../types/directMessageType";
import axios from "axios";

type Props = {
  dms: directMessageType[];
  setDms: (dms: any[]) => void;
};

const MessageForm = ({ dms, setDms }: Props) => {
  const [content, setContent] = useState("");
  const { user } = useContext(User);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    setDms(
      dms.concat({
        from: user.username,
        content,
      })
    );
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

const MessageContent = ({ dms, setDms }: Props) => {
  const { user } = useContext(User);

  return (
    <div className="dmContent">
      {dms.map((dm, index) => {
        if (dm.from === user.username) {
          return (
            <div className="myDm" key={index}>
              <div className="myName"> me</div>
              <div className="myMessage">
                <div className="content">{dm.content}</div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="theirDm" key={index}>
              <div className="theirName"> {dm.from}</div>
              <div className="theirMessage">
                <div className="content">{dm.content}</div>
              </div>
            </div>
          );
        }
      })}
      <MessageForm dms={dms} setDms={setDms} />
    </div>
  );
};

const MessageEntry = () => {}

export default function DirectMessages() {
  const [show, setShow] = useState('');
  const [dms, setDms] = useState(new Map<string, directMessageType[]>());
  const { user } = useContext(User);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/chat/messages", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data) {
          const map = new Map();

          response.data.forEach((msg: directMessageType) => {
            const otherUser =
              msg.from.username === user.username ? msg.to.username : msg.from.username;
            if (map.has(otherUser)) {
              map.get(otherUser).push(msg);
            } else {
              map.set(otherUser, [msg]);
            }
          });
          setDms(map);
        }
      });
  }, []);
  /*const [dms, setDms] = useState([
    {
      from: "test2",
      messages: [
        { from: "test2", content: "sup" },
        { from: "test1", content: "sup" },
        { from: "test1", content: "sup" },
        { from: "test1", content: "sup" },
        { from: "test2", content: "sup" },
      ],
    },
    {
      from: "test3",
      messages: [
        { from: "test3", content: "sup" },
        { from: "test1", content: "sup" },
        { from: "test3", content: "sup" },
        { from: "test1", content: "sup" },
        { from: "test3", content: "sup" },
      ],
    },
  ]);*/

  const handleClick = (key: string) => {
    console.log("show", show);
    if (show && show === key) setShow('');
    else setShow(key);
  };

  return (
    <div className="dms">
      {dms &&
        Array.from(dms).map((dm, index) => 
          <div className='dmEntry' key={index}>
            {show && show === key && 
            <MessageContent dms={value} setDms={setDms} /> }
            <div className="dmTitle" onClick={() => handleClick(key)}>
              {key}
            </div>
          </div>
        })
      }

    </div>
  );
}
