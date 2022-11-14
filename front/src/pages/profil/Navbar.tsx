import { NavLink } from "react-router-dom";
import "../../styles/navbar.css";

export default function NavBar()
{
    return (
        <>
        <nav className="navigation">
        <div
        className="navigation-menu2">
        <ul>
            <li>
              <NavLink className="navlink" to="/profil">Account</NavLink>
            </li>
            <li>
              <NavLink className="navlink" to="/stats">Statistics</NavLink>
            </li>
            <li>
              <NavLink className="navlink" to="/history">Match history</NavLink>
            </li>
        </ul>
        </div>
      </nav>
    </>
    );
}