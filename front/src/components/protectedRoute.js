import { Outlet, Navigate } from "react-router-dom"

const ProtectedRoute = ({
    user,
    redirectPath = '/login',
    children,
}) => {
    if (!user) {
        return <Navigate to={redirectPath} replace />
    }
    return children ? children: <Outlet />
}

export default ProtectedRoute;