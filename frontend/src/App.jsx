import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Home from './pages/Home';
import About from './pages/About';
import Collection from './pages/Collection';
import Product from './pages/Product';
import Contact from './pages/Contact';
import Cart from './pages/Cart'; // Assuming you have this page
import Orders from './pages/Orders'; // Assuming you have this page
import { userDataContext } from './context/UserContext';
import ProductDetails from './pages/ProductDetails';
import CheckOut from './pages/CheckOut';

const App = () => {
  const { userData } = useContext(userDataContext);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<Registration />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/collection' element={<Collection />} />
        <Route path='/product' element={<Product />} />
        <Route path='/product-details/:productId' element={<ProductDetails />} />

        {/* Protected routes (only accessible if logged in) */}
        <Route path='/contact' element={userData ? <Contact /> : <Navigate to="/login" />} />
        <Route path='/cart' element={userData ? <Cart /> : <Navigate to="/login" />} />
        <Route path='/orders' element={userData ? <Orders /> : <Navigate to="/login" />} />
        <Route path='/ckeckout' element={userData ? <CheckOut /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
