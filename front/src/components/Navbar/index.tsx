import "../../styles/navbar.css";
import { NavLink } from 'react-router-dom';
import profile from "../../assets/user.png";

export default function Navbar()
{
  return (
      <>
      <nav className="navigation">
          <div
          className="navigation-menu">
          <ul>
              <li className="title">
                <NavLink className="navlink" to="/">Home</NavLink>
              </li>
              <li className="title">
                <NavLink className="navlink" to="/play">Play</NavLink>
              </li>
              <li className="title">
                <NavLink className="navlink" to="/games">Games</NavLink>
              </li>
              <li className="title">
                <NavLink className="navlink" to="/chat">Chat</NavLink>
              </li>
              <li>
                <NavLink className="navlink" to="/profil"><img className="profile" src={profile} alt="Profil"/></NavLink>
              </li>
          </ul>
          </div>
      </nav>
    </>
  );
}