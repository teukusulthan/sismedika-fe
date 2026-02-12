import { api } from "./api";

export interface Food {
  id: number;
  name: string;
  price: number;
  category: string;
}

export const foodService = {
  async getAll(): Promise<Food[]> {
    const response = await api.get("/foods");
    return response.data.data ?? response.data;
  },
};
