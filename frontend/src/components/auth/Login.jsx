import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

      const res = await fetch(`${ url }/auth/login`, {
        method: "POST",
        credentials: "include", // 🔥 required for cookies
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

      // 🔐 SAFELY parse response
      let data = null;
      const contentType = res.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        throw new Error(text || "Unexpected server response");
      }

      if (!res.ok) {
        throw new Error(data?.message || "Login failed");
      }

      // ✅ Save minimal user info (NO TOKEN)
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("✅ Login successful, cookie set");

      // ✅ Redirect immediately (NO extra API calls here)
      navigate("/", { replace: true });

    } catch (err) {
      console.error("❌ Login error:", err);
      setError(err.message || "Something went wrong");
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
          Don&apos;t have an account?{" "}
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
