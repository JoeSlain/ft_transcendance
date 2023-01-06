import "../../styles/navbar.css";
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import profile from "../../assets/user.png";
import Login, { VerifLogged } from "../../pages/login/Login";
import { deleteItem } from "../../utils/storage";
import axios from "axios";
import User from "../../hooks/User";
import { userType } from "../../types/userType";

type IProps = {
  setIsLogged: (props: boolean) => void;
};

export default function Navbar({ setIsLogged }: IProps) {
  const context = useContext(User);

  function logout() {
    deleteItem("user");
    deleteItem("isLogged");
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
            <li>
              <NavLink className="navlink" to="/login" onClick={logout}>
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
