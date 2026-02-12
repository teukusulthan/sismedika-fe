import { api } from "./api";

export interface RestaurantTable {
  id: number;
  name: string;
  status: "available" | "occupied";
  current_order_id?: number | null;
}

export const tableService = {
  async getAll(): Promise<RestaurantTable[]> {
    const res = await api.get("/restaurant-tables");
    return res.data.data ?? res.data;
  },

  async openOrder(tableId: number) {
    const res = await api.post("/orders/open", {
      table_id: tableId,
    });
    return res.data;
  },
};
