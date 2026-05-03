import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Clock, CheckCircle2, Package, User, Mail, Calendar, 
    ArrowLeft, ExternalLink, MapPin, Truck 
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await axios.get(`/api/orders/${id}`);
                setOrder(res.data);
            } catch (err) {
                toast.error('Error al cargar detalles de la orden');
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const updateStatus = async (newStatus) => {
        try {
            await axios.patch(`/api/orders/${id}/status`, { status: newStatus });
            setOrder({ ...order, status: newStatus });
            toast.success(`Estado actualizado a ${newStatus}`);
        } catch (err) {
            toast.error('Error al actualizar estado');
        }
    };

    if (loading) return <div className="animate-pulse h-96 bg-slate-100 rounded-[2.5rem]" />;
    if (!order) return <div>No se encontró la orden.</div>;

    const timeline = [
        { status: 'pendiente', icon: <Clock />, label: 'Orden Recibida', color: 'text-amber-500' },
        { status: 'procesando', icon: <Package />, label: 'En Preparación', color: 'text-blue-500' },
        { status: 'completado', icon: <CheckCircle2 />, label: 'Entregado', color: 'text-emerald-500' }
    ];

    const currentStep = timeline.findIndex(t => t.status === order.status);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
        >
            <button 
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-xs uppercase tracking-widest transition-colors"
            >
                <ArrowLeft size={16} /> Volver a Listado
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Order Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 subtle-shadow">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tighter">Orden #ORD-{order.id}</h1>
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1 flex items-center gap-2">
                                    <Calendar size={14} /> {new Date(order.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            <div className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest ${
                                order.status === 'completado' ? 'bg-emerald-50 text-emerald-600' : 
                                order.status === 'pendiente' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                            }`}>
                                {order.status}
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="relative flex justify-between mb-16 px-10">
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2" />
                            {timeline.map((step, idx) => (
                                <div key={step.status} className="relative z-10 flex flex-col items-center">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-white shadow-lg transition-all ${
                                        idx <= currentStep ? 'bg-primary text-white scale-110' : 'bg-slate-100 text-slate-400'
                                    }`}>
                                        {React.cloneElement(step.icon, { size: 20 })}
                                    </div>
                                    <span className={`absolute -bottom-8 whitespace-nowrap text-[10px] font-black uppercase tracking-widest ${
                                        idx <= currentStep ? 'text-slate-900' : 'text-slate-300'
                                    }`}>
                                        {step.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Order Items */}
                        <div className="space-y-4">
                            <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6">Productos Detallados</h3>
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
                                    <div className="h-16 w-16 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className="font-bold text-slate-900">{item.name}</h4>
                                        <p className="text-xs text-slate-400 font-medium">{item.quantity} unidades x ${item.unit_price}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-slate-900">${(item.quantity * item.unit_price).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Customer & Actions */}
                <div className="space-y-8">
                    <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200">
                        <h3 className="font-black uppercase tracking-widest text-[10px] text-slate-500 mb-6">Información del Cliente</h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="bg-white/10 p-3 rounded-2xl text-primary">
                                    <User size={20} />
                                </div>
                                <div>
                                    <p className="text-sm font-black">{order.customer_name}</p>
                                    <p className="text-[10px] font-bold text-slate-500 tracking-wider">Customer ID: #{order.customer_id}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="bg-white/10 p-3 rounded-2xl text-blue-400">
                                    <Mail size={20} />
                                </div>
                                <p className="text-sm font-bold text-slate-300">{order.customer_email}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="bg-white/10 p-3 rounded-2xl text-emerald-400">
                                    <MapPin size={20} />
                                </div>
                                <p className="text-sm font-bold text-slate-300">New York, NY 10001, USA</p>
                            </div>
                        </div>

                        <div className="mt-10 pt-10 border-t border-white/5">
                            <h3 className="font-black uppercase tracking-widest text-[10px] text-slate-500 mb-4">Resumen Financiero</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-xs font-bold text-slate-400">
                                    <span>Subtotal</span>
                                    <span>${(Number(order.total_amount) + Number(order.discount_amount)).toFixed(2)}</span>
                                </div>
                                {order.coupon_code && (
                                    <div className="flex justify-between text-xs font-bold text-emerald-400">
                                        <span>Descuento ({order.coupon_code})</span>
                                        <span>-${Number(order.discount_amount).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-black pt-2">
                                    <span>Total</span>
                                    <span className="text-primary">${Number(order.total_amount).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Admin Actions */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 subtle-shadow">
                        <h3 className="font-black uppercase tracking-widest text-[10px] text-slate-400 mb-6">Acciones Administrativas</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {order.status !== 'procesando' && (
                                <button 
                                    onClick={() => updateStatus('procesando')}
                                    className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                                >
                                    Marcar en Preparación
                                </button>
                            )}
                            {order.status !== 'completado' && (
                                <button 
                                    onClick={() => updateStatus('completado')}
                                    className="w-full py-3 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all"
                                >
                                    Marcar como Entregado
                                </button>
                            )}
                            <button className="w-full py-3 bg-slate-50 text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                                <Truck size={14} /> Ver Tracking
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default OrderDetails;
