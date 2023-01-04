import { useContext, useEffect } from "react";
import { ChatContext } from "../../context/socketContext";
import axios from "axios";
import { saveItem } from "../../utils/storage";
import { userType } from "../../types/userType";
import { useNavigate } from "react-router-dom";
import { notifType } from "../../types/notifType";

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
          if (!user) {
            console.log("user null");
            setUser(data);
            saveItem("user", data);
            setIsLogged(true);
            navigate("/profile");
          }
          console.log("user", data);
          setIsLogged(true);
        });
    });

    return () => {
      chatSocket.off("loggedIn");
    };
  }, []);
}
