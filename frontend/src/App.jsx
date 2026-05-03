import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InventoryCMS from './pages/InventoryCMS';
import Catalog from './pages/Catalog';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Reports from './pages/Reports';
import Navbar from './components/Navbar';
import MiniCart from './components/MiniCart';

const PrivateRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );
    if (!user) return <Navigate to="/login" />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
    return children;
};

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <div className="min-h-screen bg-slate-50 flex flex-col w-full font-sans selection:bg-primary/10 selection:text-primary">
                        <Toaster 
                            position="top-right"
                            toastOptions={{
                                className: 'subtle-shadow border border-slate-100 rounded-xl font-medium',
                                duration: 3000,
                            }}
                        />
                        <Navbar />
                        <MiniCart />
                        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                            <AnimatePresence mode="wait">
                                <Routes>
                                    <Route path="/login" element={<Login />} />
                                    
                                    <Route path="/" element={
                                        <PrivateRoute>
                                            <Catalog />
                                        </PrivateRoute>
                                    } />
                                    
                                    <Route path="/cart" element={
                                        <PrivateRoute>
                                            <Cart />
                                        </PrivateRoute>
                                    } />

                                    <Route path="/orders" element={
                                        <PrivateRoute>
                                            <Orders />
                                        </PrivateRoute>
                                    } />

                                    <Route path="/orders/:id" element={
                                        <PrivateRoute>
                                            <OrderDetails />
                                        </PrivateRoute>
                                    } />

                                    <Route path="/dashboard" element={
                                <PrivateRoute roles={['Admin', 'Vendedor']}>
                                    <Dashboard />
                                </PrivateRoute>
                            } />

                            <Route path="/inventory" element={
                                <PrivateRoute roles={['Admin', 'Vendedor']}>
                                    <InventoryCMS />
                                </PrivateRoute>
                            } />

                                    <Route path="/reports" element={
                                        <PrivateRoute roles={['Admin', 'Vendedor']}>
                                            <Reports />
                                        </PrivateRoute>
                                    } />
                                </Routes>
                            </AnimatePresence>
                        </main>
                    </div>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
