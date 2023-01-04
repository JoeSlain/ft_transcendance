import "../../styles/navbar.css";
import React from "react";
import { NavLink } from "react-router-dom";
import profile from "../../assets/user.png";
import Login, { VerifLogged } from "../../pages/login/Login";
import { deleteItem } from "../../utils/storage";
import axios from "axios";

export default function Navbar(props: { userKey: string }) {
  function logout(key: string) {
    deleteItem(key);
    axios
      .post("http://localhost:3001/api/auth/logout", {
        withCredentials: true,
      })
      .catch((e) => console.log("Post logout err: " + e));
  }
  return (
    <>
      <nav className="navigation">
        <div className="navigation-menu bg-ata-back">
          <ul>
            <li className="text-ata-red">
              <NavLink to="/Home">Home</NavLink>
            </li>
            <li className="text-ata-red">
              <NavLink to="/play">Play</NavLink>
            </li>
            <li className="text-ata-red">
              <NavLink to="/games">Games</NavLink>
            </li>
            <li className="text-ata-red">
              <NavLink to="/chat">Chat</NavLink>
            </li>
            <li className="text-ata-red">
              <NavLink
                className="navlink"
                to="/login"
                onClick={() => logout(props.userKey)}
              >
                Logout
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile">
                <img className="profile" src={profile} alt="Profile" />
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
