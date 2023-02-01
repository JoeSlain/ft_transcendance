import { useContext, useState } from "react";
import { ChatContext } from "../../context/socketContext";
import User from "../../hooks/User";
import { channelType } from "../../types/channelType";
import "../../styles/chat/chat.css";

type Props = {
  selected: channelType | null;
};

export default function MessageForm({ selected }: Props) {
  const [message, setMessage] = useState("");
  const { user } = useContext(User);
  const socket = useContext(ChatContext);

  const submitMessage = () => {
    if (message === "") return;
    const newMessage = { from: user, content: message, channel: selected };
    setMessage("");
    // scrollToMyRef();
    console.log("emitting new message");
    socket.emit("chanMessage", newMessage);
  };

  function handleKeyDown(e: any) {
    if (e.key === "Enter") {
      submitMessage();
      setMessage("");
    }
  }

  if (selected) {
    return (
      <div className="messageForm">
        <textarea
          className="textarea max-h-24 text-black messageForm"
          value={message}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            if (e.target.value === "\n") return;
            setMessage(e.target.value);
          }}
        />
        <button
          className="btn btn-sm md:btn-md gap-2 normal-case lg:gap-3 ml-2"
          onClick={submitMessage}
        >
          SEND
        </button>
      </div>
    );
  }
  return <></>;
}
