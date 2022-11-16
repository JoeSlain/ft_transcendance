import "../styles/navbar.css";
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navigation">
            <div
                className="navigation-menu">
                <ul>
                    <li>
                        <NavLink className="navlink" to="/">Home</NavLink>
                    </li>
                    <li>
                        <NavLink className="navlink" to="/play">Play</NavLink>
                    </li>
                    <li>
                        <NavLink className="navlink" to="/games">Games</NavLink>
                    </li>
                    <li>
                        <NavLink className="navlink" to="/chat">Chat</NavLink>
                    </li>
                    <li>
                        <NavLink className="navlink" to="/profile">Profile</NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;