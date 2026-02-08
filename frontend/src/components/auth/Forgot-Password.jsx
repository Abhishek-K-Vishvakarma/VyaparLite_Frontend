import { useState } from "react";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { toast, Toaster } from "sonner";
import url from "../../network/UrlProvider";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const getUserFromApplicationTab = localStorage.getItem("user");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        `${ url }/auth/forgot-password`,
        { email }
      );
      toast.success("OTP sent to your email successfully");
      // ✅ redirect to verify-otp page with email
      navigate("/verify-otp", {
        state: { email }
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Something went wrong. Try again later"
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <Toaster richColors position="top-right" />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="text-[12vw] md:text-[6vw] font-extrabold tracking-widest text-slate-200 opacity-40 select-none">
          AUTHENTICATION
        </h1>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex items-center gap-2 mb-6 text-indigo-600 cursor-pointer">
          <ArrowLeft size={20} />
          {!getUserFromApplicationTab || undefined ? <Link to="/login"><span className="text-sm font-medium">Back to Login</span></Link> : <Link to="/"><span className="text-sm font-medium">Back to Home Page</span></Link>}
          {/* <Link to="/login"><span className="text-sm font-medium">Back to Login</span></Link> */}
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Forgot Password?</h1>
        <p className="text-xs uppercase tracking-wider text-indigo-600 font-semibold mb-1">Authorization & Security</p>
        <p className="text-gray-500 mb-6 text-sm">
          Enter your registered email. We’ll send you an OTP to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Sending OTP...
              </>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} VyaparLite. All rights reserved.
        </p>
      </div>
    </div>
  );
}
