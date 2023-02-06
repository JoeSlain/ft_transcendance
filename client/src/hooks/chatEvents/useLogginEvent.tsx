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
    chatSocket.on("connect", () => {
      if (user) {
        console.log("login");
        chatSocket.emit("login", user);
      }
    });

    chatSocket.on("disconnect", () => {
      console.log("disconnect");
      if (user) {
        console.log("logout");
        chatSocket.emit("logout", user);
        gameSocket.emit("logout", user);
      }
    });

    chatSocket.on("loggedIn", (data) => {
      console.log("data", data);
      setUser(data);
      saveItem("user", data);
      if (!getSavedItem("isLogged")) navigate("/home");
      saveItem("isLogged", true);
      setIsLogged(true);
      //gameSocket.emit("login", data);
    });

    chatSocket.on("loggedOut", () => {
      console.log("logout");
      axios
        .post("http://10.11.7.11:3001/api/auth/logout", {
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
      chatSocket.off("disconnect");
      chatSocket.off("loggedIn");
      chatSocket.off("loggedOut");
    };
  }, []);
}
