import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Registration from './pages/user/Registration';
import Login from './pages/user/Login';
import Home from './pages/user/Home';
import About from './pages/user/About';
import Collection from './pages/user/Collection';
import Product from './pages/user/Product';
import Contact from './pages/user/Contact';
import Cart from './pages/user/Cart';
import Orders from './pages/user/Orders';
import Wishlist from './pages/user/Wishlist';
import Profile from './pages/user/Profile';
import ProductDetails from './pages/user/ProductDetails';
import CheckOut from './pages/user/CheckOut';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminReturns from './pages/admin/AdminReturns';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReports from './pages/admin/AdminReports';
import AdminInvoice from './pages/admin/AdminInvoice';
import UserReturns from './pages/user/Returns';
import { userDataContext } from './context/user/UserContext';
import { AdminProvider, useAdmin } from './context/admin/AdminContext';


const ProtectedRoute = ({ children }) => {
  const { userData } = useContext(userDataContext);
  return userData ? children : <Navigate to="/login" />;
};


const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdmin();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e4a4bd]"></div>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

const App = () => {
  return (
    <Router>
      <Routes>
        {}
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Registration />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/product' element={<Product />} />
        <Route path='/product-details/:productId' element={<ProductDetails />} />

        {}
        <Route path='/contact' element={<ProtectedRoute><Contact /></ProtectedRoute>} />
        <Route path='/cart' element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path='/orders' element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path='/wishlist' element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path='/checkout' element={<ProtectedRoute><CheckOut /></ProtectedRoute>} />
        <Route path='/returns' element={<ProtectedRoute><UserReturns /></ProtectedRoute>} />

        {}
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin' element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path='/admin/products' element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path='/admin/orders' element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path='/admin/coupons' element={<AdminRoute><AdminCoupons /></AdminRoute>} />
        <Route path='/admin/returns' element={<AdminRoute><AdminReturns /></AdminRoute>} />
        <Route path='/admin/users' element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path='/admin/reports' element={<AdminRoute><AdminReports /></AdminRoute>} />
        <Route path='/admin/invoice/:orderId' element={<AdminRoute><AdminInvoice /></AdminRoute>} />

        {}
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </Router>
  );
};

export default App;

