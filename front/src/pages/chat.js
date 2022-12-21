import { useContext, useEffect, useState } from "react";
import "../styles/chat.css";
import "../styles/channels.css";
import "../styles/messages.css";
import { ContextMenu } from "../styles/menus";
import { UserContext } from "../context/userContext";
import { ChanStyle } from "../styles/channels";

const ChanEntry = ({ channel, show, points, selected }) => {
  const handleDelete = () => {};

  return (
    <ChanStyle color={selected === channel ? "lightgrey" : "white"}>
      {channel.type === "private" && show && (
        <ContextMenu top={points.y} left={points.x}>
          <ul>
            <li onClick={handleDelete}> Delete </li>
          </ul>
        </ContextMenu>
      )}
      {channel.name}
    </ChanStyle>
  );
};

const Channels = ({ channel, selected, setSelected }) => {
  const [points, setPoints] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);

  useEffect(() => {
    window.addEventListener("click", () => {
      setShow(false);
    });

    return () => {
      window.removeEventListener("click", () => {
        setShow(false);
      });
    };
  }, []);

  return (
    <div>
      {channel &&
        channel.map((chan) => (
          <div
            key={chan.name}
            onContextMenu={(e) => {
              e.preventDefault();
              console.log(`${chan.name} clicked`);
              console.log("show in div", show);
              setShow(true);
              setPoints({ x: e.pageX, y: e.pageY });
            }}
            onClick={() => {
              setSelected(chan);
            }}
          >
            <ChanEntry
              channel={chan}
              show={show}
              points={points}
              selected={selected}
            />
          </div>
        ))}
    </div>
  );
};

const DirectMessages = ({ directMessages, selected, setSelected }) => {
  return (
    <div className="dmWrapper">
      {directMessages &&
        directMessages.map((dm) => (
          <div
            key={dm.name}
            className="dmEntry"
            onClick={() => {
              setSelected(dm);
            }}
          >
            {dm.name}
          </div>
        ))}
    </div>
  );
};

const ChatMessages = ({ messages }) => {
  let id = 0;
  const me = useContext(UserContext);

  return (
    <div className="chatMessages">
      {messages.map((message) => {
        if (message.from === me.username) {
          return (
            <div key={id++} className="messageWrapper">
              <div className="myUsername"> me</div>
              <div className="myMessage">
                <div className="content">{message.content}</div>
              </div>
            </div>
          );
        } else {
          return (
            <div key={id++} className="messageWrapper">
              <div className="theirUsername">{message.from}</div>
              <div className="theirMessage">
                <div className="content"> {message.content}</div>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

const Chat = ({ chat, setChat }) => {
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState(null);

  const submitMessage = (e) => {
    e.preventDefault();
  };

  return (
    <div className="chat">
      <div className="aside">
        <h2> CHANNELS </h2>
        <h3 className="chanType"> Private </h3>
        <Channels
          channel={chat.privateChans}
          selected={selected}
          setSelected={setSelected}
        />
        <h3 className="chanType"> Public </h3>
        <Channels
          channel={chat.publicChans}
          selected={selected}
          setSelected={setSelected}
        />
      </div>

      <div className="main-content">
        <DirectMessages
          directMessages={chat.directMessages}
          selected={selected}
          setSelected={setSelected}
        />
        <div className="chatBody">
          <h2>{selected ? selected.name : "CHAT"} </h2>
          {selected && selected.messages && (
            <ChatMessages messages={selected.messages} />
          )}
        </div>
        <div className="message">
          <form className="messageForm" onSubmit={submitMessage}>
            <input
              className="messageInput"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <button className="messageButton" type="submit">
              SEND
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
