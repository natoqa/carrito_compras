import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LayoutDashboard, FileText, LogOut, Package, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount, setIsCartOpen } = useCart();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="glass-morphism border-b border-slate-100 sticky top-0 z-50 py-3">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-14">
                    <div className="flex items-center gap-10">
                        <Link to="/" className="flex items-center gap-2.5 group">
                            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                                <Package className="text-white" size={20} />
                            </div>
                            <span className="text-xl font-black text-slate-900 tracking-tighter">ShopAuto</span>
                        </Link>
                        
                        <div className="hidden md:flex items-center gap-6">
                            <NavLink to="/" label="Catálogo" />
                            {(user.role === 'Admin' || user.role === 'Vendedor') && (
                                <>
                                    <NavLink to="/dashboard" label="Dashboard" icon={<LayoutDashboard size={16} />} />
                                    <NavLink to="/inventory" label="Inventario" icon={<Package size={16} />} />
                                    <NavLink to="/reports" label="Reportes" icon={<FileText size={16} />} />
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Cart Toggle Button */}
                        <button 
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-2.5 text-slate-600 hover:bg-slate-50 rounded-2xl transition-all group"
                        >
                            <ShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                            {cartCount > 0 && (
                                <motion.span 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </button>
                        
                        <div className="h-8 w-px bg-slate-100 mx-2" />

                        {/* User Profile Dropdown Placeholder */}
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-900 leading-none">{user.username}</p>
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-1">{user.role}</p>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="p-2.5 text-slate-400 hover:text-destructive hover:bg-destructive/5 rounded-2xl transition-all"
                                title="Cerrar Sesión"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ to, label, icon }) => (
    <Link 
        to={to} 
        className="text-sm font-bold text-slate-500 hover:text-slate-900 flex items-center gap-2 transition-colors py-2 px-1 relative group"
    >
        {icon}
        {label}
        <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
    </Link>
);

export default Navbar;
