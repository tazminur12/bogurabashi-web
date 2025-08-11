// src/routes/PrivateRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("auth") 
    ? JSON.parse(localStorage.getItem("auth")).isAuthenticated 
    : false;

  return isAuthenticated ? children || <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;