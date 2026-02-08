import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import url from "../../../network/UrlProvider";

export default function useLogout() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const logout = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${ url }/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Logout failed");
      }

      localStorage.removeItem("user");
      toast.success("Logged out successfully");

      setTimeout(() => {
        navigate("/login");
      }, 700);
    } catch (err) {
      toast.error(err.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading };
}
