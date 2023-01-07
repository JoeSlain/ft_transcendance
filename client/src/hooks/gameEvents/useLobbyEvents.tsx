import { useContext, useEffect } from "react";
import { ChatContext, GameContext } from "../../context/socketContext";
import { roomType } from "../../types/roomType";
import User from "../User";

type IProps = {
  room: roomType | null;
  setRoom: (props: roomType | null) => void;
};

export default function useLobbyEvents({ room, setRoom }: IProps) {
  const gameSocket = useContext(GameContext);
  const { user } = useContext(User);

  useEffect(() => {
    console.log("rendering play");
    gameSocket.emit("getRoom", user.id);

    // new room
    gameSocket.on("newRoom", (room) => {
      setRoom(room);
    });

    // join
    gameSocket.on("joinedRoom", (room) => {
      setRoom(room);
    });

    // user leave
    gameSocket.on("leftRoom", (room) => {
      setRoom(room);
    });

    // me leave
    gameSocket.on("clearRoom", () => {
      setRoom(null);
    });

    return () => {
      gameSocket.off("getRoom");
      gameSocket.off("newRoom");
      gameSocket.off("joinedRoom");
      gameSocket.off("leftRoom");
      gameSocket.off("clearRoom");
    };
  }, []);
}
