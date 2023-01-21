import User from "../../hooks/User";
import "../../styles/chat/dms.css";
import React, { useContext, useState } from "react";
import { directMessageType } from "../../types/directMessageType";

type Props = {
  dms: directMessageType[];
  setDms: (dms: any[]) => void;
};

const MessageForm = ({ dms, setDms }: Props) => {
  const [content, setContent] = useState("");
  const { user } = useContext(User);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    dms.push({
      from: user,
      content,
    });
    /*setDms(
      dms.concat({
        from: user,
        content,
      })
    );*/
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
        if (dm.from === user) {
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
              <div className="theirName"> {dm.from.username}</div>
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

export default function DirectMessages() {
  const [show, setShow] = useState<any | null>(null);
  const [dms, setDms] = useState([
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
  ]);

  const handleClick = (selected: any) => {
    console.log("selected", selected);
    console.log("show", show);
    if (show && show.from === selected.from) setShow(null);
    else setShow(selected);
  };

  return (
    <div className="dms">
      {dms &&
        dms.map((dm) => (
          <div className="dmEntry" key={dm.from}>
            {show && show.from === dm.from && (
              <MessageContent dms={show.messages} setDms={setDms} />
            )}
            <div className="dmTitle" onClick={() => handleClick(dm)}>
              {" "}
              {dm.from}{" "}
            </div>
          </div>
        ))}
    </div>
  );
}
