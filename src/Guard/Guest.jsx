import { Navigate } from "react-router-dom";

const Guest = ({ children }) => {
  const token = localStorage.getItem("userData");

  return token ? <Navigate to="/dashboard" replace /> : children;
};
export default Guest;
