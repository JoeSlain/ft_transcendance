import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Auth from "../../hooks/Auth";

const AuthRoute: React.FC = () => {
  const isLogged = useContext(Auth);

  if (!isLogged) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default AuthRoute;
