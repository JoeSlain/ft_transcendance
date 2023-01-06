import { useContext, useEffect } from "react";
import { notifType } from "../../types/notifType";
import { ChatContext } from "../../context/socketContext";
import axios from "axios";

export default function useNotifsEvent(setNotifs: (props: any) => void) {
  const socket = useContext(ChatContext);

  useEffect(() => {
    console.log("getting user notifs");
    axios
      .get("http://localhost:3001/api/users/notifs", { withCredentials: true })
      .then((response) => {
        if (response.data) setNotifs(response.data);
      });
    socket.on("notified", (notif) => {
      console.log("event notified", notif);
      setNotifs((prev: notifType[]) => [...prev, notif]);
    });

    return () => {
      socket.off("notified");
    };
  }, []);
}
