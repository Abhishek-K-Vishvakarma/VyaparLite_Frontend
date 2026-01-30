import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoginForm from "../components/auth/Login";

export default function LoginPage() {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/myProfile", {
          method: "GET",
          credentials: "include",
        });

        setIsAuth(res.ok);
      } catch {
        setIsAuth(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuth === null) return null;

  if (isAuth) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100">
      <LoginForm />
    </div>
  );
}
