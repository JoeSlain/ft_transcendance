import { NavLink, Outlet } from "react-router-dom";

export default function ProfileNavbar(props: { userId: number }) {
  return (
    <>
      <nav className="navigation mt-5 ">
        <div className=" ml-8">
          <ul className="flex justify-center space-x-10 text-slate-100 text-xl">
            <li>
              <NavLink
                className="navlink"
                to={`/profile/${props.userId}`}
              >
                Account
              </NavLink>
            </li>
            <li>
              <NavLink className="navlink" to="/profile/stats">
                Statistics
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
