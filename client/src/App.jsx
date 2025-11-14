import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/admin/AdminPage';
import ProductCreatePage from './pages/admin/ProductCreatePage';
import ProductEditPage from './pages/admin/ProductEditPage';
import ProductManagePage from './pages/admin/ProductManagePage';
import OrderManagePage from './pages/admin/OrderManagePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import OrderPage from './pages/OrderPage';
import OrderCompletePage from './pages/OrderCompletePage';
import OrderListPage from './pages/OrderListPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/products" element={<ProductManagePage />} />
        <Route path="/admin/products/register" element={<ProductCreatePage />} />
        <Route path="/admin/products/edit/:id" element={<ProductEditPage />} />
        <Route path="/admin/orders" element={<OrderManagePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/order/complete" element={<OrderCompletePage />} />
        <Route path="/orders" element={<OrderListPage />} />
      </Routes>
    </Router>
  );
}

export default App;
