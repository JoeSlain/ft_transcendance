import { useContext, useEffect } from "react";
import { ChatContext, GameContext } from "../../context/socketContext";
import axios from "axios";
import { deleteItem, getSavedItem, saveItem } from "../../utils/storage";
import { userType } from "../../types/userType";
import { useNavigate } from "react-router-dom";
import { notifType } from "../../types/notifType";
import Auth from "../Auth";
import User from "../User";

type IProps = {
  user: userType | null;
  isLogged: boolean;
  setUser: (props: userType) => void;
  setIsLogged: (props: boolean) => void;
};

export default function useLogginEvent({ user, setUser, setIsLogged }: IProps) {
  const chatSocket = useContext(ChatContext);
  const gameSocket = useContext(GameContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("use login");
    chatSocket.on("connect", () => {
      if (user) {
        console.log("login");
        chatSocket.emit("login", user);
      }
    });

    chatSocket.on("loggedIn", (data) => {
      setUser(data);
      saveItem("user", data);
      if (!getSavedItem("isLogged")) navigate("/home");
      saveItem("isLogged", true);
      setIsLogged(true);
      gameSocket.emit("login", data);
    });

    chatSocket.on("loggedOut", () => {
      axios
        .post("http://localhost:3001/api/auth/logout", {
          withCredentials: true,
        })
        .then(() => {
          console.log("logging out");
          setIsLogged(false);
          deleteItem("user");
          deleteItem("isLogged");
          deleteItem("selected");
        })
        .catch((e) => console.log("Post logout err: " + e));
    });

    return () => {
      chatSocket.off("connect");
      chatSocket.off("loggedIn");
    };
  }, []);
}
