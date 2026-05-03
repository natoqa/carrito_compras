import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, CreditCard, Calendar, User, Eye } from 'lucide-react';

const PaymentModal = ({ orderId, amount, onClose, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [cardData, setCardData] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: ''
    });

    const handlePay = async (e) => {
        e.preventDefault();
        setLoading(true);
        const loadingToast = toast.loading('Verificando con el banco (Demo)...');

        try {
            // Simulamos la llamada a nuestro nuevo endpoint de Demo
            await axios.post('/api/checkout/demo-pay', { 
                order_id: orderId,
                card_data: cardData 
            });
            
            toast.success('¡Pago autorizado con éxito!', { id: loadingToast, icon: '✅' });
            onSuccess();
        } catch (err) {
            toast.error('Error en la transacción', { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            
            <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-white w-full max-w-md rounded-[3rem] p-8 shadow-2xl border border-slate-100 overflow-hidden"
            >
                {/* Banner de Modo Demo */}
                <div className="absolute top-0 left-0 w-full bg-amber-500 py-1 text-center">
                    <p className="text-[9px] font-black text-white uppercase tracking-[0.3em]">Ambiente de Pruebas Académicas</p>
                </div>

                <div className="text-center mb-8 mt-4">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                        <ShieldCheck size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Pasarela de Pago Segura</h2>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Monto a pagar: <span className="text-slate-900">${amount}</span></p>
                </div>

                <form onSubmit={handlePay} className="space-y-4">
                    {/* Tarjeta Visual (Estética) */}
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-3xl text-white mb-6 shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                            <CreditCard size={64} />
                        </div>
                        <div className="relative z-10 space-y-8">
                            <div className="flex justify-between items-start">
                                <div className="w-10 h-8 bg-amber-400/20 rounded-md border border-amber-400/30" />
                                <span className="text-xs font-black italic opacity-50">ShopAuto Card</span>
                            </div>
                            <p className="text-lg tracking-[0.2em] font-mono">
                                {cardData.number ? cardData.number.replace(/\d{4}(?=.)/g, '$& ') : '•••• •••• •••• ••••'}
                            </p>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[8px] uppercase tracking-widest opacity-50">Titular</p>
                                    <p className="text-xs font-bold truncate w-40">{cardData.name || 'NOMBRE APELLIDO'}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[8px] uppercase tracking-widest opacity-50">Vence</p>
                                    <p className="text-xs font-bold">{cardData.expiry || 'MM/YY'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="relative">
                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="text" 
                                required
                                placeholder="Número de Tarjeta"
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                onChange={(e) => setCardData({...cardData, number: e.target.value})}
                                maxLength={16}
                            />
                        </div>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input 
                                type="text" 
                                required
                                placeholder="Nombre en la Tarjeta"
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                onChange={(e) => setCardData({...cardData, name: e.target.value.toUpperCase()})}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input 
                                    type="text" 
                                    required
                                    placeholder="MM/YY"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                    onChange={(e) => setCardData({...cardData, expiry: e.target.value})}
                                    maxLength={5}
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input 
                                    type="password" 
                                    required
                                    placeholder="CVC"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                    onChange={(e) => setCardData({...cardData, cvc: e.target.value})}
                                    maxLength={3}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/20 disabled:bg-slate-300 mt-4"
                    >
                        {loading ? 'Procesando Pago...' : `Confirmar Pago $${amount}`}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest pt-2">
                        <Lock size={12} /> Conexión Segura de Prueba
                    </div>
                </form>

                <button 
                    onClick={onClose}
                    className="w-full mt-4 py-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-slate-900 transition-colors"
                >
                    Cancelar y volver
                </button>
            </motion.div>
        </div>
    );
};

export default PaymentModal;
