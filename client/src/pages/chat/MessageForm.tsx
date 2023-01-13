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
    if (message === "")
      return ;
    const newMessage = { from: user, content: message, channel: selected };
    setMessage("");
    socket.emit("chanMessage", newMessage);
  };

function handleKeyDown (e : any) {
  console.log("keyyy");
  if (e.key === 'Enter')
  {
    submitMessage();
    setMessage("");
  }
}

  if (selected) {
    return (
      <div className="message">
        <div className="messageForm">
          <textarea
            className="textarea "
            value={message}
            onKeyDown={handleKeyDown}
            onChange={(e) => {
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
      </div>
    );
  }
  return <></>;
}
