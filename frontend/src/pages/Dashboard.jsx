import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { 
    TrendingUp, ShoppingBag, Users, DollarSign, 
    ArrowUpRight, ArrowDownRight, Activity, Target 
} from 'lucide-react';
import toast from 'react-hot-toast';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('/api/reports/dashboard');
                setStats(res.data);
            } catch (err) {
                toast.error('Error al cargar métricas');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
    );

    const kpiData = [
        { label: 'Revenue', value: `$${Number(stats.kpis.total_revenue).toLocaleString()}`, icon: <DollarSign />, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12.5%' },
        { label: 'Orders', value: stats.kpis.total_orders, icon: <ShoppingBag />, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+5.2%' },
        { label: 'Avg Ticket', value: `$${Number(stats.kpis.avg_order_value).toFixed(2)}`, icon: <Activity />, color: 'text-amber-600', bg: 'bg-amber-50', trend: '-2.1%' },
        { label: 'Efficiency', value: `${(Number(stats.stats.mean) / 10).toFixed(1)}%`, icon: <Target />, color: 'text-purple-600', bg: 'bg-purple-50', trend: '+0.8%' },
    ];

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-10"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Executive Overview</h1>
                    <p className="text-slate-500 mt-1 font-medium">Real-time performance analytics and insights.</p>
                </div>
                <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl subtle-shadow border border-slate-100">
                    <button className="px-4 py-2 text-sm font-bold bg-slate-900 text-white rounded-xl shadow-lg shadow-slate-200">Today</button>
                    <button className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">Weekly</button>
                    <button className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">Monthly</button>
                </div>
            </div>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map((kpi, idx) => (
                    <motion.div 
                        key={kpi.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-6 rounded-[2rem] border border-slate-100 subtle-shadow group hover:border-primary/20 transition-all"
                    >
                        <div className="flex justify-between items-start">
                            <div className={`${kpi.bg} ${kpi.color} p-4 rounded-2xl group-hover:scale-110 transition-transform`}>
                                {React.cloneElement(kpi.icon, { size: 24 })}
                            </div>
                            <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-lg ${kpi.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {kpi.trend.startsWith('+') ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                                {kpi.trend}
                            </div>
                        </div>
                        <div className="mt-6">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                            <h3 className="text-3xl font-black text-slate-900 mt-1">{kpi.value}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Chart */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 subtle-shadow"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-black text-slate-900">Revenue Performance</h2>
                        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500" /> Current Period</div>
                        </div>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.salesPeriod}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorAmount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Categories Chart */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 rounded-[2.5rem] border border-slate-100 subtle-shadow"
                >
                    <h2 className="text-xl font-black text-slate-900 mb-8">Market Share</h2>
                    <div className="h-64 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.revenueByCategory}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="revenue"
                                    nameKey="category"
                                >
                                    {stats.revenueByCategory.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</p>
                                <p className="text-lg font-black text-slate-900 leading-none">100%</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 space-y-3">
                        {stats.revenueByCategory.map((cat, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[idx % COLORS.length]}} />
                                    <span className="text-xs font-bold text-slate-600">{cat.category}</span>
                                </div>
                                <span className="text-xs font-black text-slate-900">${Number(cat.revenue).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Top Products */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 subtle-shadow overflow-hidden"
            >
                <div className="flex items-center justify-between mb-8 px-2">
                    <h2 className="text-xl font-black text-slate-900">Bestselling Products</h2>
                    <button className="text-sm font-bold text-primary hover:underline">View All Inventory</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="pb-5 px-4 font-bold text-slate-400 uppercase tracking-widest text-[10px]">Product Name</th>
                                <th className="pb-5 px-4 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-center">Units Sold</th>
                                <th className="pb-5 px-4 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-right">Total Revenue</th>
                                <th className="pb-5 px-4 font-bold text-slate-400 uppercase tracking-widest text-[10px] text-right">Performance</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {stats.topProducts.map((p, idx) => (
                                <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="py-5 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-400 group-hover:bg-white transition-colors">
                                                {p.name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-slate-900">{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-5 px-4 text-center font-bold text-slate-600">{p.total_sold}</td>
                                    <td className="py-5 px-4 text-right font-black text-slate-900">${Number(p.revenue).toLocaleString()}</td>
                                    <td className="py-5 px-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary rounded-full" style={{width: `${Math.min(100, (Number(p.total_sold) / 50) * 100)}%`}} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;
