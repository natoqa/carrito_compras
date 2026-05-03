import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Plus, Edit2, Trash2, Package, Search, X, 
    Save, Tag, DollarSign, Layers 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import ImageUploader from '../components/ImageUploader';

const InventoryCMS = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [editingProduct, setEditingProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category_id: '',
        image_url: '',
        min_stock_alert: 5
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                axios.get('/api/products'),
                axios.get('/api/products/categories') // Necesitaremos este endpoint
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data || []);
        } catch (err) {
            toast.error('Error al cargar datos del inventario');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price,
            stock: product.stock,
            category_id: product.category_id,
            image_url: product.image_url || '',
            min_stock_alert: product.min_stock_alert || 5
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadingToast = toast.loading(editingProduct ? 'Actualizando...' : 'Creando...');
        
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                category_id: parseInt(formData.category_id),
                min_stock_alert: parseInt(formData.min_stock_alert)
            };

            if (editingProduct) {
                await axios.put(`/api/products/${editingProduct.id}`, payload);
                toast.success('Producto actualizado', { id: loadingToast });
            } else {
                await axios.post('/api/products', payload);
                toast.success('Producto creado', { id: loadingToast });
            }
            
            setIsModalOpen(false);
            setEditingProduct(null);
            fetchData();
        } catch (err) {
            toast.error('Error al guardar producto', { id: loadingToast });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
        try {
            await axios.delete(`/api/products/${id}`);
            toast.success('Producto eliminado');
            fetchData();
        } catch (err) {
            toast.error('Error al eliminar');
        }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Inventory CMS</h1>
                    <p className="text-slate-500 mt-1 font-medium">Gestión directa de catálogo e imágenes.</p>
                </div>
                <button 
                    onClick={() => {
                        setEditingProduct(null);
                        setFormData({ name: '', description: '', price: '', stock: '', category_id: '', image_url: '', min_stock_alert: 5 });
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20"
                >
                    <Plus size={18} /> Nuevo Producto
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 subtle-shadow overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center gap-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                            placeholder="Buscar en el inventario..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-6 py-4 font-black text-[10px] text-slate-400 uppercase tracking-widest">Producto</th>
                                <th className="px-6 py-4 font-black text-[10px] text-slate-400 uppercase tracking-widest">Categoría</th>
                                <th className="px-6 py-4 font-black text-[10px] text-slate-400 uppercase tracking-widest">Precio</th>
                                <th className="px-6 py-4 font-black text-[10px] text-slate-400 uppercase tracking-widest">Stock</th>
                                <th className="px-6 py-4 font-black text-[10px] text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredProducts.map(product => (
                                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                                                <img src={product.image_url} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <span className="font-bold text-slate-900">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-black text-primary bg-primary/5 px-3 py-1 rounded-lg uppercase tracking-wider">
                                            {product.category_name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-black text-slate-900">${product.price}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${product.stock > product.min_stock_alert ? 'bg-emerald-500' : 'bg-destructive'}`} />
                                            <span className="font-bold text-slate-600">{product.stock}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleEdit(product)}
                                                className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 text-slate-400 hover:text-destructive hover:bg-destructive/5 rounded-xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Edición/Creación */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                                    {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white rounded-full transition-all text-slate-400">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Nombre del Producto</label>
                                        <div className="relative">
                                            <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <input 
                                                type="text" required
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Precio ($)</label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                                <input 
                                                    type="number" step="0.01" required
                                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                                    value={formData.price}
                                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Stock Inicial</label>
                                            <div className="relative">
                                                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                                <input 
                                                    type="number" required
                                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                                    value={formData.stock}
                                                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Categoría</label>
                                        <div className="relative">
                                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <select 
                                                required
                                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                                                value={formData.category_id}
                                                onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                                            >
                                                <option value="">Seleccionar...</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Descripción</label>
                                        <textarea 
                                            rows="4"
                                            className="w-full p-4 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                            value={formData.description}
                                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Imagen del Producto</label>
                                        <ImageUploader onUploadSuccess={(url) => setFormData({...formData, image_url: url})} />
                                        {formData.image_url && (
                                            <p className="mt-2 text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                                                <Save size={12} /> Imagen vinculada correctamente
                                            </p>
                                        )}
                                    </div>

                                    <div className="pt-8">
                                        <button 
                                            type="submit"
                                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-200"
                                        >
                                            Guardar Producto
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default InventoryCMS;
