import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, CreditCard, ShieldCheck, Ticket } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import PaymentModal from '../components/PaymentModal';

const Cart = () => {
    const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
    const [coupon, setCoupon] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showPayment, setShowPayment] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const navigate = useNavigate();

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setIsProcessing(true);
        const loadingToast = toast.loading('Preparando tu orden segura...');
        
        try {
            const items = cart.map(i => ({ product_id: i.id, quantity: i.quantity }));
            const res = await axios.post('/api/orders', { items, coupon_code: coupon });
            
            setCurrentOrderId(res.data.order_id);
            toast.success('Orden lista para pago', { id: loadingToast });
            setShowPayment(true);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error al crear la orden', { id: loadingToast });
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePaymentSuccess = () => {
        setShowPayment(false);
        clearCart();
        navigate('/orders');
    };

    if (cart.length === 0) return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50"
        >
            <div className="mx-auto w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                <ShoppingBag size={40} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Tu bolsa está vacía</h2>
            <p className="text-slate-500 mt-2 font-medium">Parece que aún no has añadido nada a tu colección.</p>
            <button 
                onClick={() => navigate('/')}
                className="mt-8 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-primary transition-all active:scale-95"
            >
                Explorar Catálogo
            </button>
        </motion.div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 space-y-8">
                <div className="flex items-center justify-between px-2">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Mi Bolsa <span className="text-slate-300 ml-2">({cart.length})</span></h1>
                    <button onClick={clearCart} className="text-xs font-bold text-slate-400 hover:text-destructive transition-colors uppercase tracking-widest">Vaciar Todo</button>
                </div>

                <div className="space-y-4">
                    <AnimatePresence mode='popLayout'>
                        {cart.map(item => (
                            <motion.div 
                                key={item.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all flex flex-col sm:flex-row items-center gap-6 group"
                            >
                                <div className="h-32 w-32 rounded-2xl bg-slate-50 overflow-hidden border border-slate-100 flex-shrink-0">
                                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                </div>
                                
                                <div className="flex-grow space-y-1 text-center sm:text-left">
                                    <h3 className="text-lg font-black text-slate-900 group-hover:text-primary transition-colors">{item.name}</h3>
                                    <p className="text-xs font-bold text-primary uppercase tracking-widest">{item.category_name}</p>
                                    <div className="pt-2">
                                        <span className="text-sm font-bold text-slate-400">$</span>
                                        <span className="text-xl font-black text-slate-900">{item.price}</span>
                                    </div>
                                </div>

                                <div className="flex flex-row sm:flex-col items-center justify-between gap-6 w-full sm:w-auto sm:border-l border-slate-100 sm:pl-8">
                                    <div className="flex items-center gap-4 bg-slate-50 rounded-2xl p-1.5 border border-slate-100">
                                        <button 
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="w-10 h-10 flex items-center justify-center bg-white hover:bg-slate-900 hover:text-white rounded-xl transition-all shadow-sm text-slate-600"
                                        >
                                            <Minus size={18} />
                                        </button>
                                        <span className="text-lg font-black text-slate-900 w-6 text-center">{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="w-10 h-10 flex items-center justify-center bg-white hover:bg-slate-900 hover:text-white rounded-xl transition-all shadow-sm text-slate-600"
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Subtotal</p>
                                        <p className="text-xl font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                    <button 
                                        onClick={() => removeFromCart(item.id)}
                                        className="hidden sm:block p-2 text-slate-300 hover:text-destructive transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="lg:col-span-4 sticky top-32"
            >
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-slate-200 space-y-8 overflow-hidden relative">
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/20 blur-[80px] rounded-full" />
                    
                    <h2 className="text-2xl font-black tracking-tight relative z-10">Resumen de Pago</h2>
                    
                    <div className="space-y-4 relative z-10">
                        <div className="flex justify-between items-center text-slate-400 font-bold text-sm uppercase tracking-widest">
                            <span>Subtotal</span>
                            <span className="text-white">${cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-400 font-bold text-sm uppercase tracking-widest">
                            <span>Envío Express</span>
                            <span className="text-emerald-400">Gratis</span>
                        </div>
                        <div className="h-px bg-white/10 my-6" />
                        
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Cupón de Descuento</label>
                            <div className="flex gap-2">
                                <div className="relative flex-grow">
                                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                    <input 
                                        type="text" 
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm font-bold focus:border-primary outline-none transition-all uppercase placeholder:text-slate-600"
                                        placeholder="PROMO2024"
                                        value={coupon}
                                        onChange={(e) => setCoupon(e.target.value)}
                                    />
                                </div>
                                <button className="px-4 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black transition-all">Aplicar</button>
                            </div>
                        </div>

                        <div className="pt-6 flex justify-between items-end">
                            <div>
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-1">Total Final</p>
                                <p className="text-4xl font-black leading-none">${cartTotal.toFixed(2)}</p>
                            </div>
                            <div className="bg-white/10 p-3 rounded-2xl">
                                <ShieldCheck className="text-emerald-400" size={24} />
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleCheckout}
                        disabled={isProcessing}
                        className="w-full py-5 bg-primary text-white rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 disabled:bg-slate-700 disabled:scale-100 group relative z-10"
                    >
                        {isProcessing ? 'Procesando...' : (
                            <>
                                Pagar Ahora <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>

                    <div className="flex items-center justify-center gap-4 text-slate-500 pt-2 relative z-10">
                        <CreditCard size={20} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Pago Encriptado SSL</span>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {showPayment && (
                    <PaymentModal 
                        orderId={currentOrderId} 
                        amount={cartTotal.toFixed(2)} 
                        onClose={() => setShowPayment(false)}
                        onSuccess={handlePaymentSuccess}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default Cart;
