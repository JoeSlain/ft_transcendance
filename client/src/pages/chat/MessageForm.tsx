import { useContext, useState } from "react";
import { ChatContext } from "../../context/socketContext";
import User from "../../hooks/User";
import { channelType } from "../../types/channelType";

type Props = {
  selected: channelType | null;
};

export default function MessageForm({ selected }: Props) {
  const [message, setMessage] = useState("");
  const { user } = useContext(User);
  const socket = useContext(ChatContext);

  const submitMessage = () => {
    const newMessage = { from: user, content: message, channel: selected };
    setMessage("");
    socket.emit("chanMessage", newMessage);
  };

  if (selected) {
    return (
      <div className="message">
        <div className="messageForm">
          <textarea
            className="messageInput"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <button className="messageButton" onClick={submitMessage}>
            SEND
          </button>
        </div>
      </div>
    );
  }
  return <></>;
}
