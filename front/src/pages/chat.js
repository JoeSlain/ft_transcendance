import { useContext, useEffect, useState } from "react";
import "../styles/chat.css";
import "../styles/channels.css";
import "../styles/messages.css";
import { UserContext } from "../context/userContext";
import { Channels, DirectMessages } from "../components/chat/channels";
import ChatMessages from "../components/chat/chatMessages";
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

const Users = ({ selected }) => {
  const socket = useContext(ChatContext);
  const user = useContext(UserContext);
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .get(`http://localhost:3001/api/users/username/${name}`, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data) {
          console.log("sending chan", selected);
          socket.emit("chanInvite", {
            type: "Chan Invite",
            from: user,
            to: response.data,
            channel: selected,
          });
        } else alert("user not found");
      });
    setName("");
  };

  if (selected && selected.users) {
    return (
      <div className="chanUsers">
        <h2>Users</h2>
        <form onSubmit={handleSubmit}>
          <div className="form">
            <div className="formInput">
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <button type="submit"> + </button>
          </div>
        </form>
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

  const updateChannel = (newChan) => {
    console.log("channel in updateChan", newChan);
    if (newChan.type === "private") {
      setPrivateChans((prev) =>
        prev.map((chan) => {
          if (chan.id === newChan.id) {
            console.log("updating private");
            return newChan;
          }
          return chan;
        })
      );
    } else {
      console.log("updating public");
      setPublicChans((prev) =>
        prev.map((chan) => {
          if (chan.id === newChan.id) return newChan;
          return chan;
        })
      );
    }
    setSelected((prev) => {
      if (prev && prev.id === newChan.id) {
        console.log("update selected");
        return newChan;
      }
      return prev;
    });
  };

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
      console.log("new chan", channel);
      if (channel.type === "private")
        setPrivateChans((prev) => [...prev, channel]);
      else setPublicChans((prev) => [...prev, channel]);
    });

    socket.on("joinedChannel", (data) => {
      console.log("joined channel", data.channel);
      updateChannel(data.channel);
      setSelected(data.channel);
      setShowUsers(true);
    });

    socket.on("removeChannel", (channel) => {
      console.log("removeChan", channel);
      if (channel.type === "private")
        setPrivateChans((prev) =>
          prev.filter((chan) => chan.id !== channel.id)
        );
      else
        setPublicChans((prev) => prev.filter((chan) => chan.id !== channel.id));
      setSelected((prev) => {
        if (prev && prev.id === channel.id) return null;
        return prev;
      });
    });

    socket.on("leftChannel", (channel) => {
      console.log(`client left ${channel.name}`);
      console.log("channel in event", channel);
      updateChannel(channel);
    });

    return () => {
      socket.off("newChannel");
      socket.off("joinedChannel");
      socket.off("removeChannel");
      socket.off("leftChannel");
    };
  }, []);

  return (
    <div className="chat">
      {/*showChanMenu && <AddChannel setShowChanMenu={setShowChanMenu} />*/}

      <Channels
        privateChans={privateChans}
        publicChans={publicChans}
        selected={selected}
      />
      <Users selected={selected} />

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
