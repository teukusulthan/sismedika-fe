import { ReactNode } from "react";
import { useAuthStore } from "../store/auth.store";
import { useNavigate } from "react-router-dom";

interface Props {
  children: ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold mb-10">Sismedika POS</h1>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded"
        >
          Logout
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 p-10">
        <div className="bg-white rounded-xl shadow-md p-8">{children}</div>
      </main>
    </div>
  );
}
