import { ReactNode } from "react";
import { useAuthStore } from "../store/auth.store";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex h-screen">
      <aside className="w-60 bg-black text-white p-6 space-y-4">
        <h2 className="text-xl font-bold">Sismedika POS</h2>
        <p className="text-sm opacity-70">{user?.name}</p>
        <button
          onClick={logout}
          className="mt-4 bg-red-500 w-full py-2 rounded"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8 bg-gray-50">{children}</main>
    </div>
  );
}
