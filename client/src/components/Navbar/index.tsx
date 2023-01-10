import "../../styles/navbar.css";
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import profile from "../../assets/user.png";
import { deleteItem } from "../../utils/storage";
import axios from "axios";
import User from "../../hooks/User";
import Notif from "../notifs/notifs";

type IProps = {
  setIsLogged: (props: boolean) => void;
};

export default function Navbar({ setIsLogged }: IProps) {
  const context = useContext(User);

  function logout() {
    deleteItem("user");
    axios
      .post("http://localhost:3001/api/auth/logout", {
        withCredentials: true,
      })
      .then(() => {
        setIsLogged(false);
      })
      .catch((e) => console.log("Post logout err: " + e));
  }
  return (
    <>
      <nav className="navigation bg-ata-red pt-4">
        <div className="navigation-menu bg-ata-red flex justify-center ">
          <ul>
            <li>
              <Notif />
            </li>
            <li className=" font-retro text-ata-yellow hover:bo">
              <NavLink to="/Home">HOME</NavLink>
            </li>
            <li className=" font-retro text-ata-yellow">
              <NavLink to="/play">PLAY</NavLink>
            </li>
            <li className=" font-retro text-ata-yellow">
              <NavLink to="/chat">CHAT</NavLink>
            </li>
            <li className=" font-retro text-ata-yellow">
              <NavLink className="navlink" to="/login" onClick={logout}>
                LOGOUT
              </NavLink>
            </li>
            <li>
              <NavLink to="/profile">
                <img
                  className="profile bg-ata-red"
                  src={profile}
                  alt="Profile"
                />
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
