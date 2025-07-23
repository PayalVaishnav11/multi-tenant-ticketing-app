// components/Navbar.jsx
import { useDispatch,useSelector } from "react-redux";
import { logout } from "@/store/authSlice";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

   const user = useSelector((state) => state.auth.user);
  const firstName = user?.name?.split(" ")[0] || "";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center p-4 shadow-md ">
      <h1 className="text-xl font-bold">🎟️ Ticket App</h1>
      <div className="flex items-center space-x-4">
          <span className="text-gray-700 font-medium">👋 {firstName}</span>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-300 border-red-600 border-2 font-semibold rounded-md"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
