import { useContext, useEffect, useState } from "react";
import "../styles/chat.css";
import "../styles/channels.css";
import "../styles/messages.css";
import { ContextMenu } from "../styles/menus";
import { UserContext } from "../context/userContext";
import { Channels, DirectMessages } from "../components/chat/channels";
import ChatMessages from "../components/chat/chatMessages";
import AddChannel from "../components/chat/addChannel";
import useChannels from "../hooks/channelHook";
import axios from "axios";
import { ChatContext } from "../context/socketContext";

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

const Users = ({ selected, setShowUsers }) => {
  console.log("selected", selected);
  console.log("users", selected.users);
  if (selected && selected.users) {
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

const Chat = () => {
  const [selected, setSelected] = useState(null);
  const [showUsers, setShowUsers] = useState(false);
  const [privateChans, setPrivateChans] = useState([]);
  const [publicChans, setPublicChans] = useState([]);
  const [directMessages, setDirectMessages] = useState([]);
  const [openTabs, setOpenTabs] = useState([]);
  const socket = useContext(ChatContext);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/chat/privateChannels", {
        withCredentials: true,
      })
      .then((response) => {
        console.log("privateChans", response.data);
        setPrivateChans(privateChans.concat(response.data));
      });
    axios
      .get("http://localhost:3001/api/chat/publicChannels", {
        withCredentials: true,
      })
      .then((response) => {
        console.log("publicChans", response.data);
        setPublicChans(publicChans.concat(response.data));
      });

    socket.on("newChannel", (channel) => {
      console.log("new chan");
      if (channel.type === "private")
        setPrivateChans((prev) => [...prev, channel]);
      else setPublicChans((prev) => [...prev, channel]);
    });

    socket.on("joinedChannel", (data) => {
      setSelected(data.channel);
    });

    return () => {
      socket.off("newChannel");
      socket.off("joinedChannel");
    };
  }, []);

  return (
    <div className="chat">
      {/*showChanMenu && <AddChannel setShowChanMenu={setShowChanMenu} />*/}

      <Channels
        privateChans={privateChans}
        publicChans={publicChans}
        selected={selected}
        setSelected={setSelected}
        setShowUsers={setShowUsers}
      />
      {showUsers && <Users selected={selected} setShowUsers={setShowUsers} />}

      <div className="chatMain">
        <DirectMessages
          directMessages={directMessages}
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
