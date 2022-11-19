import { NavLink } from "react-router-dom";


export default function ProfileNavbar()
{
    return (
        <>
        <nav className="navigation mt-5 ">
        <div
        className=" ml-8">
        <ul className="flex justify-center space-x-10 text-slate-100 text-xl">
            <li>
              <NavLink className="navlink" to="/profile">Account</NavLink>
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