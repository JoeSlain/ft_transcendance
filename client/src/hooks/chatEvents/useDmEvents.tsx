import { useContext, useEffect } from "react";
import { ChatContext } from "../../context/socketContext";
import axios from "axios";
import { conversationType } from "../../types/directMessageType";

type Props = {
  setConvs: (convs: any) => void;
};

export default function useDmEvents({ setConvs }: Props) {
  const socket = useContext(ChatContext);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/chat/getNewMessages", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data) {
          console.log("convs", response.data);
          setConvs(response.data);
        }
      });

    socket.on("openConversation", (conv) => {
      console.log("open conv", conv);
      setConvs((prev: conversationType[]) => [...prev, conv]);
    });

    return () => {
      socket.off("openConversation");
    };
  }, []);
}
