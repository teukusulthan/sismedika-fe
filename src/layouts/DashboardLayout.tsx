import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const roleColor =
    user?.role === "cashier"
      ? "text-blue-400 bg-blue-500/10 border-blue-500/20"
      : user?.role === "waiter"
        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
        : "text-gray-400 bg-gray-500/10 border-gray-500/20";

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-72 bg-[#0f172a] text-gray-300 flex flex-col">
        <div className="px-8 py-8 border-b border-white/5">
          <div className="text-white font-semibold text-lg tracking-wide">
            Sismedika POS
          </div>

          <div className="mt-8">
            <div className="text-sm font-semibold text-gray-200">
              {user?.name}
            </div>

            <div className="text-xs text-gray-400 mt-1">{user?.email}</div>

            <div
              className={`mt-4 inline-flex items-center px-3 py-1 text-[11px] font-medium rounded-full border ${roleColor}`}
            >
              {user?.role?.toUpperCase()}
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-8 space-y-8">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-3 px-4">
              Main
            </div>

            <div className="space-y-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `group relative flex items-center px-4 py-2.5 rounded-xl text-sm transition ${
                    isActive
                      ? "bg-white/5 text-white"
                      : "hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-0 h-full w-1 bg-white rounded-r" />
                    )}
                    <span>Dashboard</span>
                  </>
                )}
              </NavLink>

              <div className="flex items-center px-4 py-2.5 rounded-xl text-sm text-gray-500 cursor-not-allowed opacity-50">
                Orders
              </div>
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-3 px-4">
              Management
            </div>

            <div className="space-y-1">
              <div className="flex items-center px-4 py-2.5 rounded-xl text-sm text-gray-500 cursor-not-allowed opacity-50">
                Reports
              </div>

              <div className="flex items-center px-4 py-2.5 rounded-xl text-sm text-gray-500 cursor-not-allowed opacity-50">
                Settings
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 transition px-4 py-2.5 rounded-xl text-sm font-medium text-white"
          >
            Logout
          </button>

          <div className="text-center text-[11px] text-gray-500 mt-6">
            © 2026 Sismedika
          </div>
        </div>
      </aside>

      <main className="flex-1 p-10">
        <div className="bg-white rounded-2xl shadow-sm p-10 min-h-[calc(100vh-80px)]">
          {children}
        </div>
      </main>
    </div>
  );
}
