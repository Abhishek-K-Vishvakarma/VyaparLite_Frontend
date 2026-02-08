import { useState } from "react";
import { Lock, KeyRound, Loader2 } from "lucide-react";
import { toast, Toaster } from "sonner";
import axios from "axios";
import url from "../../network/UrlProvider";

export default function ChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { oldPassword, newPassword, confirmPassword } = form;

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${ url }/auth/change-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true }
      );

      toast.success("Password changed successfully 🔐");

      setForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <Toaster richColors position="top-right" />

      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="text-[14vw] md:text-[6vw] font-extrabold tracking-widest text-slate-200 opacity-40 select-none">
          SECURITY
        </h1>
      </div>

      {/* Card */}
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 sm:p-7">
        {/* Branding */}
        <p className="text-xs font-semibold text-blue-600 tracking-wider mb-1">
          VyaparLite
        </p>

        <h2 className="text-xl font-bold text-gray-800 mb-1">
          Change Password
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Update your account security
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            icon={Lock}
            type="password"
            name="oldPassword"
            placeholder="Old password"
            value={form.oldPassword}
            onChange={handleChange}
          />

          <Input
            icon={KeyRound}
            type="password"
            name="newPassword"
            placeholder="New password"
            value={form.newPassword}
            onChange={handleChange}
          />

          <Input
            icon={KeyRound}
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <button
            disabled={loading}
            className="w-full flex items-center justify-center gap-2
            bg-blue-600 hover:bg-blue-700 text-white py-2.5
            rounded-xl font-medium transition disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "Change Password"
            )}
          </button>
        </form>

        {/* Forgot */}
        <p className="text-center text-xs text-slate-500 mt-4">
          Forgot old password?{" "}
          <a
            href="/forgot"
            className="text-blue-600 hover:underline font-medium"
          >
            Reset via email
          </a>
        </p>
      </div>
    </div>
  );
}

function Input({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      )}

      <input
        {...props}
        required
        className={`w-full pr-4 py-2.5 rounded-xl border border-slate-300 
        focus:outline-none focus:ring-2 focus:ring-blue-500 transition
        ${ Icon ? "pl-10" : "pl-4" }`}
      />
    </div>
  );
}

