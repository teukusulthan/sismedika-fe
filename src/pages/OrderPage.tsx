import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { api } from "../services/api";

interface Food {
  id: number;
  name: string;
  price: number;
}

interface OrderItem {
  id: number;
  quantity: number;
  food: Food;
}

interface Order {
  id: number;
  status: string;
  items: OrderItem[];
}

export default function OrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedFood, setSelectedFood] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data.data);
    } catch (error) {
      console.error("Failed to fetch order", error);
    }
  };

  const fetchFoods = async () => {
    try {
      const res = await api.get("/foods");
      setFoods(res.data.data ?? res.data);
    } catch (error) {
      console.error("Failed to fetch foods", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchOrder(), fetchFoods()]);
      setLoading(false);
    };
    init();
  }, [id]);

  const handleAddItem = async () => {
    if (!selectedFood) return;

    try {
      await api.post(`/orders/${id}/items`, {
        food_id: selectedFood,
        quantity,
      });

      setQuantity(1);
      setSelectedFood(null);
      fetchOrder();
    } catch (error) {
      console.error("Failed to add item", error);
      alert("Failed to add item");
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await api.delete(`/orders/${id}/items/${itemId}`);
      fetchOrder();
    } catch (error) {
      console.error("Failed to remove item", error);
      alert("Failed to remove item");
    }
  };

  const handleCloseOrder = async () => {
    try {
      await api.post(`/orders/${id}/close`);
      alert("Order closed successfully");
      navigate("/");
    } catch (error) {
      console.error("Failed to close order", error);
      alert("Failed to close order");
    }
  };

  const total =
    order?.items?.reduce(
      (sum, item) => sum + item.quantity * item.food.price,
      0,
    ) ?? 0;

  if (loading) {
    return (
      <DashboardLayout>
        <p>Loading...</p>
      </DashboardLayout>
    );
  }

  if (!order) {
    return (
      <DashboardLayout>
        <p>Order not found</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex gap-8">
        {/* LEFT SIDE - ORDER DETAIL */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold">Order #{order.id}</h1>
                <p className="text-sm text-gray-500">
                  Status:{" "}
                  <span
                    className={`font-medium ${
                      order.status === "open"
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {order.status}
                  </span>
                </p>
              </div>

              {order.status === "open" && (
                <button
                  onClick={handleCloseOrder}
                  className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition"
                >
                  Close Order
                </button>
              )}
            </div>

            <h2 className="text-lg font-semibold mb-4">Items</h2>

            {order.items.length === 0 && (
              <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                No items yet
              </div>
            )}

            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-xl"
                >
                  <div>
                    <div className="font-medium">{item.food.name}</div>
                    <div className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="font-semibold">
                      Rp {(item.quantity * item.food.price).toLocaleString()}
                    </div>

                    {order.status === "open" && (
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {order.status === "open" && (
              <div className="mt-8 border-t pt-6">
                <h2 className="text-lg font-semibold mb-4">Add Item</h2>

                <div className="flex gap-3">
                  <select
                    className="border rounded-lg p-2 flex-1"
                    value={selectedFood ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedFood(value ? Number(value) : null);
                    }}
                  >
                    <option value="">Select food</option>
                    {foods.map((food) => (
                      <option key={food.id} value={food.id}>
                        {food.name} - Rp {food.price.toLocaleString()}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min={1}
                    className="border rounded-lg p-2 w-24"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                  />

                  <button
                    disabled={!selectedFood}
                    onClick={handleAddItem}
                    className="bg-black hover:bg-gray-800 text-white px-5 py-2 rounded-lg disabled:opacity-50 transition"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE - SUMMARY */}
        <div className="w-80">
          <div className="bg-white rounded-2xl shadow p-6 h-full flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-6">Summary</h2>

              <div className="flex justify-between text-sm mb-2">
                <span>Total Items</span>
                <span>{order.items.length}</span>
              </div>

              <div className="flex justify-between text-sm mb-6">
                <span>Total Amount</span>
                <span className="font-bold text-lg">
                  Rp {total.toLocaleString()}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div
                  className="bg-green-500 h-3 rounded-full transition-all"
                  style={{
                    width: total === 0 ? "0%" : "100%",
                  }}
                />
              </div>
            </div>

            <div className="text-xs text-gray-400 text-center mt-6">
              Order monitoring panel
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
