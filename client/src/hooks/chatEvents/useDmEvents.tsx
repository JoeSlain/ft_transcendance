import { useContext, useEffect } from "react";
import { ChatContext } from "../../context/socketContext";
import axios from "axios";
import { conversationType } from "../../types/directMessageType";
import User from "../User";
import { getSavedItem, saveItem } from "../../utils/storage";

type Props = {
  setConvs: (convs: any) => void;
};

export default function useDmEvents({ setConvs }: Props) {
  const socket = useContext(ChatContext);
  const { user } = useContext(User);

  useEffect(() => {
    axios
      .get("http://10.11.7.11:3001/api/chat/getNewMessages", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data) {
          let uniqueArray = [...response.data, ...getSavedItem("convs")].filter(
            (conversation, index, self) =>
              index ===
              self.findIndex(
                (t) => t.id === conversation.id));
          setConvs(uniqueArray);
          saveItem("convs", uniqueArray);

        }
      });

    socket.on("openConversation", (conv) => {
      setConvs((prev: conversationType[]) => {
        const index = prev.findIndex((p) => p.id === conv.id);
        if (index >= 0) {
          const copy = [...prev];
          copy[index] = conv;
          saveItem("convs", copy);
          return copy;
        }
        saveItem("convs", [...prev, conv]);
        return [...prev, conv];
      });
    });

    socket.on("newDm", (conv) => {
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
            saveItem("convs", copy);
            return copy;
          }
          const tmp = [
            ...prev,
            {
              id: conv.id,
              messages: conv.messages,
              to: conv.user1.id === user.id ? conv.user2 : conv.user1,
              show: true,
            },
          ];
          saveItem("convs", tmp);
          return tmp;
        }
      });
    });

    socket.on("updateConvs", (user) => {
      setConvs((prev: conversationType[]) => {
        if (prev) {
          const res = prev.map((p) => {
            if (p.to.id === user.id) {
              const newMessages = p.messages.map((m) => {
                if (m.from.id === user.id) return { ...m, from: user };
                return m;
              });
              return { ...p, to: user, messages: newMessages };
            }
            return p;
          });

          return res;
        }
      });
    });

    return () => {
      socket.off("openConversation");
      socket.off("newDm");
      socket.off("updateConvs");
    };
  }, []);
}
