import { Routes, Route, Navigate } from "react-router-dom";
import WetlandsApp from "./WetlandsApp";
import LoginPage from "./LoginPage";
import AdminPanel from "./AdminPanel";
import PrivateRoute from "./PrivateRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <WetlandsApp />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute adminOnly={true}>
            <AdminPanel />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
