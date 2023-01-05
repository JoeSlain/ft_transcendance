import { useContext, useEffect } from "react";
import { ChatContext, GameContext } from "../../context/socketContext";
import { roomType } from "../../types/roomType";
import User from "../User";

type IProps = {
  setRoom: (props: roomType) => void;
};

export default function useLobbyEvents({ setRoom }: IProps) {
  const gameSocket = useContext(GameContext);
  const chatSocket = useContext(ChatContext);
  const { user } = useContext(User);

  useEffect(() => {
    gameSocket.emit("getRoom", user.id);

    gameSocket.on("newRoom", (room) => {
      setRoom(room);
    });

    chatSocket.on("acceptedInvite", (data) => {
      console.log("data host id", data);
      const roomData = {
        user,
        hostId: data,
      };
      console.log("acceptedInvite");
      gameSocket.emit("joinRoom", roomData);
    });

    return () => {
      gameSocket.off("getRoom");
      chatSocket.off("acceptedInvite");
    };
  }, []);
}
