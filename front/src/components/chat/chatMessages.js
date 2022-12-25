import { useContext } from "react";
import { UserContext } from "../../context/userContext";

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

export default ChatMessages;
