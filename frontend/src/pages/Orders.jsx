import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await axios.get('/api/orders');
                setOrders(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pendiente': return <Clock className="text-yellow-500" size={18} />;
            case 'completado': return <CheckCircle className="text-green-500" size={18} />;
            case 'cancelado': return <XCircle className="text-red-500" size={18} />;
            default: return <Package className="text-blue-500" size={18} />;
        }
    };

    if (loading) return <div>Cargando historial...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Mis Órdenes</h1>
            
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="px-6 py-4 font-semibold text-gray-600">ID Orden</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Fecha</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Total</th>
                            <th className="px-6 py-4 font-semibold text-gray-600">Estado</th>
                            <th className="px-6 py-4 font-semibold text-gray-600 text-right">Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-800">#ORD-{order.id}</td>
                                <td className="px-6 py-4 text-gray-600">{new Date(order.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 font-bold text-gray-800">${Number(order.total_amount).toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2 capitalize">
                                        {getStatusIcon(order.status)}
                                        <span className="text-sm font-medium">{order.status}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Link 
                                        to={`/orders/${order.id}`}
                                        className="text-primary hover:underline text-xs font-black uppercase tracking-widest"
                                    >
                                        Ver Detalle
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Orders;
