import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { CustomerDetail } from './pages/CustomerDetail';
import { AppointmentList } from './pages/AppointmentList';
import { CustomerList } from './pages/CustomerList';
import { Dashboard } from './pages/Dashboard';
import { EstimateDetail } from './pages/EstimateDetail';
import { EstimateList } from './pages/EstimateList';
import { EstimatePrint } from './pages/EstimatePrint';
import { InvoiceDetail } from './pages/InvoiceDetail';
import { InvoiceList } from './pages/InvoiceList';
import { InvoicePrint } from './pages/InvoicePrint';
import { Login } from './pages/Login';
import { Profile } from './pages/Profile';
import { WorkOrderDetail } from './pages/WorkOrderDetail';
import { NewWorkOrder } from './pages/NewWorkOrder';
import { WorkOrderList } from './pages/WorkOrderList';

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="py-20 text-center text-gray-400">Cargando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/work-orders"
        element={
          <PrivateRoute>
            <WorkOrderList />
          </PrivateRoute>
        }
      />
      <Route
        path="/work-orders/:id"
        element={
          <PrivateRoute>
            <WorkOrderDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/work-orders/new"
        element={
          <PrivateRoute>
            <NewWorkOrder />
          </PrivateRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <PrivateRoute>
            <AppointmentList />
          </PrivateRoute>
        }
      />
      <Route
        path="/customers"
        element={
          <PrivateRoute>
            <CustomerList />
          </PrivateRoute>
        }
      />
      <Route
        path="/customers/:id"
        element={
          <PrivateRoute>
            <CustomerDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/estimates"
        element={
          <PrivateRoute>
            <EstimateList />
          </PrivateRoute>
        }
      />
      <Route
        path="/estimates/:id"
        element={
          <PrivateRoute>
            <EstimateDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/estimates/:id/print"
        element={
          <PrivateRoute>
            <EstimatePrint />
          </PrivateRoute>
        }
      />
      <Route
        path="/invoices"
        element={
          <PrivateRoute>
            <InvoiceList />
          </PrivateRoute>
        }
      />
      <Route
        path="/invoices/:id"
        element={
          <PrivateRoute>
            <InvoiceDetail />
          </PrivateRoute>
        }
      />
      <Route
        path="/invoices/:id/print"
        element={
          <PrivateRoute>
            <InvoicePrint />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
