import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ShoppingCart, Tag, Star, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

const Catalog = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('All');
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`/api/products?search=${search}${category !== 'All' ? `&category=${category}` : ''}`);
                setProducts(res.data);
            } catch (err) {
                toast.error('Error al cargar el catálogo');
            } finally {
                setLoading(false);
            }
        };
        const timer = setTimeout(fetchProducts, 300);
        return () => clearTimeout(timer);
    }, [search, category]);

    const categories = ['All', 'Audio Pro', 'Computación', 'Lifestyle', 'Hogar Inteligente'];

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
        >
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 px-8 py-16 text-white sm:px-16 sm:py-24 lg:py-32 shadow-2xl shadow-slate-200">
                <div className="relative z-10 max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6 border border-primary/20"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Nueva Colección 2024
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-5xl font-black tracking-tighter sm:text-7xl leading-[0.9]"
                    >
                        Define tu <br /> <span className="text-primary italic">Estilo Pro</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 text-lg text-slate-400 font-medium max-w-md leading-relaxed"
                    >
                        Equipamiento de alto rendimiento seleccionado por expertos para los creadores del mañana.
                    </motion.p>
                </div>
                <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-primary/20 blur-[100px]" />
                <div className="absolute -bottom-20 left-20 h-96 w-96 rounded-full bg-blue-500/10 blur-[100px]" />
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between sticky top-24 z-40 bg-slate-50/80 backdrop-blur-md py-4 -mx-4 px-4">
                <div className="flex flex-wrap items-center gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 border ${
                                category === cat 
                                ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-200 scale-105' 
                                : 'bg-white text-slate-500 hover:bg-slate-50 border-slate-200'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                
                <div className="relative w-full lg:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-[1.25rem] outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-medium subtle-shadow"
                        placeholder="Buscar tecnología, marca..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Product Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="animate-pulse space-y-4">
                            <div className="h-72 bg-slate-200 rounded-[2rem]" />
                            <div className="h-4 bg-slate-200 rounded-full w-2/3" />
                            <div className="h-4 bg-slate-200 rounded-full w-1/2" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <AnimatePresence>
                        {products.map((product, idx) => (
                            <motion.div 
                                key={product.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                                className="group relative bg-white rounded-[2.25rem] border border-slate-100 p-3.5 hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-500"
                            >
                                <div className="relative h-72 overflow-hidden rounded-[1.75rem] bg-slate-50">
                                    {product.image_url ? (
                                        <img 
                                            src={product.image_url} 
                                            alt={product.name} 
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <Tag size={48} />
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        <div className="glass-morphism px-3 py-1.5 rounded-xl text-[9px] font-black text-slate-900 uppercase tracking-[0.2em] border border-white/50 shadow-sm">
                                            {product.category_name}
                                        </div>
                                        {product.stock <= product.min_stock_alert && (
                                            <div className="bg-destructive/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-destructive/20">
                                                Last Units
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-4 right-4 translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="bg-white/90 backdrop-blur-md p-2 rounded-xl border border-white/50 shadow-xl flex items-center gap-1.5 text-amber-500">
                                            <Star size={12} fill="currentColor" />
                                            <span className="text-[10px] font-black text-slate-900">4.9</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="mt-5 px-2 pb-2">
                                    <h3 className="font-black text-slate-900 text-lg tracking-tight group-hover:text-primary transition-colors truncate">
                                        {product.name}
                                    </h3>
                                    <p className="mt-1.5 text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed h-8">
                                        {product.description || 'Experiencia tecnológica premium garantizada.'}
                                    </p>
                                    
                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Price</span>
                                            <span className="text-2xl font-black text-slate-900 mt-1">${product.price}</span>
                                        </div>
                                        <button 
                                            onClick={() => addToCart(product)}
                                            className="flex items-center justify-center bg-slate-900 text-white w-14 h-14 rounded-2xl hover:bg-primary hover:scale-110 active:scale-95 transition-all duration-300 shadow-xl shadow-slate-200 group/btn"
                                        >
                                            <ShoppingCart size={22} className="group-hover/btn:-rotate-12 transition-transform" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Empty State */}
            {!loading && products.length === 0 && (
                <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                    <div className="mx-auto w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                        <Search size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Sin resultados</h3>
                    <p className="text-slate-500 mt-2 font-medium">Intenta con otros términos o limpia los filtros.</p>
                </div>
            )}
        </motion.div>
    );
};

export default Catalog;
