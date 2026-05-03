import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const MiniCart = () => {
    const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
    const navigate = useNavigate();

    // Auto-close after 5 seconds if not hovered
    useEffect(() => {
        if (isCartOpen) {
            const timer = setTimeout(() => {
                setIsCartOpen(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isCartOpen, cartCount]); // Re-run when items are added

    return (
        <AnimatePresence>
            {isCartOpen && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className="fixed bottom-6 right-6 w-[380px] max-h-[500px] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[100] border border-slate-100 flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-5 flex items-center justify-between border-b border-slate-50 bg-slate-50/50">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary text-white p-1.5 rounded-lg">
                                <ShoppingBag size={14} />
                            </div>
                            <span className="text-sm font-black text-slate-900 uppercase tracking-tight">Carrito ({cartCount})</span>
                        </div>
                        <button 
                            onClick={() => setIsCartOpen(false)}
                            className="p-1.5 hover:bg-slate-200 rounded-full transition-colors text-slate-400"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {cart.length === 0 ? (
                            <div className="py-10 text-center">
                                <p className="text-sm font-bold text-slate-400">Tu carrito está vacío</p>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <motion.div 
                                    key={item.id}
                                    layout
                                    className="flex gap-3 items-center group"
                                >
                                    <div className="h-16 w-16 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 flex-shrink-0">
                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-grow min-w-0">
                                        <h3 className="font-bold text-slate-900 text-xs truncate">{item.name}</h3>
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-[10px] font-black text-primary">${item.price}</p>
                                            <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="hover:text-primary transition-colors"><Minus size={10} /></button>
                                                <span className="text-[10px] font-black w-3 text-center">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="hover:text-primary transition-colors"><Plus size={10} /></button>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => removeFromCart(item.id)}
                                        className="p-2 text-slate-200 hover:text-destructive transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {cart.length > 0 && (
                        <div className="p-5 border-t border-slate-50 bg-white">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</span>
                                <span className="text-lg font-black text-slate-900">${cartTotal.toFixed(2)}</span>
                            </div>
                            <button 
                                onClick={() => {
                                    setIsCartOpen(false);
                                    navigate('/cart');
                                }}
                                className="w-full py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-lg shadow-slate-200 active:scale-[0.98]"
                            >
                                Finalizar Compra <ArrowRight size={14} />
                            </button>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MiniCart;
