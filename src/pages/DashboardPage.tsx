import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { tableService } from "../services/table.service";

interface Table {
  id: number;
  name: string;
  status: string;
}

export default function DashboardPage() {
  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    const fetchTables = async () => {
      const data = await tableService.getAll();
      setTables(data.data ?? data);
    };
    fetchTables();
  }, []);

  const handleOpenOrder = async (tableId: number) => {
    await tableService.openOrder(tableId);
    alert("Order opened successfully");
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
