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
      fetchOrder(); // refresh order
    } catch (error) {
      console.error("Failed to add item", error);
      alert("Failed to add item");
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
      <h1 className="text-2xl font-bold mb-4">Order #{order.id}</h1>

      <p>Status: {order.status}</p>
      <p className="mb-4 font-semibold">Total: Rp {total.toLocaleString()}</p>

      {order.status === "open" && (
        <button
          onClick={handleCloseOrder}
          className="mb-6 bg-red-600 text-white px-4 py-2 rounded"
        >
          Close Order
        </button>
      )}

      <h2 className="text-xl font-semibold mb-2">Items</h2>

      {order.items.length === 0 && <p>No items yet</p>}

      {order.items.map((item) => (
        <div key={item.id} className="border p-3 mb-2 rounded bg-white">
          {item.food.name} x {item.quantity}
          <span className="float-right">
            Rp {(item.quantity * item.food.price).toLocaleString()}
          </span>
        </div>
      ))}

      {/* ADD ITEM */}
      {order.status === "open" && (
        <div className="mt-8 border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Add Item</h2>

          <select
            className="border p-2 mr-2"
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
            className="border p-2 mr-2 w-20"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />

          <button
            disabled={!selectedFood}
            onClick={handleAddItem}
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Add
          </button>
        </div>
      )}
    </DashboardLayout>
  );
}
