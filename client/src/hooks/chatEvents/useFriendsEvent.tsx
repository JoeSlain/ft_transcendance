import { useContext, useEffect } from "react";
import { ChatContext } from "../../context/socketContext";
import { userType } from "../../types/userType";
import User from "../User";

type IProps = {
  setFriends: (props: any) => void;
  setStatuses: (props: any) => void;
};

export default function useFriendsEvent({ setFriends, setStatuses }: IProps) {
  const socket = useContext(ChatContext);
  const { user } = useContext(User);

  useEffect(() => {
    socket.emit("getFriends", user);

    socket.on("friends", (data) => {
      console.log("get friends event");
      setFriends(data.friends);
      setStatuses(new Map(JSON.parse(data.statuses)));
    });

    // new friend
    socket.on("newFriend", (data) => {
      console.log("new Friend Event");
      setFriends((prev: userType[]) => [...prev, data]);
      setStatuses(
        (prev: Map<number, string>) => new Map(prev.set(data.id, "online"))
      );
    });

    // update friend status
    socket.on("updateStatus", (data) => {
      console.log("friend update event", data);
      setFriends((prev: userType[]) => {
        return prev.map((friend) => {
          if (friend.id === data.user.id) return data.user;
          return friend;
        });
      });
      setStatuses((prev: Map<number, string>) => {
        if (prev.has(data.user.id)) {
          console.log("user found, changing status");
          return new Map(prev.set(data.user.id, data.status));
        } else {
          console.log("user not found, status unchanged");
          return prev;
        }
      });
    });

    socket.on("friendDeleted", (data) => {
      console.log("delete friend event");
      setFriends((prev: userType[]) =>
        prev.filter((friend) => friend.id !== data.id)
      );
    });

    return () => {
      socket.off("friends");
      socket.off("newFriend");
      socket.off("updateStatus");
      socket.off("friendDeleted");
    };
  }, []);
}
