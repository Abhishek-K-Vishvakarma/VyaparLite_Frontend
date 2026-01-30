import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthCard from "./AuthCard";
import { getDeviceId } from "../../utils/device";
import { getFCMToken } from "../../utils/fcm";

export default function LoginForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const deviceId = getDeviceId();
      const fcmToken = await getFCMToken();

      // 🔥 Using proxy - relative URL instead of full URL
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include", // 🔥 CRITICAL: This was missing!
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
      console.log("📥 Login response:", data);

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // 🔥 Optional: Store user info (but NOT token in localStorage for security)
      localStorage.setItem("user", JSON.stringify(data.user));

      // 🔥 Note: Token is now in httpOnly cookie, not in localStorage
      // localStorage.setItem("token", data.token); // ❌ Remove this line

      console.log("✅ Login successful, cookie should be set");

      // 🔥 Test immediately if cookie works
      const testRes = await fetch("/api/notification/countNotifications", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const testData = await testRes.json();
      console.log("🔔 Test API response:", testData);

      alert("Login successful 🎉");
      navigate("/");

    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard subtitle="Smart billing for modern shops">
      {error && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}

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
          text-white py-3 rounded-xl font-medium transition disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-slate-500 mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </AuthCard>
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
      className="w-full px-4 py-3 rounded-xl border border-slate-300
      focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}