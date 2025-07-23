import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@/store/authSlice";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import { fetchScreens } from "@/store/screenSlice";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(""); // clear error when typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { email, password } = formData;
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      console.log("response",response);

      if (response.data?.data?.token) {
        const user = response.data.data.user;
        const token = response.data.data.token;

        dispatch(setCredentials({ user, token }));
        dispatch(fetchScreens());

        toast.success("Login Successful");
        navigate("/dashboard");
      } else {
        setError("Invalid credentials");
        toast.error("Invalid credentials")
      }
    } catch (err) {
      console.error("Login error:", err);
      const msg = err?.response?.data?.message || "Invalid credentials";
      setError(msg);
      toast.error("Failed Login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-blue-200 px-4">
      <Card className="w-full max-w-md shadow-2xl border border-gray-300 rounded-2xl bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-800">Welcome Back👋</CardTitle>
          <p className="text-sm text-gray-500 mt-1">Login to your account</p>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {error && (
              <p className="text-sm text-center text-red-600 bg-red-100 px-3 py-2 rounded-md">
                {error}
              </p>
            )}
            <div>
              <Label className='mb-2' htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 focus:border-gray-50"
              />
            </div>

            <div className="relative">
              <Label className="mb-2" htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 pr-10 focus:border-gray-50"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-[21px] right-2 text-gray-500 "
              >
                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 mt-3">
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm mt-5"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
           
          
            <p className="text-sm text-gray-500 text-center">
              Don’t have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:underline font-medium">
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
