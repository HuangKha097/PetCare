import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Footer from './components/Footer';
import MobileNav from './components/MobileNav';
import ScrollToTopBtn from './components/ScrollToTopBtn';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Login from './pages/Login';
import Cart from './pages/Cart';
import Categories from './pages/Categories';
import ProductDetail from './pages/ProductDetail';
import Search from './pages/Search';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Account from './pages/Account';
import OurStory from './pages/OurStory';
import FAQ from './pages/FAQ';
import ContactUs from './pages/ContactUs';
import DoctorDetail from './pages/DoctorDetail';
import ProtectedRoute from './components/ProtectedRoute';
import { loadUser } from './store/slices/authSlice';
import { fetchCart } from './store/slices/cartSlice';
import { fetchWishlist } from './store/slices/wishlistSlice';

// Admin Imports
import AdminLayout from './admin/layout/AdminLayout';
import AdminProtectedRoute from './admin/components/AdminProtectedRoute';
import Dashboard from './admin/pages/Dashboard';
import ProductManagement from './admin/pages/ProductManagement';
import ProductForm from './admin/pages/ProductForm';
import OrderManagement from './admin/pages/OrderManagement';
import InventoryMonitoring from './admin/pages/InventoryMonitoring';
import UserManagement from './admin/pages/UserManagement';
import InquiryManagement from './admin/pages/InquiryManagement';

const UserLayout = () => {
    const { user, isAuthenticated } = useSelector((state) => state.auth);

    // Redirect admin trying to access user pages
    if (isAuthenticated && user?.role === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
            <MobileNav />
            <ScrollToTopBtn />
        </div>
    );
};

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            dispatch(loadUser());
            dispatch(fetchCart());
            dispatch(fetchWishlist());
        }
    }, [dispatch]);

    return (
        <Router>
            <ScrollToTop />
            <Routes>
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="products" element={<ProductManagement />} />
                    <Route path="products/add" element={<ProductForm />} />
                    <Route path="products/edit/:id" element={<ProductForm />} />
                    <Route path="orders" element={<OrderManagement />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="inventory" element={<InventoryMonitoring />} />
                    <Route path="inquiries" element={<InquiryManagement />} />
                </Route>

                {/* User Routes */}
                <Route path="/" element={<UserLayout />}>
                    <Route index element={<Home />} />
                    <Route path="shop" element={<Shop />} />
                    <Route path="login" element={<Login />} />
                    <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="product/:id" element={<ProductDetail />} />
                    <Route path="search" element={<Search />} />
                    <Route path="blog" element={<Blog />} />
                    <Route path="blog/:id" element={<BlogDetail />} />
                    <Route path="our-story" element={<OurStory />} />
                    <Route path="faq" element={<FAQ />} />
                    <Route path="contact" element={<ContactUs />} />
                    <Route path="doctor/:id" element={<DoctorDetail />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
