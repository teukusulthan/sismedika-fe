import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import { orderService, OrderDetail } from "../services/order.service";
import { foodService, Food } from "../services/food.service";

export default function OrderPage() {
  const { id } = useParams();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [foods, setFoods] = useState<Food[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      const orderData = await orderService.getById(id);
      const foodData = await foodService.getAll();
      setOrder(orderData);
      setFoods(foodData);
    };

    fetchData();
  }, [id]);

  const handleAddItem = async (foodId: number) => {
    if (!id) return;
    await orderService.addItem(id, foodId, 1);
    const updated = await orderService.getById(id);
    setOrder(updated);
  };

  const handleClose = async () => {
    if (!id) return;
    await orderService.close(id);
    const updated = await orderService.getById(id);
    setOrder(updated);
  };

  if (!order) return <DashboardLayout>Loading...</DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Order #{order.id}</h1>

      <div className="mb-6">
        <p>Status: {order.status}</p>
        <p>Total: Rp {order.total_price}</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {foods.map((food) => (
          <div key={food.id} className="border p-3 rounded bg-white">
            <h3>{food.name}</h3>
            <p>Rp {food.price}</p>
            {order.status === "open" && (
              <button
                onClick={() => handleAddItem(food.id)}
                className="mt-2 bg-black text-white px-3 py-1 rounded w-full"
              >
                Add
              </button>
            )}
          </div>
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-2">Items</h2>

      <div className="space-y-2 mb-6">
        {order?.items?.length > 0 ? (
          order.items.map((item) => (
            <div key={item.id}>
              {item.food.name} - {item.quantity}
            </div>
          ))
        ) : (
          <p>No items yet</p>
        )}
      </div>

      {order.status === "open" && (
        <button
          onClick={handleClose}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Close Order
        </button>
      )}
    </DashboardLayout>
  );
}
