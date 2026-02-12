import { api } from "./api";

export const tableService = {
  async getAll() {
    const response = await api.get("/restaurant-tables");
    return response.data;
  },

  async openOrder(tableId: number) {
    const response = await api.post("/orders/open", {
      table_id: tableId,
    });
    return response.data;
  },
};
