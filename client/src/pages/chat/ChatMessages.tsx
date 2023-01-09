import { useContext } from "react";
import User from "../../hooks/User";
import { channelType } from "../../types/channelType";
import "../../styles/chat/chatMessages.css";

type Props = {
  selected: channelType | null;
};

const ChatMessages = ({ selected }: Props) => {
  const { user } = useContext(User);

  if (selected && selected.messages) {
    const messages = selected.messages;
    return (
      <div className="chatMessages">
        {messages.map((message) => {
          console.log("message", message);
          if (message.from.id === user.id) {
            return (
              <div key={message.id} className="messageWrapper">
                <div className="myUsername"> me</div>
                <div className="myMessage">
                  <div className="content">{message.content}</div>
                </div>
              </div>
            );
          } else {
            return (
              <div key={message.id} className="messageWrapper">
                <div className="theirUsername">{message.from.username}</div>
                <div className="theirMessage">
                  <div className="content"> {message.content}</div>
                </div>
              </div>
            );
          }
        })}
      </div>
    );
  }
  return <></>;
};

export default ChatMessages;
