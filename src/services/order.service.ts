import { api } from "./api";

export interface OrderItem {
  id: number;
  food_id: number;
  quantity: number;
  subtotal: number;
  food: {
    id: number;
    name: string;
    price: number;
  };
}

export interface OrderDetail {
  id: number;
  table_id: number;
  status: string;
  total_price: number;
  items: OrderItem[];
}

export const orderService = {
  async getById(id: string): Promise<OrderDetail> {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  async addItem(orderId: string, foodId: number, quantity: number) {
    const response = await api.post(`/orders/${orderId}/items`, {
      food_id: foodId,
      quantity,
    });
    return response.data;
  },

  async close(orderId: string) {
    const response = await api.post(`/orders/${orderId}/close`);
    return response.data;
  },
};
