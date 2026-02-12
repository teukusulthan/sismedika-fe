import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { tableService } from "../services/table.service";
import { useAuthStore } from "../store/auth.store";

interface RestaurantTable {
  id: number;
  name: string;
  status: "available" | "occupied";
  current_order_id?: number | null;
}

export default function DashboardPage() {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const role = user?.role;

  const fetchTables = async () => {
    try {
      const res: any = await tableService.getAll();

      const rawData: RestaurantTable[] = Array.isArray(res)
        ? res
        : (res?.data ?? []);

      const sorted = [...rawData].sort((a, b) => a.id - b.id);

      setTables(sorted);
    } catch (error) {
      console.error("Failed to fetch tables", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  const handleTableClick = async (table: RestaurantTable) => {
    if (role === "cashier") {
      if (table.status === "occupied" && table.current_order_id) {
        navigate(`/orders/${table.current_order_id}`);
      }
      return;
    }

    if (table.status === "occupied" && table.current_order_id) {
      navigate(`/orders/${table.current_order_id}`);
      return;
    }

    if (table.status === "available") {
      try {
        const res: any = await tableService.openOrder(table.id);
        const orderId = res?.data?.id ?? res?.id;
        navigate(`/orders/${orderId}`);
      } catch (error) {
        console.error("Failed to open order", error);
        alert("Failed to open order");
      }
    }
  };

  const availableCount = tables.filter((t) => t.status === "available").length;
  const occupiedCount = tables.filter((t) => t.status === "occupied").length;

  if (loading) {
    return (
      <DashboardLayout>
        <p>Loading...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex gap-8">
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-6">Tables</h1>

          <div className="grid grid-cols-4 gap-4">
            {tables.map((table) => {
              const isBlocked =
                role === "cashier" && table.status === "available";

              return (
                <div
                  key={table.id}
                  onClick={() => !isBlocked && handleTableClick(table)}
                  className={`
                    h-36 rounded-2xl shadow transition
                    flex flex-col items-center justify-center text-center
                    ${
                      table.status === "available"
                        ? "bg-white hover:bg-green-50 border border-green-300"
                        : "bg-gray-100 hover:bg-gray-200 border border-gray-300"
                    }
                    ${isBlocked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
                  `}
                >
                  <div className="text-4xl font-bold mb-2">{table.id}</div>

                  <div
                    className={`text-sm font-medium ${
                      table.status === "available"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {table.status}
                  </div>

                  <div className="text-xs text-gray-500 mt-1">
                    {role === "cashier"
                      ? table.status === "occupied"
                        ? "Click to view & close order"
                        : "No active order"
                      : table.status === "available"
                        ? "Click to open order"
                        : "Click to view detail"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-72">
          <div className="bg-white rounded-2xl shadow p-6 h-full flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-6">Quick Stats</h2>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold">{tables.length}</p>
                  <p className="text-xs text-gray-500">Total Tables</p>
                </div>

                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">
                    {availableCount}
                  </p>
                  <p className="text-xs text-gray-500">Available</p>
                </div>

                <div className="bg-red-50 rounded-xl p-4 text-center col-span-2">
                  <p className="text-3xl font-bold text-red-600">
                    {occupiedCount}
                  </p>
                  <p className="text-xs text-gray-500">Occupied</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Occupancy Rate</span>
                  <span>
                    {tables.length === 0
                      ? 0
                      : Math.round((occupiedCount / tables.length) * 100)}
                    %
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-red-500 h-3 rounded-full transition-all"
                    style={{
                      width: `${
                        tables.length === 0
                          ? 0
                          : (occupiedCount / tables.length) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 text-xs text-gray-400 text-center">
              Live table monitoring
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
