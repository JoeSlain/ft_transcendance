import React from "react";
import { Outlet } from "react-router-dom";
import Login from "./Login";
import Auth from "../../hooks/Auth";


export function AuthRoute() {
 	const { isLogged } = React.useContext(Auth);
	return (
		!isLogged ? <Login /> : <Outlet/>
	);
}