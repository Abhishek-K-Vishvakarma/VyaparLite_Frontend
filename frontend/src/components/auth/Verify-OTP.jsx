import { useState } from "react";
import { Mail, ShieldCheck, Loader2 } from "lucide-react";
import { Toaster, toast } from "sonner";
import axios from "axios";
import url from "../../network/UrlProvider";
import { useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email || !otp) {
      toast.error("Email and OTP are required");
      return;
    }
    try {
      setLoading(true);
      await axios.post(
        `${ url }/auth/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );
      toast.success("OTP verified successfully");
      // ✅ redirect to reset password
      navigate("/reset-password", {
        state: { email }
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <Toaster richColors position="top-right" />

      {/* background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="text-[14vw] md:text-[7vw] font-extrabold tracking-widest text-slate-200 opacity-40">
          AUTHORIZATION
        </h1>
      </div>

      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800">Verify OTP</h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter the OTP sent to your email
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <Input
            icon={Mail}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            icon={ShieldCheck}
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium transition disabled:opacity-60"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : "Verify OTP"}
          </button>
        </form>
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
        focus:outline-none focus:ring-2 focus:ring-green-500
        ${ Icon ? "pl-10" : "pl-4" }`}
      />
    </div>
  );
}

