import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import LoginForm from "./components/auth/LoginForm";
import AdminDashboard from "./components/dashboard/AdminDashboard";
import ECOfficerDashboard from "./components/dashboard/ECOfficerDashboard";
import UserDashboard from "./components/dashboard/UserDashboard";

function App() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-purple-900">
          <div className="text-white text-xl font-semibold animate-pulse">
            Loading...
          </div>
        </div>
      }
    >
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route
            path="/ec-officer-dashboard"
            element={<ECOfficerDashboard />}
          />
        </Routes>
      </>
    </Suspense>
  );
}

export default App;
