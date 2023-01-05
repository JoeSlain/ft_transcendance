import { useContext, useEffect } from "react";
import { ChatContext } from "../../context/socketContext";
import axios from "axios";
import { saveItem } from "../../utils/storage";
import { userType } from "../../types/userType";
import { useNavigate } from "react-router-dom";
import { notifType } from "../../types/notifType";
import Auth from "../Auth";

type IProps = {
  user: userType | null;
  setUser: (props: userType) => void;
  setIsLogged: (props: boolean) => void;
  setNotifs: (props: notifType[]) => void;
};

export default function useLogginEvent({
  user,
  setUser,
  setIsLogged,
  setNotifs,
}: IProps) {
  const chatSocket = useContext(ChatContext);
  const isLogged = useContext(Auth);
  const navigate = useNavigate();

  useEffect(() => {
    chatSocket.on("loggedIn", (data) => {
      console.log("loggedIn");
      axios
        .get("http://localhost:3001/api/users/notifs", {
          withCredentials: true,
        })
        .then((response) => {
          console.log("data", response.data);
          setNotifs(response.data);
          setUser(data);
          saveItem("user", data);
          setIsLogged(true);
          saveItem("isLogged", true);
          if (!isLogged) navigate("/profile");
        });
    });

    return () => {
      chatSocket.off("loggedIn");
    };
  }, []);
}
