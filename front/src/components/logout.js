import axios from "axios";
import { saveStorageItem } from "../storage/localStorage";

export default function logout(user, socket, setUser, setIsLogged) {
  axios
    .post(
      "http://localhost:3001/api/auth/logout",
      {},
      {
        withCredentials: true,
      }
    )
    .then((response) => {
      console.log(response.data);
      socket.emit("logout", user);
    });
}
