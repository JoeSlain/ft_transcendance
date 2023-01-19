import { useContext, useEffect, useRef, useState } from "react";
import User from "../../hooks/User";
import { channelType } from "../../types/channelType";
import "../../styles/chat/chatMessages.css";

type Props = {
  selected: channelType | null;
};

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}


const ChatMessages = ({ selected }: Props) => {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  const [linebreak, setLineBreak] = useState(90);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useContext(User);

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (windowDimensions.width <= 1200)
      setLineBreak(10);
    else
      setLineBreak(100);  
  }, [windowDimensions]);

  //console.log("win dimensions: ", windowDimensions);
  useEffect(() => {
    if (messagesEndRef && messagesEndRef.current) {
      let lastChild = messagesEndRef.current.lastElementChild;
      console.log("USERFFECT");
      if (selected?.messages)
        lastChild?.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
    }
  }, [selected?.messages]);

  if (selected && selected.messages) {
    const messages = selected.messages;
    return (
      <div
        ref={messagesEndRef}
        className="chatMessages mx-2 max-h-[400px] sm:max-h-[700px] overflow-y-auto rounded-md bg-base-200"
      >
        {messages.map((message, index) => {
          console.log("message", message);
          if (!message.from) {
            return (
              <div
                key={index}
                className="pr-5 chat chat-end justify-end flex flex-col"
              >
                <div className="chat-header mr-1">Server</div>
                <div className="chat-bubble">{message.content}</div>
              </div>
            );
          } else if (message.from.id === user.id) {
            return (
              <div
                key={index}
                className="pr-5 chat chat-end justify-end flex flex-col"
              >
                <div className="chat-header mr-1">{message.from.username}</div>
                <div className="bubbleOverflow chat-bubble max-w-[90%] ">
                  {message.content}
                </div>
              </div>
              /*               <div key={message.id} className="messageWrapper">
                <div className="myUsername"> me</div>
                <div className="myMessage">
                  <div className="content">{message.content}</div>
                </div>
              </div> */
            );
          } else {
            return (
              <div key={index} className="pl-5 chat chat-start flex flex-col">
                <div className="chat-header ml-1">{message.from.username}</div>

                <div className="bubbleOverflow chat-bubble chat-bubble-primary max-w-[90%]">
                  {message.content}
                </div>
              </div>
              /*               <div key={message.id} className="messageWrapper">
                <div className="theirUsername">{message.from.username}</div>
                <div className="theirMessage">
                  <div className="content"> {message.content}</div>
                </div>
              </div> */
            );
          }
        })}
      </div>
    );
  }
  return <></>;
};

export default ChatMessages;
