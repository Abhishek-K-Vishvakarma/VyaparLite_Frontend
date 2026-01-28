import { Link } from "react-router-dom";
import AuthCard from "./AuthCard";

export default function LoginForm() {
  return (
    <AuthCard subtitle="Smart billing for modern shops">
      <form className="space-y-4">
        <Input placeholder="Email Address" />
        <Input type="password" placeholder="Password" />

        <button type="submit"
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700
          text-white py-3 rounded-xl font-medium transition">Login</button>
        <p className="text-center text-sm text-slate-500 mt-4">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 cursor-pointer hover:underline">Register</Link>
        </p>
      </form>
    </AuthCard>
  );
}

function Input({ type = "text", placeholder }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="w-full px-4 py-3 rounded-xl border border-slate-300
      focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}
