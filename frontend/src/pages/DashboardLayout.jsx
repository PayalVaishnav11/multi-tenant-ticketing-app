import { Outlet, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/authSlice";
import { toast } from "sonner";

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { screens } = useSelector((state) => state.screen); // fetched from /me/screens

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-4">
        <h2 className="text-2xl font-bold">🎫 Ticket App</h2>
        <p className="text-sm text-gray-300 mt-2">Hi, {user?.email}</p>

        {/* Dynamic Navigation Links */}
        <nav className="flex flex-col space-y-2 mt-6">
          {screens?.map((screen) => (
            <Link
              key={screen.url}
              to={screen.url}
              className="hover:text-blue-400"
            >
              {screen.name}
            </Link>
          ))}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-left mt-8 text-red-400 hover:text-red-500"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
