import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "../pages/LandingPage/LandingPage";
import SignUp from "../pages/Auth/SignUp";
import Login from "../pages/Auth/Login";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Dashboard from "../pages/Dashboard/Dashboard";
import AllInvoices from "../pages/Invoices/AllInvoices";
import CreateInvoices from "../pages/Invoices/CreateInvoices";
import InvoiceDetail from "../pages/Invoices/InvoiceDetail";
import ProfilePage from "../pages/Profile/ProfilePage";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/invoices" element={<AllInvoices />} />
          <Route path="/invoices/new" element={<CreateInvoices />} />
          <Route path="/invoices/:id" element={<InvoiceDetail />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route />

          {/* Catch All Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      <Toaster
        toastOptions={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </div>
  );
};

export default App;
