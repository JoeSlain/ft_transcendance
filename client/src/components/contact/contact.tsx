import { useContext } from "react";
import Users from "./users";
import Auth from "../../hooks/Auth";
import "../../styles/global.css";

export default function Contact() {
  const isLogged = useContext(Auth);

  return (
    <div className="bg-base-200 heightMinusNav pr-3 pl-3">
{/*         <h1 className="header">Contacts</h1>
 */}        {isLogged && <Users />}

    </div>
  );
}
