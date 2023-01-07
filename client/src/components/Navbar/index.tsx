import "../../styles/navbar.css";
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import profile from "../../assets/user.png";
import Login, { VerifLogged } from "../../pages/login/Login";
import { deleteItem, getSavedItem } from "../../utils/storage";
import axios from "axios";
import User from "../../hooks/User";
import { userType } from "../../types/userType";
import Auth from "../../hooks/Auth";
import { ChatContext } from "../../context/socketContext";

type IProps = {
  setIsLogged: (props: boolean) => void;
};

export default function Navbar({ setIsLogged }: IProps) {
  const { user } = useContext(User);
  const isLogged = useContext(Auth);
  const socket = useContext(ChatContext);

  function logout() {
    socket.emit("logout", user);
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
            {isLogged && (
              <li>
                <NavLink className="navlink" to="/login" onClick={logout}>
                  Logout
                </NavLink>
              </li>
            )}
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
