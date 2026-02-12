import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { tableService, RestaurantTable } from "../services/table.service";

export default function DashboardPage() {
  const [tables, setTables] = useState<RestaurantTable[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const data = await tableService.getAll();
        setTables(data);
      } catch (error) {
        console.error("Failed to fetch tables", error);
      }
    };

    fetchTables();
  }, []);

  const handleOpenOrder = async (tableId: number) => {
    try {
      const order = await tableService.openOrder(tableId);
      navigate(`/orders/${order.id}`);
    } catch (error) {
      console.error("Failed to open order", error);
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Tables</h1>

      <div className="grid grid-cols-3 gap-4">
        {tables.map((table) => (
          <div key={table.id} className="border rounded p-4 bg-white shadow">
            <h2 className="font-semibold">{table.name}</h2>

            <p
              className={
                table.status === "available" ? "text-green-600" : "text-red-600"
              }
            >
              {table.status}
            </p>

            {table.status === "available" && (
              <button
                onClick={() => handleOpenOrder(table.id)}
                className="mt-3 bg-black text-white px-3 py-2 rounded w-full"
              >
                Open Order
              </button>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
