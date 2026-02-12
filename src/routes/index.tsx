import { Routes, Route } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import OrderPage from "../pages/OrderPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/orders/:id" element={<OrderPage />} />
    </Routes>
  );
}
