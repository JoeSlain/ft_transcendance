import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Auth from "./Auth";

interface elementProps {
	path: string;
	element: JSX.Element;
}

const AuthRoute = (props: elementProps) => {
	const { isLogged } = React.useContext(Auth);

	return isLogged ? (
		<Route path={props.path} element={props.element} />
	) : (
		<Route path="/" element={<Login />} />
	);
};

export default AuthRoute;
