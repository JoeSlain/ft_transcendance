import { useContext } from "react";
import Users from "./users";
import Auth from "../../hooks/Auth";

export default function Contact() {
  const isLogged = useContext(Auth);

  return (
    <div className="contactBar">
      <div className="contacts">
        <h1 className="header">Contacts</h1>
        {isLogged && <Users />}
      </div>
    </div>
  );
}
