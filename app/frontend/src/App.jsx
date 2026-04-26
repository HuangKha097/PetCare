import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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
import ProtectedRoute from './components/ProtectedRoute';
import { loadUser } from './store/slices/authSlice';
import { fetchCart } from './store/slices/cartSlice';
import { fetchWishlist } from './store/slices/wishlistSlice';

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
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/cart" element={
                            <ProtectedRoute>
                                <Cart />
                            </ProtectedRoute>
                        } />
                        <Route path="/account" element={
                            <ProtectedRoute>
                                <Account />
                            </ProtectedRoute>
                        } />
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                        <Route path="/search" element={<Search />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:id" element={<BlogDetail />} />
                    </Routes>
                </main>
                <Footer />
                <MobileNav />
                <ScrollToTopBtn />
            </div>
        </Router>
    );
}

export default App;
