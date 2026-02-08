import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import AuthCard from "./AuthCard";
import { getDeviceId } from "../../utils/device";
import { getFCMToken } from "../../utils/fcm";
import url from "../../network/UrlProvider";

export default function LoginForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const deviceId = getDeviceId();
      const fcmToken = await getFCMToken();

      const res = await fetch(`${ url }/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          deviceId,
          fcmToken,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Login failed");
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login successful 🎉");
      navigate("/", { replace: true });

    } catch (err) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster richColors position="top-right" />

      {/* 🔹 Page wrapper – gives mobile side spacing */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <AuthCard
          subtitle="Smart billing for modern shops"
          className="w-full max-w-xs sm:max-w-sm"
        >
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
            />

            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-700
            text-white py-2.5 rounded-xl font-medium transition
            disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-sm text-slate-500 mt-3">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Register
              </Link>
            </p>

            <p className="text-center text-sm text-slate-500 mt-2">
              Forgot your password?{" "}
              <Link to="/forgot" className="text-blue-600 hover:underline">
                Reset here
              </Link>
            </p>
          </form>
        </AuthCard>
      </div>
    </>
  );
}

/* 🔹 Reusable Input */
function Input({ type = "text", placeholder, name, value, onChange }) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required
      className="w-full px-4 py-2.5 rounded-xl border border-slate-300
      focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
