import { useContext, useEffect, useState } from "react";
import "../styles/chat.css";
import "../styles/channels.css";
import "../styles/messages.css";
import { ContextMenu } from "../styles/menus";
import { UserContext } from "../context/userContext";
import { Channel, DirectMessages } from "../components/channels";
import ChatMessages from "../components/chatMessages";
import AddChannel from "../components/addChannel";

const MessageForm = ({ selected, setSelected }) => {
  const [message, setMessage] = useState("");
  const user = useContext(UserContext);

  const submitMessage = (e) => {
    e.preventDefault();
    const newMessages = selected.messages;
    newMessages.push({ from: user.username, content: message });
    setSelected({ ...selected, messages: newMessages });
    setMessage("");
  };

  if (selected) {
    return (
      <div className="message">
        <form className="messageForm" onSubmit={submitMessage}>
          <textarea
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
    );
  }
};

const Channels = ({
  chat,
  selected,
  setSelected,
  setShowChanMenu,
  setShowUsers,
}) => {
  return (
    <div className="aside">
      <h2> Channels </h2>
      <button onClick={() => setShowChanMenu(true)}> + </button>
      <h3 className="chanType"> Private </h3>
      <Channel
        channel={chat.privateChans}
        selected={selected}
        setSelected={setSelected}
        setShowUsers={setShowUsers}
      />
      <h3 className="chanType"> Public </h3>
      <Channel
        channel={chat.publicChans}
        selected={selected}
        setSelected={setSelected}
        setShowUsers={setShowUsers}
      />
    </div>
  );
};

const Users = ({ selected, setShowUsers }) => {
  if (selected.users) {
    return (
      <div className="chanUsers">
        <h2>Users</h2>
        {selected.users.map((user) => (
          <div className="userEntry" key={user.username}>
            {user.username}
          </div>
        ))}
      </div>
    );
  }
};

const Chat = ({ chat, setChat, setShowChanMenu }) => {
  const [selected, setSelected] = useState(null);
  const [showUsers, setShowUsers] = useState(false);

  return (
    <div className="chat">
      <Channels
        chat={chat}
        selected={selected}
        setSelected={setSelected}
        setShowUsers={setShowUsers}
        setShowChanMenu={setShowChanMenu}
      />
      {showUsers && <Users selected={selected} setShowUsers={setShowUsers} />}

      <div className="chatMain">
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
        <MessageForm selected={selected} setSelected={setSelected} />
      </div>
    </div>
  );
};

export default Chat;
