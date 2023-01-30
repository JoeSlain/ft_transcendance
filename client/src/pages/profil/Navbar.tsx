import { NavLink, Outlet } from "react-router-dom";

export default function ProfileNavbar(props: { userId: number }) {
  console.log("userid", props.userId);
  return (
    <>
      <nav className="navigation mt-5 ">
        <div className=" ">
          <ul className="flex justify-center space-x-5 sm:space-x-10 text-slate-100 text-xl ">
            <li>
              <NavLink
                className="navlink font-retro"
                to={`/profile/${props.userId}`}
              >
                Account
              </NavLink>
            </li>
            <li>
              <NavLink
                className="navlink  font-retro"
                to={`/profile/${props.userId}/stats`}
              >
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
