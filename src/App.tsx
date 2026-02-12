import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import { useAuthStore } from "./store/auth.store";
import AppRoutes from "./routes";

function App() {
  const token = useAuthStore((state) => state.token);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/*"
        element={token ? <AppRoutes /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;
