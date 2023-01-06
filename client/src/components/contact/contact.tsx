import { useContext } from "react";
import Users from "./users";
import User from "../../hooks/User";
import Auth from "../../hooks/Auth";

export default function Contact() {
  const isLogged = useContext(Auth);

  return (
    {/*<div className="flex flex-col items-center grow">
      <h1>Contacts</h1>
      <ul className="menu bg-base-100 w-100 ">
        <li>
          <a>Item 1</a>
        </li>
        <li>
          <a>Item 2</a>
        </li>
        <li>
          <a>Item 3</a>
        </li>
      </ul>*/}

    <div className="contactBar">
      <div className="contacts">
        <h1 className="header">Contacts</h1>
        {isLogged && <Users />}
      </div>
    </div>
  );
}
