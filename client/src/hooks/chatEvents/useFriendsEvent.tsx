import { useContext, useEffect } from "react";
import { ChatContext, GameContext } from "../../context/socketContext";
import { userType } from "../../types/userType";
import User from "../User";
import { saveItem } from "../../utils/storage";

type IProps = {
  setFriends: (props: any) => void;
  setStatuses: (props: any) => void;
};

export default function useFriendsEvent({ setFriends, setStatuses }: IProps) {
  const chatSocket = useContext(ChatContext);
  const gameSocket = useContext(GameContext);
  const { user, setUser } = useContext(User);

  useEffect(() => {
    chatSocket.emit("getFriends", user);

    chatSocket.on("friends", (data) => {
      console.log("get friends event");
      setFriends(data.friends);
      setStatuses(new Map(JSON.parse(data.statuses)));
    });

    // new friend
    chatSocket.on("newFriend", (data) => {
      console.log("new Friend Event", data);
      setFriends((prev: userType[]) => [...prev, data.friend]);
      setStatuses(
        (prev: Map<number, string>) =>
          new Map(prev.set(data.friend.id, data.status))
      );
    });

    // update friend status
    chatSocket.on("updateStatus", (data) => {
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

    chatSocket.on("friendDeleted", (data) => {
      console.log("delete friend event");
      setFriends((prev: userType[]) =>
        prev.filter((friend) => friend.id !== data.id)
      );
    });

    gameSocket.on("updateStatus", (status) => {
      chatSocket.emit("updateUserStatus", { user, status });
    });

    gameSocket.on("updateElo", ({ host, guest }) => {
      if (host.id === user.id) {
        setUser(host);
        saveItem("user", host);
      } else if (guest.id === user.id) {
        setUser(guest);
        saveItem("user", guest);
      }
    });

    /*chatSocket.on("eloUpdated", (newUser) => {
      console.log("elo updated");
      setUser(newUser);
      saveItem("user", newUser);
      gameSocket.emit("eloUpdated", newUser);
    });*/

    return () => {
      chatSocket.off("friends");
      chatSocket.off("newFriend");
      chatSocket.off("updateStatus");
      chatSocket.off("friendDeleted");
      gameSocket.off("updateStatus");
      //gameSocket.off("updateElo");
      //chatSocket.off("eloUpdated");
    };
  }, []);
}
