import { useContext, useEffect } from "react";
import { ChatContext } from "../../context/socketContext";
import axios from "axios";
import { saveItem } from "../../utils/storage";
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

export default function useLogginEvent({
  user,
  isLogged,
  setUser,
  setIsLogged,
}: IProps) {
  const chatSocket = useContext(ChatContext);
  const navigate = useNavigate();

  useEffect(() => {
    chatSocket.on("connect", () => {
      if (user) chatSocket.emit("login", user);
    });
    chatSocket.on("loggedIn", (data) => {
      setUser(data);
      saveItem("user", data);
      setIsLogged(true);
      saveItem("isLogged", true);
      if (!isLogged) navigate("/profile");
    });

    return () => {
      chatSocket.off("connect");
      chatSocket.off("loggedIn");
    };
  }, []);
}
