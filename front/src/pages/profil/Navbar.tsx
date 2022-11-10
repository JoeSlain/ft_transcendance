import { NavLink } from "react-router-dom";


export default function NavBar()
{
    return (
        <>
        <nav className="navigation">
        <div
        className="navigation-menu">
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