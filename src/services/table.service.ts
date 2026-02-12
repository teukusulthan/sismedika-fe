import { api } from "./api";

export interface RestaurantTable {
  id: number;
  name: string;
  status: string;
}

export interface Order {
  data: any;
  id: number;
  table_id: number;
  status: string;
  total_price: number;
}

export const tableService = {
  async getAll(): Promise<RestaurantTable[]> {
    const response = await api.get("/restaurant-tables");
    return response.data;
  },

  async openOrder(tableId: number): Promise<Order> {
    const response = await api.post("/orders/open", {
      table_id: tableId,
    });
    return response.data;
  },
};
