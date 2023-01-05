import "../../styles/navbar.css";
import React from "react";
import { NavLink } from "react-router-dom";
import profile from "../../assets/user.png";
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
      <nav className="navigation bg-ata-red ">
        <div className="navigation-menu bg-ata-red flex justify-center ">
          <ul>
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
              <NavLink
                className="navlink"
                to="/login"
                onClick={() => logout(props.userKey)}
              >
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
