import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import ProtectedRoute from "./ProtectedRoute";
import Register from "./pages/register";
import EditTicket from "./components/EditTicket";
import Sidebar from "./components/sidebar";
import AdminTicketEditor from "./pages/AdminTicketBoard";
import CustomerTicketEditor from "./pages/CustomerTicketBoard";

function App() {
  return (
    <Router>
      <Sidebar/>
      <Routes>
          <Route path="/" element={<Login />} />
      </Routes>
      <div className="ml-0 lg:ml-64">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/tickets" element={<ProtectedRoute requiredRole="admin"><AdminTicketEditor /></ProtectedRoute>} />
          <Route path="/ticket" element={<ProtectedRoute requiredRole="customer"><CustomerTicketEditor /></ProtectedRoute>} />
          <Route
            path="/admin-dashboard"
            element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>}
          />
          <Route
            path="/customer-dashboard"
            element={<ProtectedRoute requiredRole="customer"><CustomerDashboard /></ProtectedRoute>}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
