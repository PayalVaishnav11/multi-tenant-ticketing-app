// components/AdminRoute.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user || user.role !== "Admin") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AdminRoute;
