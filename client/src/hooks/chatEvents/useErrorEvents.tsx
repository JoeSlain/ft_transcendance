import { useContext, useEffect } from "react";
import { ChatContext, GameContext } from "../../context/socketContext";

export default function useErrorEvent() {
  const chatSocket = useContext(ChatContext);
  const gameSocket = useContext(GameContext);

  useEffect(() => {
    chatSocket.on("error", (error) => {
      alert(error);
    });
    gameSocket.on("error", (error) => {
      alert(error);
    });

    return () => {
      chatSocket.off("error");
      gameSocket.off("error");
    };
  }, []);
}
