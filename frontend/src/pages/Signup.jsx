import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axiosInstance from "@/utils/axiosInstance";

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    customerId: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");



    const { name, email, password, role, customerId } = formData;

    console.log("formdata",formData);
    console.log("name:",name);
    console.log("email:",email);
    console.log("password:",password);
    console.log("role:",role);
    console.log("customer:",customerId);

    if (!name || !email || !password || !customerId || !role) {
      console.log("Inside if")
      setError("⚠️ All fields are required");
      return;
    }

    try {
      const res = await axiosInstance.post("/auth/register", formData);
      toast.success("✅ Registered Successfully");
      navigate("/login");
    } catch (err) {
      const msg = err?.response?.data?.message || "❌ Registration failed";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-100 to-blue-200  px-4 ">
      <Card className="w-full max-w-md shadow-lg rounded-2xl border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold text-gray-800">
            Create Account
          </CardTitle>
          <p className="text-sm text-center text-gray-500 mt-1">Sign up to get started</p>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <p className="text-red-600 text-sm text-center bg-red-100 px-3 py-2 rounded">
                {error}
              </p>
            )}

            <div >
              <Label className="mb-2" htmlFor="name">Full Name</Label>
              <Input
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className=""
              />
            </div>

            <div>
              <Label className="mb-2" htmlFor="email">Email</Label>
              <Input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <Label className="mb-2" htmlFor="password">Password</Label>
              <Input
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                autoComplete= "new-password"
                onChange={handleChange}
              />
            </div>

            <div>
              <Label className="mb-2" htmlFor="role">Select Role</Label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded mt-1"
              >
                <option value="">-- Select Role --</option>
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {formData.role === "User" && (
              <div>
                <Label className="mb-2" htmlFor="customerId">CustomerId</Label>
                <select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded mt-1"
                >
                  <option value="">-- Select Customer --</option>
                  <option value="LogisticsCo">LogisticsCo</option>
                  <option value="RetailGmbH">RetailGmbH</option>
                </select>
              </div>
            )}

            {formData.role === "Admin" && (
              <div>
                <Label className="mb-2" htmlFor="customerId">CustomerId</Label>
                <select
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded mt-1"
                >
                  <option value="">-- Select Admin  --</option>
                  <option value="admin">admin</option>
                </select>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 mt-2">
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Register
            </Button>
            <p className="text-sm text-gray-500 text-center">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline font-medium">
                Login here
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignUp;
