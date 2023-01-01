import { useContext } from "react";
import { UserContext } from "../../context/userContext";

const ChatMessages = ({ selected }) => {
  const me = useContext(UserContext);
  const messages = selected.messages;
  console.log("selected", selected);

  return (
    <div className="chatMessages">
      {messages.map((message) => {
        console.log("message", message);
        if (message.from.id === me.id) {
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
};

export default ChatMessages;
