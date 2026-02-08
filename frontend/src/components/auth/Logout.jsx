import { useState } from "react";
import useLogout from "../../hooks/useLogout";

export default function Logout() {
  const { logout, loading } = useLogout();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2 w-full px-4 py-2.5
        text-red-600 hover:bg-red-50 rounded-lg"
      >
        Logout
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-center">
              Confirm Logout
            </h3>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-slate-100 py-2 rounded-xl"
              >
                Cancel
              </button>

              <button
                onClick={logout}
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-2 rounded-xl"
              >
                {loading ? "Logging out..." : "Yes, Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
