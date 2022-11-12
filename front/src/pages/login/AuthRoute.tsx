import React from "react";
import { Navigate, Route, Routes, RouteProps, Outlet } from "react-router-dom";
import Login from "./Login";
import Auth from "../../context/Auth";


export function AuthRoute() {
 	const { isLogged } = React.useContext(Auth);
	return (
		!isLogged ? <Login /> : <Outlet/>
	);
}

