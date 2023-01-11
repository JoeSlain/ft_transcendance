import { useContext, useEffect } from "react";
import { notifType } from "../../types/notifType";
import { ChatContext, GameContext } from "../../context/socketContext";
import axios from "axios";
import User from "../User";

export default function useNotifsEvent(setNotifs: (props: any) => void) {
  const chatSocket = useContext(ChatContext);
  const gameSocket = useContext(GameContext);
  const { user } = useContext(User);

  useEffect(() => {
    console.log("get notifs");
    // GET NOTIFS
    axios
      .get("http://localhost:3001/api/users/notifs", { withCredentials: true })
      .then((response) => {
        console.log("notifs", response.data);
        if (response.data) setNotifs(response.data);
      });

    // NOTIF EVENT
    chatSocket.on("notified", (notif) => {
      console.log("event notified", notif);
      setNotifs((prev: notifType[]) => [...prev, notif]);
    });

    // ACCEPT GAME INVITE EVENT
    chatSocket.on("acceptedInvite", (id) => {
      console.log("acceptedInvite", id);
      gameSocket.emit("joinRoom", { user, id });
    });

    return () => {
      chatSocket.off("notified");
      chatSocket.off("acceptedInvite");
    };
  }, []);
}
