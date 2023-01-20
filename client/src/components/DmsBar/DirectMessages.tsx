import "../../styles/chat/dms.css";
import React, { useState } from "react";

type Props = {
  content: string;
};

const MessageContent = ({ content }: Props) => {
  return <div className="dmContent">{content}</div>;
};

export default function DirectMessages() {
  const [show, setShow] = useState(false);
  const dms = [
    {
      from: "test1",
      content: "sup",
    },
    {
      from: "test2",
      content: "sup",
    },
  ];
  return (
    <div className="dms">
      {dms &&
        dms.map((dm) => (
          <div className="dmEntry" key={dm.from}>
            {show && <MessageContent content={dm.content} />}
            <div className="dmTitle" onClick={() => setShow(!show)}>
              {" "}
              {dm.from}{" "}
            </div>
          </div>
        ))}
    </div>
  );
}
