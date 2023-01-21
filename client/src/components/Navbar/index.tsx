import "../../styles/navbar.css";
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import profile from "../../assets/user.png";
import Login, { VerifLogged } from "../../pages/login/Login";
import { deleteItem, getSavedItem } from "../../utils/storage";
import User from "../../hooks/User";
import Auth from "../../hooks/Auth";
import { ChatContext, GameContext } from "../../context/socketContext";
import Notifs from "../notifs/notifs";

type IProps = {
  setIsLogged: (props: boolean) => void;
};

export default function Navbar({ setIsLogged }: IProps) {
  const { user } = useContext(User);
  const isLogged = useContext(Auth);
  const chatSocket = useContext(ChatContext);
  const gameSocket = useContext(GameContext);

  function logout() {
    chatSocket.emit("logout", user);
    gameSocket.emit("logout", user);
  }
  return (
    <>
      <nav className=" bg-ata-red py-2">
        <ul className=" bg-ata-red flex justify-center gap-2 sm:gap-7 grow">
          <li>{isLogged && <Notifs />}</li>
          <li className=" font-retro sm:text-[26px] text-ata-yellow hover:bo">
            <NavLink to="/Home">HOME</NavLink>
          </li>
          <li className=" font-retro sm:text-[26px] text-ata-yellow">
            <NavLink to="/play">PLAY</NavLink>
          </li>
          <li className=" font-retro sm:text-[26px] text-ata-yellow">
            <NavLink to="/chat">CHAT</NavLink>
          </li>
          <li className=" font-retro sm:text-[26px] text-ata-yellow">
            <NavLink className="navlink" to="/login" onClick={logout}>
              LOGOUT
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile">
              <img className="avatar max-w-[20px] sm:max-w-[42px] sm:max-h-[42px] bg-ata-red" src={profile} alt="Profile" />
            </NavLink>
          </li>
        </ul>
      </nav>
    </>
  );
}
