import { useContext, useEffect } from "react";
import { ChatContext } from "../../context/socketContext";
import axios from "axios";
import { conversationType } from "../../types/directMessageType";
import userEvent from "@testing-library/user-event";
import User from "../User";

type Props = {
  setConvs: (convs: any) => void;
};

export default function useDmEvents({ setConvs }: Props) {
  const socket = useContext(ChatContext);
  const { user } = useContext(User);

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

    socket.on("newDm", (conv) => {
      console.log("new dm", conv);
      setConvs((prev: conversationType[]) => {
        if (prev) {
          const index = prev.findIndex((p) => p.id === conv.id);
          if (index >= 0) {
            const copy = [...prev];
            copy[index] = {
              ...copy[index],
              show: true,
              messages: conv.messages,
            };
            return copy;
          }
          return [
            ...prev,
            {
              id: conv.id,
              messages: conv.messages,
              to: conv.users[0].id === user.id ? conv.users[1] : conv.users[0],
              show: true,
            },
          ];
        }
      });
    });

    return () => {
      socket.off("openConversation");
      socket.off("newDm");
    };
  }, []);
}
