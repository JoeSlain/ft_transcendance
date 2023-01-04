import { useContext } from "react";
import Users from "./users";
import User from "../../hooks/User";
import Auth from "../../hooks/Auth";

export default function Contact() {
  const isLogged = useContext(Auth);

  return (
    <div className="contacts">
      <h1 className="header">Contact</h1>
      {isLogged && <Users />}
    </div>
  );
}
